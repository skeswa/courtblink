/**
 * Gets the starting and ending years of the current NBA season.
 * @return years that this season starts and ends.
 */
export function getCurrentSeason(): {
  startingYear: number
  endingYear: number
} {
  const now = new Date()

  // The season starts in October. So, if it is October or later, the start
  // year is this year. If it is before October, the season started last year.
  if (now.getMonth() >= 9 /* months are zero-indexed */) {
    return {
      startingYear: now.getFullYear(),
      endingYear: now.getFullYear() + 1,
    }
  }

  return {
    startingYear: now.getFullYear() - 1,
    endingYear: now.getFullYear(),
  }
}
