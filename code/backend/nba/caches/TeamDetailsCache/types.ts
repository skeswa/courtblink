import { TeamDetails } from '../../../nba/api/schema'
import { NamedEntityCache } from '../../../data/NamedEntityCache'

/** Caches team details. */
export interface TeamDetailsCache
  extends NamedEntityCache<string, string, TeamDetails> {}

/** Strategy for creating a new `TeamDetails`. */
export enum TeamDetailsCacheCreationStrategy {
  /** Updates the cache every year. */
  UpdateEveryYear = 'UpdateEveryYear',
}
