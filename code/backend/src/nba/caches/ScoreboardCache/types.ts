import { EntityCache } from 'networking/EntityCache'
import { Scoreboard } from 'nba/api/schema'

/** Caches scoreboards. */
export interface ScoreboardCache extends EntityCache<Date, Scoreboard> {}

/** Strategy for creating a new `ScoreboardCache`. */
export enum ScoreboardCacheCreationStrategy {
  /** Updates the cache every minute. */
  UpdateEveryMinute = 'UpdateEveryMinute',
}
