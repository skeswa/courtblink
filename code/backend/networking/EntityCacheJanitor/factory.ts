import { EntityCache } from '../../networking/EntityCache'
import { Logger } from '../../util/Logger'

import { HourlyEntityCacheJanitor } from './impl-hourly'
import { EntityCacheJanitor, EntityCacheJanitorCreationStrategy } from './types'

/**
 * Creates a new entity cache janitor.
 * @param strategy the creation strategy to use.
 * @param logger logging utility.
 * @param caches collection of caches to be cleaned up on a fixed interval.
 * @return the newly created entity cache janitor.
 */
export function createEntityCacheJanitor(
  strategy: EntityCacheJanitorCreationStrategy.Hourly,
  logger: Logger,
  ...caches: EntityCache<any, any>[]
): EntityCacheJanitor {
  return new HourlyEntityCacheJanitor(caches, logger)
}
