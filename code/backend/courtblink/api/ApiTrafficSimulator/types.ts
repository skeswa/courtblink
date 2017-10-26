/** Simulates a small amount of traffic to keep the API server on its toes. */
export interface ApiTrafficSimulator {
  /** Starts simulating traffic. */
  start(): void

  /** Stops simulating traffic. */
  stop(): void
}

/** Strategy for creating a new `ApiTrafficSimulator`. */
export enum ApiTrafficSimulatorCreationStrategy {
  /** Updates the cache every minute. */
  UpdateEveryMinute = 'UpdateEveryMinute',
}
