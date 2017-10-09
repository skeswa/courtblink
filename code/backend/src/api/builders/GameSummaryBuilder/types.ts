import { GameSummary } from '../../../api/schema'
import { Game } from '../../../nba/api/schema'

/** Builds game summaries. */
export interface GameSummaryBuilder {
  /**
   * Uses the provided game to build a new game summary.
   * @param game game used to build the game summary.
   * @return a new game summary.
   */
  build(game: Game): Promise<GameSummary>
}

/** Strategy for creating a new `GameSummaryBuilder`. */
export enum GameSummaryBuilderCreationStrategy {
  /** Uses caches to help build game summaries. */
  UsingCaches = 'UsingCaches',
}
