import { IGameLeader } from 'common/api/schema/generated/schema'

import { Game } from '../../../../nba/api/schema'

/** Encapsulates all the leaders for a game. */
export type GameLeaders = {
  /** Leaders for the away team. */
  awayTeam: TeamLeaders
  /** Leaders for the home team. */
  homeTeam: TeamLeaders
}

/** Builds game leaders. */
export interface GameLeadersBuilder {
  /**
   * Gets the stat leaders for the provided game.
   * @param game game used to build the game leaders.
   * @return the stat leaders for the provided game.
   */
  build(game: Game): Promise<GameLeaders>
}

/** Strategy for creating a new `GameLeadersBuilder`. */
export enum GameLeadersBuilderCreationStrategy {
  /** Uses caches to help build game leaders. */
  UsingCaches = 'UsingCaches',
}

/** Encapsulates all the leaders for a team. */
export type TeamLeaders = {
  /** Leader in rebounds. */
  reboundsLeader?: IGameLeader
  /** Leader in points. */
  pointsLeader?: IGameLeader
  /** Leader in assists. */
  assistsLeader?: IGameLeader
}
