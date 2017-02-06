
export function arraysEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length != b.length) return false

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }

  return true
}

export function periodToString(period) {
  switch (period) {
    case 1:
      return '1st'
    case 2:
      return '2nd'
    case 3:
      return '3rd'
    default:
      return `${period}th`
  }
}

export function gameStartTimeToString(gameStartTime) {
  const date = new Date(gameStartTime)
  const hours24 = date.getHours()
  const hours12 = hours24 > 12 ? hours24 - 12 : hours24
  const minutes = date.getMinutes()
  const suffix = hours24 > 12 ? 'PM' : 'AM'
  return `${hours12}:${minutes} ${suffix}`
}
