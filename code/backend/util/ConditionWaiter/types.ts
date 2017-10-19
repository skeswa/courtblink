/** Utility used to wait until a condition is true. */
export interface ConditionWaiter {
  /**
   * Waits for the provided condition to become true, or for the maximum number
   * of attempts to be reached.
   * @param condition condition to check.
   * @param maxAttempts the maximum number of times to evaluate the condition.
   * @return true if the condition ever evaluated to true, or false otherwise.
   */
  wait(condition: () => Promise<boolean>, maxAttempts: number): Promise<boolean>
}
