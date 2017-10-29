/**
 * Helper function to convert string doubles to numbers.
 * @param str a double in string form.
 * @return number version of `str`.
 */
export function toDouble(str: string | undefined): number | undefined {
  // If the string is falsy, exit early.
  if (!str) return undefined

  // Parse the string.
  const value = parseFloat(str)

  // Exit with undefined if the parse failed.
  if (isNaN(value)) return undefined

  return value
}

/**
 * Helper function to convert string ints to numbers.
 * @param str a int in string form.
 * @return number version of `str`.
 */
export function toInt(str: string | undefined): number | undefined {
  // If the string is falsy, exit early.
  if (!str) return undefined

  // Parse the string.
  const value = parseInt(str)

  // Exit with undefined if the parse failed.
  if (isNaN(value)) return undefined

  return value
}
