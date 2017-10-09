import { NbaColorService } from '../../../nba/colors/NbaColorService'
import { Logger } from '../../../util/Logger'

import { YearByYearTeamColorsCache } from './impl-year-by-year'
import { TeamColorsCache, TeamColorsCacheCreationStrategy } from './types'

/**
 * Creates a new team colors cache.
 * @param strategy the creation strategy to use.
 * @param logger the logging utility to use.
 * @param nbaColorService the service used to fetch team colors.
 * @return the newly created team colors cache.
 */
export function createTeamColorsCache(
  strategy: TeamColorsCacheCreationStrategy.UpdateEveryYear,
  logger: Logger,
  nbaColorService: NbaColorService
): TeamColorsCache {
  return new YearByYearTeamColorsCache(nbaColorService, logger)
}
