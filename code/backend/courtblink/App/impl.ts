//#region imports

import {
  createApiService,
  ApiServiceCreationStrategy,
} from '../../courtblink/api/ApiService'
import {
  createApiTrafficSimulator,
  ApiTrafficSimulator,
  ApiTrafficSimulatorCreationStrategy,
} from '../../courtblink/api/ApiTrafficSimulator'
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
  NbaApiClient,
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
import { ContextualError } from 'common/util/ContextualError'

import { App } from './types'
//#endregion

// Log tag that identifies this module.
const tag = 'courtblink:app'

/** The courtlink backend application type. */
export class AppImpl implements App {
  private apiTrafficSimulator: ApiTrafficSimulator | null
  private cacheJanitor: EntityCacheJanitor | null
  private logger: Logger | null
  private nbaApiClient: NbaApiClient | null
  private server: Server | null
  private torClient: TorClient | null

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

    // Simulates traffic to the API to keep the caches hot.
    const apiTrafficSimulator = createApiTrafficSimulator(
      ApiTrafficSimulatorCreationStrategy.UpdateEveryMinute,
      apiService,
      clock,
      logger
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

    this.apiTrafficSimulator = apiTrafficSimulator
    this.cacheJanitor = cacheJanitor
    this.logger = logger
    this.nbaApiClient = nbaApiClient
    this.server = httpServer
    this.torClient = torClient
  }

  async start(): Promise<void> {
    if (
      !this.apiTrafficSimulator ||
      !this.cacheJanitor ||
      !this.logger ||
      !this.nbaApiClient ||
      !this.server ||
      !this.torClient
    ) {
      throw new Error(
        'Cannot start if any internal state was not initialized correctly'
      )
    }

    try {
      // Kick off the connection.
      await this.torClient.connect()

      // Wait for the API to be reachable.
      if (!await this.nbaApiClient.isReachable()) {
        throw new Error('Could not reach the NBA API')
      }

      this.logger.info(tag, 'Established a connection to the NBA API')

      // Start all the things now that there is a connection.
      this.apiTrafficSimulator.start()
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
    if (
      !this.apiTrafficSimulator ||
      !this.cacheJanitor ||
      !this.logger ||
      !this.nbaApiClient ||
      !this.server ||
      !this.torClient
    ) {
      throw new Error(
        'Cannot stop if any internal state was not initialized correctly'
      )
    }

    try {
      // Kill the synchronous stuff first.
      this.apiTrafficSimulator.stop()
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

    this.apiTrafficSimulator = null
    this.cacheJanitor = null
    this.logger = null
    this.nbaApiClient = null
    this.server = null
    this.torClient = null
  }
}
