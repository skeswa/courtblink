import { BoxScoreCache } from 'nba/caches/BoxScoreCache'
import { PlayerDetailsCache } from 'nba/caches/PlayerDetailsCache'

import { CachedGameLeadersBuilder } from './impl-cached'
import { GameLeadersBuilder, GameLeadersBuilderCreationStrategy } from './types'

/**
 * Creates a new game leaders builder.
 * @param strategy the creation strategy to use.
 * @param boxScoreCache caches box scores of games.
 * @param playerDetailsCache caches details about players.
 * @return the game leaders builder.
 */
export function createGameLeadersBuilder(
  strategy: GameLeadersBuilderCreationStrategy.UsingCaches,
  boxScoreCache: BoxScoreCache,
  playerDetailsCache: PlayerDetailsCache
): GameLeadersBuilder {
  return new CachedGameLeadersBuilder(boxScoreCache, playerDetailsCache)
}
