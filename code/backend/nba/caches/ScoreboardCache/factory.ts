import { NbaApiClient } from '../../../nba/api/NbaApiClient'
import { Clock } from '../../../util/Clock'
import { Logger } from '../../../util/Logger'

import { MinuteByMinuteScoreboardCache } from './impl-minute-by-minute'
import { ScoreboardCache, ScoreboardCacheCreationStrategy } from './types'

/**
 * Creates a new scoreboard cache.
 * @param strategy the creation strategy to use.
 * @param clock time utility.
 * @param logger the logging utility to use.
 * @param nbaApiClient the client used to communicate with the NBA API.
 * @return the newly created scoreboard cache.
 */
export function createScoreboardCache(
  strategy: ScoreboardCacheCreationStrategy.UpdateEveryMinute,
  clock: Clock,
  logger: Logger,
  nbaApiClient: NbaApiClient
): ScoreboardCache {
  return new MinuteByMinuteScoreboardCache(clock, logger, nbaApiClient)
}
