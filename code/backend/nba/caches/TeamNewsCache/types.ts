import { NamedEntityCache } from '../../../data/NamedEntityCache'
import { NewsArticle } from '../../../nba/api/schema'

/** Caches team news. */
export interface TeamNewsCache
  extends NamedEntityCache<null, string, NewsArticle[]> {}

/** Strategy for creating a new `TeamNewsCache`. */
export enum TeamNewsCacheCreationStrategy {
  /** Updates the cache every day. */
  UpdateEveryDay = 'UpdateEveryDay',
}
