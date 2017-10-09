/**
 * Formats the year of the given date in YYYY.
 * @param date date to format.
 * @return date formatted in YYYY form.
 */
export function yyyy(date: Date): string {
  return date.getFullYear().toString()
}

/**
 * Formats the given date in YYYY/MM/DD form.
 * @param date date to format.
 * @return date formatted in YYYY/MM/DD form.
 */
export function yyyymmdd(date: Date): string {
  const month = date.getMonth() + 1 // getMonth() is zero-based.
  const day = date.getDate()
  const year = date.getFullYear()

  const mm = formatAsTwoDigits(month)
  const dd = formatAsTwoDigits(day)
  const yyyy = year.toString()

  return yyyy + mm + dd
}

function formatAsTwoDigits(num: number): string {
  return num > 9 ? num.toString() : '0' + num.toString()
}
