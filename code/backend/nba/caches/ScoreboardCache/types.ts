import { Scoreboard } from '../../../nba/api/schema'
import { EntityCache } from '../../../data/EntityCache'

/** Caches scoreboards. */
export interface ScoreboardCache extends EntityCache<Date, Scoreboard> {}

/** Strategy for creating a new `ScoreboardCache`. */
export enum ScoreboardCacheCreationStrategy {
  /** Updates the cache every minute. */
  UpdateEveryMinute = 'UpdateEveryMinute',
}
