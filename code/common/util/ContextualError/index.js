class ContextualError extends Error {
  constructor(context, cause) {
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

module.exports = { ContextualError }