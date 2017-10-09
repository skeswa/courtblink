import { EntityCache } from '../../../networking/EntityCache'
import { BoxScore } from '../../../nba/api/schema'

/** Id of the a box score. */
export type BoxScoreId = {
  /** Date of the game that the box score reflects. */
  date: Date,
  /** Id of the game that the box score reflects. */
  gameId: string,
}

/** Caches box scores. */
export interface BoxScoreCache extends EntityCache<BoxScoreId, BoxScore> {}

/** Strategy for creating a new `BoxScoreCache`. */
export enum BoxScoreCacheCreationStrategy {
  /** Updates the cache every minute. */
  UpdateEveryMinute = 'UpdateEveryMinute',
}
