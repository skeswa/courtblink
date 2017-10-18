import { ISplashData } from 'common/api/schema/generated/schema'

/**
 * The courtblink API client. Represents all of the possible RPCs exposed to
 * the courtblink frontend via HTTP.
 */
export interface ApiClient {
  /**
   * Gets splash data for the specified date.
   * @param date the date for which the splash data should be fetched.
   * @return splash data for the specified date.
   */
  fetchSplashData(date: Date): Promise<ISplashData>
}
