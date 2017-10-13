import { GameSummaryBuilder } from '../../../../courtblink/api/builders/GameSummaryBuilder'

import { CachedSplashDataBuilder } from './impl-cached'
import { SplashDataBuilder, SplashDataBuilderCreationStrategy } from './types'

/**
 * Creates a new splash data builder.
 * @param strategy the creation strategy to use.
 * @param gameSummaryBuilder builds game summariess.
 * @return the splash data builder.
 */
export function createSplashDataBuilder(
  strategy: SplashDataBuilderCreationStrategy.UsingCaches,
  gameSummaryBuilder: GameSummaryBuilder
): SplashDataBuilder {
  return new CachedSplashDataBuilder(gameSummaryBuilder)
}
