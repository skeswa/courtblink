import { SplashData } from 'common/api/schema/generated'

/**
 * The courtblink API service. Represents all of the possible RPCs exposed to
 * the courtblink frontend via HTTP.
 */
export interface ApiService {
  /**
   * Gets splash data for the specified date.
   * @param yyyymmdd the date for which the splash data should be fetched.
   * @return splash data for the specified date.
   */
  fetchSplashData(yyyymmdd: string): Promise<SplashData>
}

/** Strategy for creating a new `ApiService`. */
export enum ApiServiceCreationStrategy {
  /** API service that leverages caching to stay fast. */
  UsingCaches = 'UsingCaches',
}