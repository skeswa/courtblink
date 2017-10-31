/** Rating of an NBA team. */
export type TeamRating = {
  /** Defensive rating adjusted for the strength opposing offenses. */
  adjustedDefensiveRating?: number

  /** Offensive rating adjusted for the strength opposing defenses. */
  adjustedOffensiveRating?: number

  /** Margin of victory adjusted for the strength opposing offenses. */
  adjustedMarginOfVictory?: number

  /** Net rating adjusted for the strength opposing offenses. */
  adjustedNetRating?: number

  /** Number representing the strength of this team's defense. */
  defensiveRating?: number

  /** Rank among other teams defensively. */
  defensiveRank: number

  /** Number of losses by this team. */
  losses?: number

  /** Average margin of victory. */
  marginOfVictory?: number

  /** Overall rating of this team. */
  netRating?: number

  /** Offensive rating of this team. */
  offensiveRating?: number

  /** Rank among other teams offensively. */
  offensiveRank: number

  /** Rank among other teams overall. */
  overallRank: number

  /** Name of this team. */
  teamName?: string

  /** Ratio of wins to losses. */
  winLossPercentage?: number

  /** Total number of wins. */
  wins?: number
}
