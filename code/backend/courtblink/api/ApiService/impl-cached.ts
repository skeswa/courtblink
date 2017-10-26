import { SplashDataBuilder } from '../../../courtblink/api/builders/SplashDataBuilder'
import { Scoreboard } from '../../../nba/api/schema'
import { ScoreboardCache } from '../../../nba/caches/ScoreboardCache'
import { yyyymmdd } from '../../../../common/util/date/helpers'
import { Logger } from '../../../util/Logger'
import { SplashData } from 'common/api/schema/generated'
import { ContextualError } from 'common/util/ContextualError'

import { ApiService } from './types'

// Log tag that identifies this module.
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

  async fetchSplashData(yyyymmdd: string): Promise<SplashData> {
    this.logger.debug(tag, `Fetching splash data for date "${yyyymmdd}"`)

    try {
      // The splash is based on the scoreboard, so fetch that first.
      const scoreboard = await this.scoreboardCache.retrieveById(yyyymmdd)

      // Use the scoreboard to build the splash data.
      const splashData = await this.splashDataBuilder.build(scoreboard)

      return splashData
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch splash data for for date "${yyyymmdd}"`,
        err
      )
    }
  }
}
