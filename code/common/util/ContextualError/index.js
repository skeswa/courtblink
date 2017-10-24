function ContextualError(context, cause) {
  this.name = 'ContextualError';
  this.message = context;

  // Add the cause to the stack.
  if (cause) {
    this.stack += '\nCaused by: ' +
        (cause.stack ? cause.stack : cause.toString());
  }
}
ContextualError.prototype = Error.prototype;

module.exports = { ContextualError: ContextualError };