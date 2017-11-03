import { NbaApiClient } from '../../../nba/api/NbaApiClient'
import { Clock } from '../../../util/Clock'
import { Logger } from '../../../util/Logger'

import { DayByDayTeamNewsCache } from './impl-day-by-day'
import { TeamNewsCache, TeamNewsCacheCreationStrategy } from './types'

/**
 * Creates a new team news cache.
 * @param strategy the creation strategy to use.
 * @param clock time utility.
 * @param logger the logging utility to use.
 * @param nbaApiClient the client used to communicate with the NBA API.
 * @return the newly created team news cache.
 */
export function createTeamNewsCache(
  strategy: TeamNewsCacheCreationStrategy.UpdateEveryDay,
  clock: Clock,
  logger: Logger,
  nbaApiClient: NbaApiClient
): TeamNewsCache {
  return new DayByDayTeamNewsCache(clock, logger, nbaApiClient)
}
