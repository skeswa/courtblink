import { Game } from '../../../../nba/api/schema'
import { BoxScoreCache } from '../../../../nba/caches/BoxScoreCache'
import { PlayerDetailsCache } from '../../../../nba/caches/PlayerDetailsCache'
import { ContextualError } from 'common/util/ContextualError'

import { calculateTeamLeaders } from './helpers'
import { GameLeaders, GameLeadersBuilder, TeamLeaders } from './types'

/** Uses caches to help build new game leader objects. */
export class CachedGameLeadersBuilder implements GameLeadersBuilder {
  private boxScoreCache: BoxScoreCache
  private playerDetailsCache: PlayerDetailsCache

  /**
   * Creates a new `CachedGameLeadersBuilder`.
   * @param boxScoreCache caches box scores of games.
   * @param playerDetailsCache caches details about players.
   */
  constructor(
    boxScoreCache: BoxScoreCache,
    playerDetailsCache: PlayerDetailsCache
  ) {
    this.boxScoreCache = boxScoreCache
    this.playerDetailsCache = playerDetailsCache
  }

  async build(game: Game): Promise<GameLeaders> {
    try {
      // Get the box score to figure out the game leaders.
      const boxScore = await this.boxScoreCache.retrieveById({
        date: new Date(game.startTimeUTC),
        gameId: game.gameId,
      })

      // If there is no box score, exit early and empty.
      if (!boxScore) return { homeTeam: {}, awayTeam: {} }

      // Get the home and away team game leaders in parallel.
      const [homeTeam, awayTeam] = await Promise.all([
        calculateTeamLeaders(
          boxScore,
          game.hTeam.teamId,
          this.playerDetailsCache
        ),
        calculateTeamLeaders(
          boxScore,
          game.vTeam.teamId,
          this.playerDetailsCache
        ),
      ])

      return { homeTeam, awayTeam }
    } catch (err) {
      throw new ContextualError(
        'Failed to build a new game leaders object',
        err
      )
    }
  }
}
