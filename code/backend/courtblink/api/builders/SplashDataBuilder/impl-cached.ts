import { GameSummaryBuilder } from '../../../api/builders/GameSummaryBuilder'
import { Scoreboard } from '../../../../nba/api/schema'
import { TeamDetailsCache } from '../../../../nba/caches/TeamDetailsCache'
import { TeamNewsCache } from '../../../../nba/caches/TeamNewsCache'
import { Clock } from '../../../../util/Clock'
import { IGameNews, ISplashData } from 'common/api/schema/generated'
import { ContextualError } from 'common/util/ContextualError'

import { SplashDataBuilder } from './types'

/** Uses caches to help build new splash data. */
export class CachedSplashDataBuilder implements SplashDataBuilder {
  private clock: Clock
  private gameSummaryBuilder: GameSummaryBuilder
  private teamDetailsCache: TeamDetailsCache
  private teamNewsCache: TeamNewsCache

  /**
   * Creates a new `CachedSplashDataBuilder`.
   * @param clock time utility.
   * @param gameSummaryBuilder builds game summaries.
   * @param teamDetailsCache caches team details.
   * @param teamNewsCache caches team news.
   */
  constructor(
    clock: Clock,
    gameSummaryBuilder: GameSummaryBuilder,
    teamDetailsCache: TeamDetailsCache,
    teamNewsCache: TeamNewsCache
  ) {
    this.clock = clock
    this.gameSummaryBuilder = gameSummaryBuilder
    this.teamDetailsCache = teamDetailsCache
    this.teamNewsCache = teamNewsCache
  }

  async build(scoreboard: Scoreboard | undefined): Promise<ISplashData> {
    // If there is no scoreboard, exit early with no games in the splash.
    if (!scoreboard || !scoreboard.games || scoreboard.games.length < 1) {
      return {}
    }

    try {
      // Get the ids of the teams in the first game.
      const {
        hTeam: { teamId: firstGameHomeTeamId },
        startTimeUTC,
        vTeam: { teamId: firstGameAwayTeamId },
      } = scoreboard.games[0]

      // Check if the game has started yet.
      const hasGameStarted =
        this.clock.millisSinceEpoch() >= new Date(startTimeUTC).getTime()
      const shouldIncludeGameNews = !hasGameStarted

      // Turn all the games into game summaries.
      const [awayTeamDetails, homeTeamDetails, games] = await Promise.all([
        shouldIncludeGameNews
          ? this.teamDetailsCache.retrieveById(firstGameAwayTeamId)
          : Promise.resolve(undefined),
        shouldIncludeGameNews
          ? this.teamDetailsCache.retrieveById(firstGameHomeTeamId)
          : Promise.resolve(undefined),
        Promise.all(
          scoreboard.games.map(game => this.gameSummaryBuilder.build(game))
        ),
      ])

      // Get game news only if necessary.
      let firstGameNews: IGameNews | undefined
      if (shouldIncludeGameNews) {
        // Make sure that the first game team details exist before getting game
        // news.
        if (!awayTeamDetails || !homeTeamDetails) {
          throw new Error(
            `Could not get game news since one or both first team details ` +
              `were unavailable`
          )
        }

        // Use the team details to get team news
        const [awayTeamArticles, homeTeamArticles] = await Promise.all([
          this.teamNewsCache.retrieveByName(awayTeamDetails.urlName),
          this.teamNewsCache.retrieveByName(homeTeamDetails.urlName),
        ])

        firstGameNews = { awayTeamArticles, homeTeamArticles }
      }

      // Use the game summaries to create the splash data.
      return { firstGameNews, games }
    } catch (err) {
      throw new ContextualError('Failed to build splash data', err)
    }
  }
}
