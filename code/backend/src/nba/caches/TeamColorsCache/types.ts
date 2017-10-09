import { TeamColors } from '../../../nba/colors/NbaColorService'
import { NamedEntityCache } from '../../../networking/NamedEntityCache'

/** Caches team colors. */
export interface TeamColorsCache
  extends NamedEntityCache<string, string, TeamColors> {}

/** Represents an entry in the cache. */
export type TeamColorsCacheEntry = {
  /** When this entry was last changed, */
  dateLastUpdated: Date
  /** The value of this cache entry. */
  teamColors: TeamColors
}

/** Strategy for creating a new `TeamColors`. */
export enum TeamColorsCacheCreationStrategy {
  /** Updates the cache every year. */
  UpdateEveryYear = 'UpdateEveryYear',
}
