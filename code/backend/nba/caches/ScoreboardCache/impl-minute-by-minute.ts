import { Scoreboard } from '../../../nba/api/schema'
import { NbaApiClient } from '../../../nba/api/NbaApiClient'
import { ContextualError } from '../../../../common/util/ContextualError'
import { Clock } from '../../../util/Clock'
import { yyyymmdd } from '../../../../common/util/date/helpers'
import { Logger } from '../../../util/Logger'

import { ScoreboardCache } from './types'

// Log tag that identifies this module.
const tag = 'scoreboard-cache:minute-by-minute'

// How long to leave data in a cache entry alone before updating it.
const cacheEntryDataLifespan = 60 * 1000 /* 1 minute (ms). */

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

  async retrieveById(date: Date): Promise<Scoreboard> {
    const key = yyyymmdd(date)
    let entry = this.entries.get(key)

    // Do not continue if this box score is out of bounds.
    if (this.isOutOfBounds(date)) {
      // If the entry exists, get rid of it.
      if (entry) {
        this.entries.delete(key)
      }

      // Throw an error since, clearly, this box score is not available.
      throw new Error(
        `Could not get the scoreboard with id "${key}" because it has been ` +
          `marked as expired; try requesting a more recent scoreboard`
      )
    }

    // Check if we need to create a new entry first.
    if (!entry) {
      // Create a new entry.
      entry = new CacheEntry(this.clock, date, this.logger, this.nbaApiClient)

      // Make sure it is represented in the entries map before continuing.
      this.entries.set(key, entry)
    }

    return await entry.scoreboard()
  }

  collectGarbage() {
    // Get the list of expired keys to figure out what to cleanup.
    const expiredKeys = Array.from(this.entries.entries())
      .filter(([key, value]) => this.isOutOfBounds(value.date))
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

  /**
   * Returns true if the date is out of bounds for a cache entry.
   * @param date date to check.
   * @return true if the date is out of bounds for a cache entry. */
  private isOutOfBounds(date: Date): boolean {
    return (
      Math.abs(this.clock.millisSinceEpoch() - date.getTime()) >
      cacheEntryLifespan
    )
  }
}

/** Entry of the cache. Wraps an individual scoreboard. */
class CacheEntry {
  public date: Date

  private cachedScoreboard: Scoreboard
  private clock: Clock
  private logger: Logger
  private nbaApiClient: NbaApiClient
  private timeLastUpdated: number

  /**
   * Creates a new cache entry.
   * @param clock time utility.
   * @param date representative date for this cache entry.
   * @param logger logging utility.
   * @param nbaApiClient client for interfacing with the NBA.
   */
  constructor(
    clock: Clock,
    date: Date,
    logger: Logger,
    nbaApiClient: NbaApiClient
  ) {
    this.clock = clock
    this.date = date
    this.logger = logger
    this.nbaApiClient = nbaApiClient
  }

  /** Gets the value of this cache entry. */
  async scoreboard(): Promise<Scoreboard> {
    try {
      // Check if an update is required.
      if (this.isInvalidated()) {
        // An update is required, so perform the update first.
        await this.updateCachedScoreboard()
      }

      return this.cachedScoreboard
    } catch (err) {
      throw new ContextualError(
        `Failed to get the latest scoreboard for date ` +
          `"${yyyymmdd(this.date)}"`,
        err
      )
    }
  }

  /** Updates the value of this cache entry. */
  private async updateCachedScoreboard(): Promise<void> {
    this.logger.debug(
      tag,
      `updating cached scoreboard for date "${yyyymmdd(this.date)}"`
    )

    // Fetches the updated scoreboard.
    const scoreboard = await this.nbaApiClient.fetchScoreboard(this.date)

    // Update the scoreboard.
    this.cachedScoreboard = scoreboard
    this.timeLastUpdated = this.clock.millisSinceEpoch()
  }

  /** @return true if this entry should be updated. */
  private isInvalidated(): boolean {
    // Update if this entry has yet to be initialized.
    if (!this.scoreboard || !this.timeLastUpdated) return true

    // Update is this entry's data has exceeded the lifespan.
    if (
      this.clock.millisSinceEpoch() - this.timeLastUpdated >=
      cacheEntryDataLifespan
    ) {
      return true
    }

    return false
  }
}
