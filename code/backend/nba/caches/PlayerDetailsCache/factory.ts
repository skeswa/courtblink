import { NbaApiClient } from '../../../nba/api/NbaApiClient'
import { Logger } from '../../../util/Logger'

import { YearByYearPlayerDetailsCache } from './impl-year-by-year'
import { PlayerDetailsCache, PlayerDetailsCacheCreationStrategy } from './types'

/**
 * Creates a new player details cache.
 * @param strategy the creation strategy to use.
 * @param logger the logging utility to use.
 * @param nbaApiClient the client used to communicate with the NBA API.
 * @return the newly created box score cache.
 */
export function createPlayerDetailsCache(
  strategy: PlayerDetailsCacheCreationStrategy.UpdateEveryYear,
  logger: Logger,
  nbaApiClient: NbaApiClient
): PlayerDetailsCache {
  return new YearByYearPlayerDetailsCache(nbaApiClient, logger)
}
