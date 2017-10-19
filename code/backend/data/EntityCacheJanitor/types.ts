/** Responsible for performing garbage collection on its registered caches. */
export interface EntityCacheJanitor {
  /** Starts performing garbage collection on a fixed interval. */
  start(): void
  /** Stops performing garbage collection. */
  stop(): void
}

/** Strategy for creating a new `EntityCacheJanitor`. */
export enum EntityCacheJanitorCreationStrategy {
  /** Performs cleanup hourly. */
  Hourly = 'Hourly',
}
