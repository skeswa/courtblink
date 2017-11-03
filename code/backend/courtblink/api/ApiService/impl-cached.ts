import { SplashDataBuilder } from '../../../courtblink/api/builders/SplashDataBuilder'
import { Scoreboard } from '../../../nba/api/schema'
import { ScoreboardCache } from '../../../nba/caches/ScoreboardCache'
import { TeamNewsCache } from '../../../nba/caches/TeamNewsCache'
import { yyyymmdd } from '../../../../common/util/date/helpers'
import { Logger } from '../../../util/Logger'
import { IGameNews, ISplashData } from 'common/api/schema/generated'
import { ContextualError } from 'common/util/ContextualError'

import { ApiService } from './types'

// Log tag that identifies this module.
const tag = 'courtblink:api'

/** API service that leverages caching to stay fast. */
export class CachedApiService implements ApiService {
  private logger: Logger
  private scoreboardCache: ScoreboardCache
  private splashDataBuilder: SplashDataBuilder
  private teamNewsCache: TeamNewsCache

  /**
   * Creates a new `CachedApiService`.
   *
   * @param logger logging utility.
   * @param scoreboardCache caches the NBA scoreboard.
   * @param splashDataBuilder constructs splash data.
   * @param teamNewsCache caches team news.
   */
  constructor(
    logger: Logger,
    scoreboardCache: ScoreboardCache,
    splashDataBuilder: SplashDataBuilder,
    teamNewsCache: TeamNewsCache
  ) {
    this.logger = logger
    this.scoreboardCache = scoreboardCache
    this.splashDataBuilder = splashDataBuilder
    this.teamNewsCache = teamNewsCache
  }

  async fetchGameNews(
    awayTeamUrlName: string,
    homeTeamUrlName: string
  ): Promise<IGameNews> {
    this.logger.debug(
      tag,
      `Fetching game news for "${awayTeamUrlName}@${homeTeamUrlName}"`
    )

    try {
      // Fetch the news for both teams in parallel.
      const [awayTeamArticles, homeTeamArticles] = await Promise.all([
        this.teamNewsCache.retrieveByName(awayTeamUrlName),
        this.teamNewsCache.retrieveByName(homeTeamUrlName),
      ])

      return { awayTeamArticles, homeTeamArticles }
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch game news for "${awayTeamUrlName}@${homeTeamUrlName}"`,
        err
      )
    }
  }

  async fetchSplashData(yyyymmdd: string): Promise<ISplashData> {
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
