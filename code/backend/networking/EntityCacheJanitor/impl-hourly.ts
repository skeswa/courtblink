import { EntityCache } from '../../networking/EntityCache'
import { Logger } from '../../util/Logger'

import { EntityCacheJanitor } from './types'

// Log tag that identifies this module.
const tag = 'cache:janitor'

/** Performs cache garbage collection every hour. */
export class HourlyEntityCacheJanitor implements EntityCacheJanitor {
  private caches: EntityCache<any, any>[]
  private timer: NodeJS.Timer
  private logger: Logger

  /**
   * Creates a new `HourlyEntityCacheJanitor`.
   * @param caches collection of caches to be cleaned up on a fixed interval.
   * @param logger logging utility.
   */
  constructor(caches: EntityCache<any, any>[], logger: Logger) {
    this.caches = caches
    this.logger = logger
  }

  start(): void {
    if (this.timer) {
      throw new Error('Cannot start the janitor if it has already been started')
    }

    this.logger.info(
      tag,
      'Scheduling cache garbage collection on an hourly basis'
    )

    // Schedules `cleanupCaches()` to be called every hour.
    this.timer = setInterval(() => this.cleanupCaches(), 60 * 60 * 1000)
  }

  stop(): void {
    if (!this.timer) {
      throw new Error('Cannot stop the janitor if it has not been started')
    }

    this.logger.info(tag, 'Halting scheduled cache garbage collection')
    clearInterval(this.timer)
  }

  /** Collects garbage on all the caches. */
  private cleanupCaches() {}
}
