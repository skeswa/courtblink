/**
 * Pauses for the specified amount of time.
 * @param {number} duration how long to pause.
 */
module.exports = function pause(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
