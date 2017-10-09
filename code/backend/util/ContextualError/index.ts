/** Error with context and cause. */
export class ContextualError extends Error {
  constructor(context: string, cause: any) {
    // 'Error' breaks prototype chain here.
    super(context)

    // Restore the prototype chain.
    Object.setPrototypeOf(this, new.target.prototype)

    // Add the cause to the stack.
    if (cause) {
      this.stack +=
        '\nCaused by: ' + (cause.stack ? cause.stack : cause.toString())
    }
  }
}
