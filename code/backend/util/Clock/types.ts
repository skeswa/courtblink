/** Type returned by `Repeatable#every(...)`. */
export interface Cancellable {
  /** Cancels the repeating interval. */
  cancel(): void
}

/** Time-related utility. */
export interface Clock {
  /**
   * Gets the total number of milliseconds since Jan. 1, 2017.
   * @return the time elapsed since the epoch.
   */
  millisSinceEpoch(): number

  /**
   * Wraps the provided function in a Repeatable that can be used to schedule
   * recurring invocations of the function over a fixed interval.
   * @param fn function used to create the Repeatable.
   * @return a new Repeatable.
   */
  repeat(fn: () => void): Repeatable

  /**
   * Creates a prmoise that resolves after the specified duration.
   * @param how long to wait for.
   */
  wait(duration: number): Promise<void>
}

/** Type returned by `Clock#repeat(...)`. */
export interface Repeatable {
  /**
   * Schedules a function to be called every `duration` milliseconds.
   * @param duration interval duration each function invocation.
   * @param delay time before scheduling the repeasting function invocations.
   */
  every(duration: number, delay?: number): Cancellable
}
