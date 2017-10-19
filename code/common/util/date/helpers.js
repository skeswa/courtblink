function yyyy(date) {
  return date.getFullYear().toString()
}

function yyyymmdd(date) {
  const month = date.getMonth() + 1 // getMonth() is zero-based.
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

module.exports = { yyyy, yyyymmdd }
