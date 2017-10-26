import { Scoreboard } from '../../../nba/api/schema'
import { NbaApiClient } from '../../../nba/api/NbaApiClient'
import { Clock } from '../../../util/Clock'
import { Logger } from '../../../util/Logger'
import { ContextualError } from 'common/util/ContextualError'
import { isOutOfBounds } from 'common/util/date/helpers'

import { ScoreboardCache } from './types'

// Log tag that identifies this module.
const tag = 'scoreboard-cache:minute-by-minute'

// How long to leave data in a cache entry alone before updating it.
const cacheEntryDataLifespan = 1 * 60 * 1000 /* 1 minutes (ms). */

// How long after the game that a cache entry represents ends before
// destroying it.
const cacheEntryLifespan = 3 * 24 * 60 * 60 * 1000 /* 3 days (ms). */

/** Box score cache that updates cached scoreboards every minute. */
export class MinuteByMinuteScoreboardCache implements ScoreboardCache {
  private clock: Clock
  private entries: Map<string, CacheEntry>
  private logger: Logger
  private nbaApiClient: NbaApiClient

  /**
   * Creates a new minute-by-minute scoreboard cache.
   * @param clock time utility.
   * @param logger the logging utility to use.
   * @param nbaApiClient client for the NBA API.
   */
  constructor(clock: Clock, logger: Logger, nbaApiClient: NbaApiClient) {
    this.clock = clock
    this.entries = new Map()
    this.logger = logger
    this.nbaApiClient = nbaApiClient
  }

  async retrieveById(yyyymmdd: string): Promise<Scoreboard> {
    let entry = this.entries.get(yyyymmdd)

    // Do not continue if this box score is out of bounds.
    if (
      isOutOfBounds(yyyymmdd, cacheEntryLifespan, this.clock.millisSinceEpoch())
    ) {
      // If the entry exists, get rid of it.
      if (entry) {
        this.entries.delete(yyyymmdd)
      }

      // Throw an error since, clearly, this box score is not available.
      throw new Error(
        `Could not get the scoreboard with id "${yyyymmdd}" because it has ` +
          `been marked as expired; try requesting a more recent scoreboard`
      )
    }

    // Check if we need to create a new entry first.
    if (!entry) {
      // Create a new entry.
      entry = new CacheEntry(
        this.clock,
        this.logger,
        this.nbaApiClient,
        yyyymmdd
      )

      // Make sure it is represented in the entries map before continuing.
      this.entries.set(yyyymmdd, entry)
    }

    return await entry.scoreboard()
  }

  collectGarbage() {
    // Get the list of expired keys to figure out what to cleanup.
    const expiredKeys = Array.from(this.entries.entries())
      .filter(([key, value]) =>
        isOutOfBounds(
          value.yyyymmdd,
          cacheEntryLifespan,
          this.clock.millisSinceEpoch()
        )
      )
      .map(([key]) => key)

    if (expiredKeys.length > 0) {
      this.logger.debug(
        tag,
        `Clearing away ${expiredKeys.length} expired scoreboards.`
      )

      // Delete each of the expired keys.
      expiredKeys.forEach(expiredKey => this.entries.delete(expiredKey))
    }
  }
}

/** Entry of the cache. Wraps an individual scoreboard. */
class CacheEntry {
  public yyyymmdd: string

  private cachedScoreboard: Scoreboard
  private clock: Clock
  private logger: Logger
  private nbaApiClient: NbaApiClient
  private timeLastUpdated: number

  /**
   * Creates a new cache entry.
   * @param clock time utility.
   * @param logger logging utility.
   * @param nbaApiClient client for interfacing with the NBA.
   * @param yyyymmdd representative date for this cache entry.
   */
  constructor(
    clock: Clock,
    logger: Logger,
    nbaApiClient: NbaApiClient,
    yyyymmdd: string
  ) {
    this.clock = clock
    this.logger = logger
    this.nbaApiClient = nbaApiClient
    this.yyyymmdd = yyyymmdd
  }

  /** Gets the value of this cache entry. */
  public async scoreboard(): Promise<Scoreboard> {
    try {
      // Check if an update is required.
      if (this.isInvalidated()) {
        // An update is required, so perform the update first.
        await this.updateCachedScoreboard()
      }

      return this.cachedScoreboard
    } catch (err) {
      throw new ContextualError(
        `Failed to get the latest scoreboard for date ` + `"${this.yyyymmdd}"`,
        err
      )
    }
  }

  /**
   * Compares times; for use as a sorting function
   * @param time1 the first time.
   * @param time2 the first time.
   * @return a number representing the relationship between `time1` & `time2`.
   */
  private compareTimes(time1: number, time2: number): number {
    if (time1 === time2) return 0
    if (time1 > time2) return -1
    return 1
  }

  /** Updates the value of this cache entry. */
  private async updateCachedScoreboard(): Promise<void> {
    this.logger.debug(
      tag,
      `updating cached scoreboard for date "${this.yyyymmdd}"`
    )

    // Fetches the updated scoreboard.
    const scoreboard = await this.nbaApiClient.fetchScoreboard(this.yyyymmdd)

    // Update the scoreboard.
    this.cachedScoreboard = scoreboard
    this.timeLastUpdated = this.clock.millisSinceEpoch()
  }

  /** @return true if this entry should be updated. */
  private isInvalidated(): boolean {
    // Update if this entry has yet to be initialized.
    if (!this.cachedScoreboard || !this.timeLastUpdated) return true

    const rightNow = this.clock.millisSinceEpoch()
    const hasScoreboardBecomeStale =
      rightNow - this.timeLastUpdated > cacheEntryDataLifespan

    // If there are no games, just check for staleness.
    if (hasScoreboardBecomeStale) return true

    // Sort the start and end times of this scoreboard.
    const gameEndTimes = this.cachedScoreboard.games
      .map(game => new Date(game.endTimeUTC).getTime())
      .sort(this.compareTimes)
    const gameStartTimes = this.cachedScoreboard.games
      .map(game => new Date(game.startTimeUTC).getTime())
      .sort(this.compareTimes)

    // Use the sorted arrays to get the range of game times.
    const firstGameStartTime = new Date(gameStartTimes[0]).getTime()
    const lastGameEndTime = new Date(
      gameEndTimes[gameEndTimes.length - 1]
    ).getTime()

    const haveGamesBeenUpdatedSinceTheyEnded =
      this.timeLastUpdated > lastGameEndTime
    const haveGamesNotHappenedYet = rightNow < firstGameStartTime

    // If the games already happened, the scoreboard will not change again.
    if (haveGamesBeenUpdatedSinceTheyEnded) return false

    // If the games haven't happened yet, there's no new information to be had.
    if (haveGamesNotHappenedYet) return false

    // Update if this entry's data has exceeded the lifespan, since the game
    // is either still in progress or we have not updated it since the date
    // ended.
    return hasScoreboardBecomeStale
  }
}
