import { NbaApiClient } from 'nba/api/NbaApiClient'
import { Logger } from 'util/Logger'

import { YearByYearTeamDetailsCache } from './impl-year-by-year'
import { TeamDetailsCache, TeamDetailsCacheCreationStrategy } from './types'

/**
 * Creates a new team details cache.
 * @param strategy the creation strategy to use.
 * @param logger the logging utility to use.
 * @param nbaApiClient the client used to communicate with the NBA API.
 * @return the newly created team details cache.
 */
export function createTeamDetailsCache(
  strategy: TeamDetailsCacheCreationStrategy.UpdateEveryYear,
  logger: Logger,
  nbaApiClient: NbaApiClient
): TeamDetailsCache {
  return new YearByYearTeamDetailsCache(nbaApiClient, logger)
}
