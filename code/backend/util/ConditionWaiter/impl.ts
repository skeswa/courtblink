import { ConditionWaiter } from './types'

/** Default implementation for the condition waiter. */
export class ConditionWaiterImpl implements ConditionWaiter {
  async wait(
    condition: () => Promise<boolean>,
    maxAttempts: number
  ): Promise<boolean> {
    // Wait for the condition to evaluate to true.
    for (let i = 0; i < maxAttempts; i++) {
      if (await condition()) {
        return true
      }
    }

    // The condition wasn't true before max attempts was reached.
    return false
  }
}
