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

  /** Creates a new cancellable. */
  constructor(interval: number, fn: () => void) {
    this.intervalRef = setInterval(fn, interval)
  }

  cancel(): void {
    if (this.intervalRef === null) {
      throw new Error('`cancel()` cannot be called more than once')
    }

    // Clear the interval and null to the ref to make sure cancel can't be
    // called again.
    clearInterval(this.intervalRef)
    this.intervalRef = null
  }
}

/** Default implementation for the repeatable interface. */
class RepeatableImpl implements Repeatable {
  private fn: () => void

  /** Creates a new repeatable. */
  constructor(fn: () => void) {
    this.fn = fn
  }

  every(interval: number): Cancellable {
    throw new Error('Method not implemented.')
  }
}
