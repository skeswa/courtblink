import { ConditionWaiterImpl } from './impl'
import { ConditionWaiter } from './types'

/**
 * Creates a new condition waiter.
 * @return the newly created condition waiter.
 */
export function createConditionWaiter(): ConditionWaiter {
  return new ConditionWaiterImpl()
}
