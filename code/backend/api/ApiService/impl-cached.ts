import { SplashDataBuilder } from '../../api/builders/SplashDataBuilder'
import { SplashData } from '../../api/schema'
import { Scoreboard } from '../../nba/api/schema'
import { ScoreboardCache } from '../../nba/caches/ScoreboardCache'
import { ContextualError } from '../../util/ContextualError'
import { yyyymmdd } from '../../util/date/helpers'
import { Logger } from '../../util/Logger'

import { ApiService } from './types'

// The tag used for logging.
const tag = 'courtblink:api'

/** API service that leverages caching to stay fast. */
export class CachedApiService implements ApiService {
  private logger: Logger
  private scoreboardCache: ScoreboardCache
  private splashDataBuilder: SplashDataBuilder

  /**
   * Creates a new `CachedApiService`.
   *
   * @param logger logging utility.
   * @param scoreboardCache caches the NBA scoreboard.
   * @param splashDataBuilder constructs splash data.
   */
  constructor(
    logger: Logger,
    scoreboardCache: ScoreboardCache,
    splashDataBuilder: SplashDataBuilder
  ) {
    this.logger = logger
    this.scoreboardCache = scoreboardCache
    this.splashDataBuilder = splashDataBuilder
  }

  async fetchSplashData(date: Date): Promise<SplashData> {
    const dateString = yyyymmdd(date)
    this.logger.debug(tag, `Fetching splash data for date "${dateString}"`)

    try {
      // The splash is based on the scoreboard, so fetch that first.
      const scoreboard = await this.scoreboardCache.retrieveById(date)

      // Use the scoreboard to build the splash data.
      const splashData = await this.splashDataBuilder.build(scoreboard)

      return splashData
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch splash data for for date "${dateString}"`,
        err
      )
    }
  }
}
