/** Error with context and cause. */
export class ContextualError extends Error {
  /**
   * Creates a new `ContextualError`.
   * @param context brief description of the situation in which the error arose.
   * @param cause what caused the error to occur.
   */
  constructor(context: string, cause: any)
}
