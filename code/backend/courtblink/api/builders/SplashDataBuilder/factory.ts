import { GameSummaryBuilder } from '../../../../courtblink/api/builders/GameSummaryBuilder'
import { TeamDetailsCache } from '../../../../nba/caches/TeamDetailsCache'
import { TeamNewsCache } from '../../../../nba/caches/TeamNewsCache'
import { Clock } from '../../../../util/Clock'

import { CachedSplashDataBuilder } from './impl-cached'
import { SplashDataBuilder, SplashDataBuilderCreationStrategy } from './types'

/**
 * Creates a new splash data builder.
 * @param strategy the creation strategy to use.
 * @param clock time utility.
 * @param gameSummaryBuilder builds game summaries.
 * @param teamDetailsCache caches team details.
 * @param teamNewsCache caches team news.
 * @return the splash data builder.
 */
export function createSplashDataBuilder(
  strategy: SplashDataBuilderCreationStrategy.UsingCaches,
  clock: Clock,
  gameSummaryBuilder: GameSummaryBuilder,
  teamDetailsCache: TeamDetailsCache,
  teamNewsCache: TeamNewsCache
): SplashDataBuilder {
  return new CachedSplashDataBuilder(
    clock,
    gameSummaryBuilder,
    teamDetailsCache,
    teamNewsCache
  )
}
