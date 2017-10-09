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
   * @param date effective date of team information.
   * @return information about all teams in the NBA.
   */
  fetchAllTeamDetails(date: Date): Promise<AllTeamDetails>

  /**
   * Fetches information about all players in the NBA.
   * @param date effective date of player information.
   * @return information about all players in the NBA.
   */
  fetchAllPlayerDetails(date: Date): Promise<AllPlayerDetails>

  /**
   * Fetches a list of all the on-going NBA games and some nominal info about
   * each.
   * @param date effective date of scoreboard information.
   * @return list of all the on-going NBA games.
   */
  fetchScoreboard(date: Date): Promise<Scoreboard>

  /**
   * Fetches the box score for an NBA game.
   * @param date date of the game.
   * @param id id of the game.
   * @return game stats for the specified NBA game.
   */
  fetchBoxScore(date: Date, gameId: string): Promise<BoxScore>
}

/** Strategy for creating a new `NbaApiClient`. */
export enum NbaApiClientCreationStrategy {
  /** Uses the HTTP-based API exposed by `nba.com`. */
  UsingNbaHttpApi = 'UsingNbaHttpApi',
}
