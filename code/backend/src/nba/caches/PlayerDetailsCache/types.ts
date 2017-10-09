import { EntityCache } from 'networking/EntityCache'
import { PlayerDetails } from 'nba/api/schema'

/** Caches player details. */
export interface PlayerDetailsCache
  extends EntityCache<string, PlayerDetails> {}

/** Strategy for creating a new `PlayerDetails`. */
export enum PlayerDetailsCacheCreationStrategy {
  /** Updates the cache every year. */
  UpdateEveryYear = 'UpdateEveryYear',
}
