import { NbaApiClient } from '../../../nba/api/NbaApiClient'
import { Clock } from '../../../util/Clock'
import { Logger } from '../../../util/Logger'

import { MinuteByMinuteBoxScoreCache } from './impl-minute-by-minute'
import { BoxScoreCache, BoxScoreCacheCreationStrategy } from './types'

/**
 * Creates a new box score cache.
 * @param strategy the creation strategy to use.
 * @param clock time utility.
 * @param logger the logging utility to use.
 * @param nbaApiClient the client used to communicate with the NBA API.
 * @return the newly created box score cache.
 */
export function createBoxScoreCache(
  strategy: BoxScoreCacheCreationStrategy.UpdateEveryMinute,
  clock: Clock,
  logger: Logger,
  nbaApiClient: NbaApiClient
): BoxScoreCache {
  return new MinuteByMinuteBoxScoreCache(clock, logger, nbaApiClient)
}
