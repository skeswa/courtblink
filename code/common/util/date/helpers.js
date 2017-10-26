function isOutOfBounds(yyyymmdd, boundary, now) {
  // If the date string is formatted incorrectly, assume it is out of bounds.
  if (!yyyymmdd || yyyymmdd.length !== 8 || !boundary || !now) {
    return true
  }

  // Read the parts of the date.
  const yyyy = parseInt(yyyymmdd.substr(0, 4), 10)
  const mm = parseInt(yyyymmdd.substr(4, 2), 10)
  const dd = parseInt(yyyymmdd.substr(6, 2), 10)

  // Compose the parts of the date into a date. The month is decremented by
  // one because months in JS are zero-indexed.
  const date = new Date(yyyy, mm - 1, dd)

  return Math.abs(now - date.getTime()) > boundary
}

function yyyy(date) {
  return date.getFullYear().toString()
}

function yyyymmdd(date) {
  const month = date.getMonth() + 1 // getMonth() is zero-indexed.
  const day = date.getDate()
  const year = date.getFullYear()

  const mm = formatAsTwoDigits(month)
  const dd = formatAsTwoDigits(day)
  const yyyy = year.toString()

  return yyyy + mm + dd
}

function formatAsTwoDigits(num) {
  return num > 9 ? num.toString() : '0' + num.toString()
}

module.exports = {
  isOutOfBounds: isOutOfBounds,
  yyyy: yyyy,
  yyyymmdd: yyyymmdd,
}
