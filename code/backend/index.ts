import { createApiService, ApiServiceCreationStrategy } from './api/ApiService'
import {
  createGameLeadersBuilder,
  GameLeadersBuilderCreationStrategy,
} from './api/builders/GameLeadersBuilder'
import {
  createGameSummaryBuilder,
  GameSummaryBuilderCreationStrategy,
} from './api/builders/GameSummaryBuilder'
import {
  createSplashDataBuilder,
  SplashDataBuilderCreationStrategy,
} from './api/builders/SplashDataBuilder'
import {
  createNbaApiClient,
  NbaApiClientCreationStrategy,
} from './nba/api/NbaApiClient'
import {
  createBoxScoreCache,
  BoxScoreCacheCreationStrategy,
} from './nba/caches/BoxScoreCache'
import {
  createPlayerDetailsCache,
  PlayerDetailsCacheCreationStrategy,
} from './nba/caches/PlayerDetailsCache'
import {
  createScoreboardCache,
  ScoreboardCacheCreationStrategy,
} from './nba/caches/ScoreboardCache'
import {
  createTeamColorsCache,
  TeamColorsCacheCreationStrategy,
} from './nba/caches/TeamColorsCache'
import {
  createTeamDetailsCache,
  TeamDetailsCacheCreationStrategy,
} from './nba/caches/TeamDetailsCache'
import {
  createNbaColorService,
  NbaColorServiceCreationStrategy,
} from './nba/colors/NbaColorService'
import {
  createEntityCacheJanitor,
  EntityCacheJanitorCreationStrategy,
} from './networking/EntityCacheJanitor'
import {
  createHttpClient,
  HttpClientCreationStrategy,
} from './networking/HttpClient'
import {
  createHttpServer,
  HttpServer,
  HttpServerCreationStrategy,
} from './networking/HttpServer'
import {
  createTorClient,
  TorClientCreationStrategy,
} from './networking/TorClient'
import { createLogger, LoggerCreationStrategy } from './util/Logger'
import { ContextualError } from './util/ContextualError'

/** Sets up and starts the backend server. */
async function backend(): Promise<void> {
  try {
    //#region common

    // True if this server is running in production.
    const inProd = process.env.NODE_ENV === 'production'

    // Used by components within the backend to write to the log.
    const logger = createLogger(
      inProd ? LoggerCreationStrategy.ForProd : LoggerCreationStrategy.ForDev
    )

    //#endregion
    //#region networking

    // TODO(skeswa): get the tor executable name from an evvironment variable.
    // Client for communicating with the tor proxy.
    const torClient = createTorClient(
      TorClientCreationStrategy.WithATorProcess,
      logger,
      'tor'
    )

    // Client used to make HTTP requests.
    const httpClient = createHttpClient(
      HttpClientCreationStrategy.WithAProxy,
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
    const httpServer = createHttpServer(
      HttpServerCreationStrategy.UsingKoa,
      // TODO(skeswa): use environment variable for the port.
      3001,
      apiService,
      logger
    )

    //#endregion
    //#region error-handling

    // Protect the server from uncaught exceptions.
    process.on('uncaughtException', err =>
      logger.error('handler:error', 'Encountered an uncaught error', err)
    )

    // Protect the server from enhandled rejections.
    process.on('unhandledRejection', reason =>
      logger.error(
        'handler:error',
        'Encountered an unhandled rejection',
        reason
      )
    )

    // Perform all necessary cleanup when the process exits.
    process.on('exit', () => {
      logger.info('handler:exit', 'Performing process clean up before exiting')

      try {
        torClient.disconnect()
        cacheJanitor.stop()
        httpServer.stop()
      } catch (err) {
        logger.error(
          'handler:exit',
          'Tried and failed to gracefully shutdown the server',
          err
        )
      }
    })

    //#endregion

    // Start all the services.
    await torClient.connect()
    cacheJanitor.start()
    httpServer.start()
  } catch (err) {
    throw new ContextualError('Failed to execute the backend server', err)
  }
}

// Sets up and executes the backend.
backend().catch(err => console.error('Backend exited with an error:', err))
