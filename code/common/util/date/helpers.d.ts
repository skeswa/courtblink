/**
 * Formats the year of the given date in YYYY.
 * @param date date to format.
 * @return date formatted in YYYY form.
 */
export function yyyy(date: Date): string

/**
 * Formats the given date in YYYY/MM/DD form.
 * @param date date to format.
 * @return date formatted in YYYY/MM/DD form.
 */
export function yyyymmdd(date: Date): string

/**
 * Checks if the given date string exceeds the given time boundary.
 * @param yyyymmdd a date formatted as something resembling "20171001".
 * @param boundary range of time in milliseconds around the current date for
 *     which the date would be considered "in-bounds".
 * @param now the current number of milliseconds since the epoch.
 */
export function isOutOfBounds(
  yyyymmdd: string,
  boundary: number,
  now: number
): boolean
