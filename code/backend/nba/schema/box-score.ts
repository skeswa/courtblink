import { Game } from './game'

export type BoxScore = {
  /** Info about the game that this box score describes. */
  basicGameData: Game
  /** The juicy innards of the box score.  */
  stats: BoxScoreDetails
}

/** Has all the juicy box score details. */
export type BoxScoreDetails = {
  /** Number of times that the game has been tied up. */
  timesTied: string
  /** Number of times that the lead has changed. */
  leadChanges: string
  /** Represents the home team. */
  hTeam: BoxScoreTeam
  /** Represents the away team. */
  vTeam: BoxScoreTeam
  /** Active players in the game. */
  activePlayers: PlayerStatline[]
}

/** Represents a team in the box score (home or away) */
export type BoxScoreTeam = {
  /** Points scored by this team in transition. */
  fastBreakPoints: string
  /** Points scored by this team in the paint. */
  pointsInPaint: string
  /** Biggest lead held by this team. */
  biggestLead: string
  /** Redemption points for this team. */
  secondChancePoints: string
  /** Points scored by this team off of turnovers. */
  pointsOffTurnovers: string
  /** Longest uninterrupted scoring run by this team. */
  longestRun: string
  /** Represents this team's statline. */
  totals: TeamStatline
  /** Represents this team's individual stat leaders. */
  leaders: StatLeaders
}

/** Leading players in points, assists, and rebounds. */
export type StatLeaders = {
  /** Team leader in points. */
  points: StatLeader
  /** Team leader in assists. */
  assists: StatLeader
  /** Team leader in rebounds. */
  rebounds: StatLeader
}

/** Represents leading players in a particular stat. */
export type StatLeader = {
  /** Stat value of the player(s). */
  value: string
  /** Ids of players leading this stat. */
  players: Array<{ personId: string }>
}

/** Box score stats for a team. */
export type TeamStatline = {
  /** How many points the team has. */
  points: string
  /** How many minutes the team has. */
  min: string
  /** How many field goals made the team has. */
  fgm: string
  /** How many field goals attempted the team has. */
  fga: string
  /** How many field goal percentage the team has. */
  fgp: string
  /** How many free throws made the team has. */
  ftm: string
  /** How many free throws attempted the team has. */
  fta: string
  /** How many free throw percentage the team has. */
  ftp: string
  /** How many three pointers made the team has. */
  tpm: string
  /** How many three pointers attempted the team has. */
  tpa: string
  /** How many three point percentage the team has. */
  tpp: string
  /** How many offensive rebounds the team has. */
  offReb: string
  /** How many defensive rebounds the team has. */
  defReb: string
  /** How many total rebounds the team has. */
  totReb: string
  /** How many assists the team has. */
  assists: string
  /** How many personal fouls the team has. */
  pFouls: string
  /** How many steals the team has. */
  steals: string
  /** How many turnovers the team has. */
  turnovers: string
  /** How many blocks the team has. */
  blocks: string
  /** Plus-minus for the team. */
  plusMinus: string
}

/** Box score stats for a player. */
export type PlayerStatline = {
  /** ID of the player. */
  personId: string
  /** ID of the team that the player is on. */
  teamId: string
  /** True if currently on the court. */
  isOnCourt: boolean
  /** How many points the player has. */
  points: string
  /** How many minutes the player has. */
  min: string
  /** How many field goals made the player has. */
  fgm: string
  /** How many field goals attempted the player has. */
  fga: string
  /** How many field goal percentage the player has. */
  fgp: string
  /** How many free throws made the player has. */
  ftm: string
  /** How many free throws attempted the player has. */
  fta: string
  /** How many free throw percentage the player has. */
  ftp: string
  /** How many three pointers made the player has. */
  tpm: string
  /** How many three pointers attempted the player has. */
  tpa: string
  /** How many three point percentage the player has. */
  tpp: string
  /** How many offensive rebounds the player has. */
  offReb: string
  /** How many defensive rebounds the player has. */
  defReb: string
  /** How many total rebounds the player has. */
  totReb: string
  /** How many assists the player has. */
  assists: string
  /** How many personal fouls the player has. */
  pFouls: string
  /** How many steals the player has. */
  steals: string
  /** How many turnovers the player has. */
  turnovers: string
  /** How many blocks the player has. */
  blocks: string
  /** Plus-minus for the player. */
  plusMinus: string
  /** Data that provides sortability for this player. */
  sortKey: StatSortData
}

/**
 * Keeps track of the rank of a player in each category within the box score.
 */
export type StatSortData = {
  /** Sort key for the player name property. */
  name: number
  /** Sort key for the player position (1 - 5) property. */
  pos: number
  /** Sort key for the points property. */
  points: number
  /** Sort key for the minutes property. */
  min: number
  /** Sort key for the field goals made property. */
  fgm: number
  /** Sort key for the field goals attempted property. */
  fga: number
  /** Sort key for the field goal percentage property. */
  fgp: number
  /** Sort key for the free throws made property. */
  ftm: number
  /** Sort key for the free throws attempted property. */
  fta: number
  /** Sort key for the free throw percentage property. */
  ftp: number
  /** Sort key for the three pointers made property. */
  tpm: number
  /** Sort key for the three pointers attempted property. */
  tpa: number
  /** Sort key for the three point percentage property. */
  tpp: number
  /** Sort key for the offensive rebounds property. */
  offReb: number
  /** Sort key for the defensive rebounds property. */
  defReb: number
  /** Sort key for the total rebounds property. */
  totReb: number
  /** Sort key for the assists property. */
  assists: number
  /** Sort key for the personal fouls property. */
  pFouls: number
  /** Sort key for the steals property. */
  steals: number
  /** Sort key for the turnovers property. */
  turnovers: number
  /** Sort key for the blocks property. */
  blocks: number
  /** Sort key for the plus-minus property. */
  plusMinus: number
}
