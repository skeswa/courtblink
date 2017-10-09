import { GameLeadersBuilder } from '../../../api/builders/GameLeadersBuilder'
import { BoxScoreCache } from '../../../nba/caches/BoxScoreCache'
import { PlayerDetailsCache } from '../../../nba/caches/PlayerDetailsCache'
import { TeamColorsCache } from '../../../nba/caches/TeamColorsCache'
import { TeamDetailsCache } from '../../../nba/caches/TeamDetailsCache'

import { CachedGameSummaryBuilder } from './impl-cached'
import { GameSummaryBuilder, GameSummaryBuilderCreationStrategy } from './types'

/**
 * Creates a new game leaders builder.
 * @param strategy the creation strategy to use.
 * @param boxScoreCache caches box scores of games.
 * @param gameLeadersBuilder builds game leader objects.
 * @param playerDetailsCache caches details about players.
 * @param teamColorsCache caches colors for teams.
 * @param teamDetailsCache caches details about teams.
 * @return the game leaders builder.
 */
export function createGameSummaryBuilder(
  strategy: GameSummaryBuilderCreationStrategy.UsingCaches,
  boxScoreCache: BoxScoreCache,
  gameLeadersBuilder: GameLeadersBuilder,
  playerDetailsCache: PlayerDetailsCache,
  teamColorsCache: TeamColorsCache,
  teamDetailsCache: TeamDetailsCache
): GameSummaryBuilder {
  return new CachedGameSummaryBuilder(
    boxScoreCache,
    gameLeadersBuilder,
    playerDetailsCache,
    teamColorsCache,
    teamDetailsCache
  )
}
