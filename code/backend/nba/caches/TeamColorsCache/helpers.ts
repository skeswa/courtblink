import { TeamColorsCacheEntry } from './types'

/**
 * Returns true if the provided entry is now invalid.
 * @param entry the cache entry to evaluate.
 * @return true if the provided entry is now invalid.
 */
export function isYearByYearCacheEntryStale(
  entry: TeamColorsCacheEntry
): boolean {
  return new Date().getFullYear() > entry.dateLastUpdated.getFullYear()
}
