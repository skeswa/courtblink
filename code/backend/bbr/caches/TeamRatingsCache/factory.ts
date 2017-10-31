import { BasketballReferenceApiClient } from '../../../bbr/api/BasketballReferenceApiClient'
import { Logger } from '../../../util/Logger'

import { DayByDayTeamRatingsCache } from './impl-day-by-day'
import { TeamRatingsCache, TeamRatingsCacheCreationStrategy } from './types'

/**
 * Creates a new team ratings cache.
 * @param strategy the creation strategy to use.
 * @param bbrApiClient client used to communicate with basketball reference.
 * @param logger the logging utility to use.
 * @return the newly created team ratings cache.
 */
export function createTeamRatingsCache(
  strategy: TeamRatingsCacheCreationStrategy.UpdateEveryDay,
  bbrApiClient: BasketballReferenceApiClient,
  logger: Logger
): TeamRatingsCache {
  return new DayByDayTeamRatingsCache(bbrApiClient, logger)
}
