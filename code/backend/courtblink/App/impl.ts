//#region imports

import {
  createApiService,
  ApiServiceCreationStrategy,
} from '../../courtblink/api/ApiService'
import {
  createGameLeadersBuilder,
  GameLeadersBuilderCreationStrategy,
} from '../../courtblink/api/builders/GameLeadersBuilder'
import {
  createGameSummaryBuilder,
  GameSummaryBuilderCreationStrategy,
} from '../../courtblink/api/builders/GameSummaryBuilder'
import {
  createSplashDataBuilder,
  SplashDataBuilderCreationStrategy,
} from '../../courtblink/api/builders/SplashDataBuilder'
import {
  createEntityCacheJanitor,
  EntityCacheJanitor,
  EntityCacheJanitorCreationStrategy,
} from '../../data/EntityCacheJanitor'
import {
  createNbaApiClient,
  NbaApiClientCreationStrategy,
} from '../../nba/api/NbaApiClient'
import {
  createBoxScoreCache,
  BoxScoreCacheCreationStrategy,
} from '../../nba/caches/BoxScoreCache'
import {
  createPlayerDetailsCache,
  PlayerDetailsCacheCreationStrategy,
} from '../../nba/caches/PlayerDetailsCache'
import {
  createScoreboardCache,
  ScoreboardCacheCreationStrategy,
} from '../../nba/caches/ScoreboardCache'
import {
  createTeamColorsCache,
  TeamColorsCacheCreationStrategy,
} from '../../nba/caches/TeamColorsCache'
import {
  createTeamDetailsCache,
  TeamDetailsCacheCreationStrategy,
} from '../../nba/caches/TeamDetailsCache'
import {
  createNbaColorService,
  NbaColorServiceCreationStrategy,
} from '../../nba/colors/NbaColorService'
import {
  createHttpClient,
  HttpClientCreationStrategy,
} from '../../networking/HttpClient'
import {
  createServer,
  Server,
  ServerCreationStrategy,
  ServerEndpointRoutes,
} from '../../courtblink/Server'
import {
  createTorClient,
  TorClient,
  TorClientCreationStrategy,
} from '../../networking/TorClient'
import { Clock, createClock } from '../../util/Clock'
import { createLogger, Logger, LoggerCreationStrategy } from '../../util/Logger'
import { ContextualError } from '../../util/ContextualError'

import { App } from './types'
//#endregion

/** The courtlink backend application type. */
export class AppImpl implements App {
  private cacheJanitor: EntityCacheJanitor
  private server: Server
  private torClient: TorClient

  /**
   * Creates a new new courtblink backend app.
   * @param endpoints specifies the routes to use for different server
   *     endpoints.
   * @param inProd true if this application is running in production.
   * @param port port over which this server responds to HTTP requests.
   * @param torExecutableName name of the tor executable in the host OS.
   */
  constructor(
    endpoints: ServerEndpointRoutes,
    inProd: boolean,
    logger: Logger,
    port: number,
    torExecutableName: string
  ) {
    // Instantiate the time utility.
    const clock = createClock()

    //#region networking

    // Client for communicating with the tor proxy.
    const torClient = createTorClient(
      TorClientCreationStrategy.WithATorProcess,
      clock,
      logger,
      torExecutableName
    )

    // Client used to make HTTP requests.
    const httpClient = createHttpClient(
      HttpClientCreationStrategy.WithAProxy,
      logger,
      torClient
    )

    // Client used to communicate with the NBA API.
    const nbaApiClient = createNbaApiClient(
      NbaApiClientCreationStrategy.UsingNbaHttpApi,
      logger,
      httpClient
    )
    //#endregion

    //#region caching

    // Used to cache NBA box scores.
    const boxScoreCache = createBoxScoreCache(
      BoxScoreCacheCreationStrategy.UpdateEveryMinute,
      clock,
      logger,
      nbaApiClient
    )

    // Used to get color data about the NBA.
    const nbaColorService = createNbaColorService(
      NbaColorServiceCreationStrategy.UsingStaticColors,
      logger
    )

    // Used to cache NBA players.
    const playerDetailsCache = createPlayerDetailsCache(
      PlayerDetailsCacheCreationStrategy.UpdateEveryYear,
      logger,
      nbaApiClient
    )

    // Used to cache the NBA scoreboard.
    const scoreboardCache = createScoreboardCache(
      ScoreboardCacheCreationStrategy.UpdateEveryMinute,
      clock,
      logger,
      nbaApiClient
    )

    // Used to cache NBA team colors.
    const teamColorsCache = createTeamColorsCache(
      TeamColorsCacheCreationStrategy.UpdateEveryYear,
      logger,
      nbaColorService
    )

    // Used to cache details about NBA teams.
    const teamDetailsCache = createTeamDetailsCache(
      TeamDetailsCacheCreationStrategy.UpdateEveryYear,
      logger,
      nbaApiClient
    )

    // Cleans up caches once an hour.
    const cacheJanitor = createEntityCacheJanitor(
      EntityCacheJanitorCreationStrategy.Hourly,
      clock,
      logger,
      boxScoreCache,
      scoreboardCache,
      playerDetailsCache,
      teamColorsCache,
      teamDetailsCache
    )
    //#endregion

    //#region builders

    // Used to build game leader objects.
    const gameLeadersBuilder = createGameLeadersBuilder(
      GameLeadersBuilderCreationStrategy.UsingCaches,
      boxScoreCache,
      playerDetailsCache
    )

    // Builds summaries of NBA games.
    const gameSummaryBuilder = createGameSummaryBuilder(
      GameSummaryBuilderCreationStrategy.UsingCaches,
      boxScoreCache,
      clock,
      gameLeadersBuilder,
      playerDetailsCache,
      teamColorsCache,
      teamDetailsCache
    )

    // Builds splash data for the API to use.
    const splashDataBuilder = createSplashDataBuilder(
      SplashDataBuilderCreationStrategy.UsingCaches,
      gameSummaryBuilder
    )
    //#endregion

    //#region services

    // Implements all the RPCs exposed by courtblink.
    const apiService = createApiService(
      ApiServiceCreationStrategy.UsingCaches,
      logger,
      scoreboardCache,
      splashDataBuilder
    )

    // Responds to HTTP requests.
    const httpServer = createServer(
      ServerCreationStrategy.UsingDefaultNodeServer,
      apiService,
      clock,
      endpoints,
      logger,
      port
    )
    //#endregion

    this.cacheJanitor = cacheJanitor
    this.server = httpServer
    this.torClient = torClient
  }

  async start(): Promise<void> {
    try {
      // Start all the services.
      await this.torClient.connect()
      this.cacheJanitor.start()
      this.server.start()
    } catch (err) {
      throw new ContextualError(
        'Failed to start the courtblink backend app',
        err
      )
    }
  }

  async stop(): Promise<void> {
    try {
      // Kill the cache janitor first because it is synchronous.
      this.cacheJanitor.stop()

      // Wait for the tor client to exit asynchronously. Then wait for the
      // HTTP server to finish asynchronously. Then kill the
      // process once it is done.
      await Promise.all([this.torClient.disconnect(), this.server.stop()])
    } catch (err) {
      throw new ContextualError(
        'Failed to stop the courtblink backend app',
        err
      )
    }
  }
}
