import {
  AllPlayerDetails,
  AllTeamDetails,
  BoxScore,
  Scoreboard,
} from '../../../nba/api/schema'

/** Fetches NBA-related data. */
export interface NbaApiClient {
  /**
   * Fetches information about all teams in the NBA.
   * @param yyyy effective date of team information.
   * @return information about all teams in the NBA.
   */
  fetchAllTeamDetails(yyyy: string): Promise<AllTeamDetails>

  /**
   * Fetches information about all players in the NBA.
   * @param yyyy effective date of player information.
   * @return information about all players in the NBA.
   */
  fetchAllPlayerDetails(yyyy: string): Promise<AllPlayerDetails>

  /**
   * Fetches a list of all the on-going NBA games and some nominal info about
   * each.
   * @param yyyymmdd effective date of scoreboard information.
   * @return list of all the on-going NBA games.
   */
  fetchScoreboard(yyyymmdd: string): Promise<Scoreboard>

  /**
   * Fetches the box score for an NBA game.
   * @param yyyymmdd date of the game.
   * @param id id of the game.
   * @return game stats for the specified NBA game.
   */
  fetchBoxScore(yyyymmdd: string, gameId: string): Promise<BoxScore>

  /**
   * Checks if the NBA API is reachable.
   * @return true if the NBA API is reachable.
   */
  isReachable(): Promise<boolean>
}

/** Strategy for creating a new `NbaApiClient`. */
export enum NbaApiClientCreationStrategy {
  /** Uses the HTTP-based API exposed by `nba.com`. */
  UsingNbaHttpApi = 'UsingNbaHttpApi',
}
