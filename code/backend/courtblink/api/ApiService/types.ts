import { IGameNews, ISplashData } from 'common/api/schema/generated'

/**
 * The courtblink API service. Represents all of the possible RPCs exposed to
 * the courtblink frontend via HTTP.
 */
export interface ApiService {
  /**
   * Gets news for the specified game.
   * @param awayTeamUrlName url name of the away team.
   * @param homeTeamUrlName url name of the home team.
   * @return news for the specified game.
   */
  fetchGameNews(
    awayTeamUrlName: string,
    homeTeamUrlName: string
  ): Promise<IGameNews>

  /**
   * Gets splash data for the specified date.
   * @param yyyymmdd the date for which the splash data should be fetched.
   * @return splash data for the specified date.
   */
  fetchSplashData(yyyymmdd: string): Promise<ISplashData>
}

/** Strategy for creating a new `ApiService`. */
export enum ApiServiceCreationStrategy {
  /** API service that leverages caching to stay fast. */
  UsingCaches = 'UsingCaches',
}
