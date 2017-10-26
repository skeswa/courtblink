/**
 * Returns true if the error is the result of a timeout.
 * @param error the error to inspect.
 * @return true if the error is the result of a timeout.
 */
export function isATimeoutError(error: any): boolean {
  if (!error || !error.message) return false
  return (
    error.name === 'FetchError' &&
    error.message.indexOf('reason: Connection Timed Out') !== -1
  )
}
