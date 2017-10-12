import { EntityCache } from '../../data/EntityCache'
import { Cancellable, Clock } from '../../util/Clock'
import { Logger } from '../../util/Logger'

import { EntityCacheJanitor } from './types'

// Log tag that identifies this module.
const tag = 'cache:janitor'

// How often to perform cleanup.
const cleanupPeriod = 60 * 60 * 1000 /* 1 hr in milliseconds */

/** Performs cache garbage collection every hour. */
export class HourlyEntityCacheJanitor implements EntityCacheJanitor {
  private caches: EntityCache<any, any>[]
  private clock: Clock
  private interval: Cancellable | null
  private logger: Logger

  /**
   * Creates a new `HourlyEntityCacheJanitor`.
   * @param caches collection of caches to be cleaned up on a fixed interval.
   * @param clock time utility.
   * @param logger logging utility.
   */
  constructor(caches: EntityCache<any, any>[], clock: Clock, logger: Logger) {
    this.caches = caches
    this.clock = clock
    this.interval = null
    this.logger = logger
  }

  start(): void {
    if (this.interval) {
      throw new Error('Cannot start the janitor if it has already been started')
    }

    this.logger.info(
      tag,
      'Scheduling cache garbage collection on an hourly basis'
    )

    // Schedules `cleanupCaches()` to be called every hour.
    this.interval = this.clock
      .repeat(() => this.cleanupCaches())
      .every(cleanupPeriod)
  }

  stop(): void {
    if (!this.interval) {
      throw new Error('Cannot stop the janitor if it has not been started')
    }

    this.logger.info(tag, 'Halting scheduled cache garbage collection')

    // Cancel the interval, then mark it as cancelled by nulling it.
    this.interval.cancel()
    this.interval = null
  }

  /** Collects garbage on all the caches. */
  private cleanupCaches() {
    try {
      this.caches.forEach(cache => cache.collectGarbage())
    } catch (err) {
      this.logger.error(tag, 'Failed to perform scheduled cleanup', err)
    }
  }
}
