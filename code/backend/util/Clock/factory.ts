import { ClockImpl } from './impl'
import { Clock } from './types'

/** Creates a new clock. */
export function createClock(): Clock {
  return new ClockImpl()
}
