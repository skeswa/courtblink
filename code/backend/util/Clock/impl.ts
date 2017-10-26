import { Cancellable, Clock, Repeatable } from './types'

/** Default implementation for the clock interface. */
export class ClockImpl implements Clock {
  millisSinceEpoch(): number {
    return Date.now()
  }

  repeat(fn: () => void): Repeatable {
    return new RepeatableImpl(fn)
  }

  wait(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration))
  }
}

/** Default implementation for the cancellable interface. */
class CancellableImpl implements Cancellable {
  private intervalRef: NodeJS.Timer | null
  private timeoutRef: NodeJS.Timer | null

  /**
   * Creates a new cancellable.
   * @param interval number of milliseconds between invocations of `fn`.
   * @param delay number of milliseconds before invocations of `fn` begin.
   * @param fn function to invoke evert `internval` milliseconds.
   */
  constructor(interval: number, delay: number, fn: () => void) {
    this.intervalRef = null
    this.timeoutRef = setTimeout(() => {
      this.timeoutRef = null
      this.intervalRef = setInterval(fn, interval)
    }, delay)
  }

  cancel(): void {
    // If the interval hasn't been scheduled yet, then clear the delay timeout
    // ref first.
    if (this.timeoutRef !== null) {
      clearTimeout(this.timeoutRef)
      this.timeoutRef = null
      return
    }

    // The interval has been scheduled, so it needs to be cleared.
    if (this.intervalRef !== null) {
      clearInterval(this.intervalRef)
      this.intervalRef = null
      return
    }

    throw new Error('`cancel()` cannot be called more than once')
  }
}

/** Default implementation for the repeatable interface. */
class RepeatableImpl implements Repeatable {
  private fn: () => void

  /**
   * Creates a new repeatable.
   * @param fn function to re-invoke later.
   */
  constructor(fn: () => void) {
    this.fn = fn
  }

  every(interval: number, delay?: number): Cancellable {
    return new CancellableImpl(interval, delay || 0, this.fn)
  }
}
