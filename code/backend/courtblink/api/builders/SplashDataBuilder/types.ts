import { ISplashData } from 'common/api/schema/generated'

import { Scoreboard } from '../../../../nba/api/schema'

/** Builds splash data objects. */
export interface SplashDataBuilder {
  /**
   * Uses the provided scoreboard to build splash data.
   * @param scoreboard scoreboard used to build the splash data.
   * @return a new splash data.
   */
  build(scoreboard: Scoreboard | undefined): Promise<ISplashData>
}

/** Strategy for creating a new `SplashDataBuilder`. */
export enum SplashDataBuilderCreationStrategy {
  /** Uses caches to help build splash data. */
  UsingCaches = 'UsingCaches',
}
