import { PlayerDetails } from '../../../nba/api/schema'
import { EntityCache } from '../../../data/EntityCache'

/** Caches player details. */
export interface PlayerDetailsCache
  extends EntityCache<string, PlayerDetails> {}

/** Strategy for creating a new `PlayerDetails`. */
export enum PlayerDetailsCacheCreationStrategy {
  /** Updates the cache every year. */
  UpdateEveryYear = 'UpdateEveryYear',
}
