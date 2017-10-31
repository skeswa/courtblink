import { TeamRating } from '../../../bbr/api/schema'
import { NamedEntityCache } from '../../../data/NamedEntityCache'

/** Caches team ratings. */
export interface TeamRatingsCache
  extends NamedEntityCache<string, string, TeamRating> {}

/** Strategy for creating a new `TeamRatings`. */
export enum TeamRatingsCacheCreationStrategy {
  /** Updates the cache every day. */
  UpdateEveryDay = 'UpdateEveryDay',
}
