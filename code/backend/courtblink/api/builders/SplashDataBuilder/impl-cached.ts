import { GameSummaryBuilder } from '../../../api/builders/GameSummaryBuilder'
import { SplashData } from '../../../api/schema'
import { Scoreboard } from '../../../../nba/api/schema'
import { ContextualError } from '../../../../util/ContextualError'

import { SplashDataBuilder } from './types'

/** Uses caches to help build new splash data. */
export class CachedSplashDataBuilder implements SplashDataBuilder {
  private gameSummaryBuilder: GameSummaryBuilder

  /**
   * Creates a new `CachedSplashDataBuilder`.
   * @param gameSummaryBuilder builds game summaries.
   */
  constructor(gameSummaryBuilder: GameSummaryBuilder) {
    this.gameSummaryBuilder = gameSummaryBuilder
  }

  async build(scoreboard: Scoreboard | undefined): Promise<SplashData> {
    // If there is no scoreboard, exit early with no games in thr splash.
    if (!scoreboard) return SplashData.create({})

    try {
      // Turn all the games into game summaries.
      const gameSummaries = await Promise.all(
        scoreboard.games.map(game => this.gameSummaryBuilder.build(game))
      )

      // Use the game summaries to create the splash data.
      return SplashData.create({ games: gameSummaries })
    } catch (err) {
      throw new ContextualError('Failed to build splash data', err)
    }
  }
}
