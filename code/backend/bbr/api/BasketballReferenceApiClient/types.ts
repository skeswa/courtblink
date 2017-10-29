import { TeamRating } from '../../../bbr/api/schema'

/** Fetches data from basketball reference. */
export interface BasketballReferenceApiClient {
  /**
   * Fetches the ratings for all the teams in the NBA.
   * @param seasonEndingYear the ending year of the season for which ratings
   *     will be fetched.
   * @return an array of all the team ratings in the NBA.
   */
  fetchAllTeamRatings(seasonEndingYear: number): Promise<TeamRating[]>
}

/** Strategy for creating a new `BasketballReferenceApiClient`. */
export enum BasketballReferenceApiClientCreationStrategy {
  /** Scrapes web pagesa of `basketball-reference.com`. */
  UsingScrapedWebPages = 'UsingScrapedWebPages',
}
