import { BoxScore } from 'nba/api/schema'
import { NbaApiClient } from 'nba/api/NbaApiClient'
import { ContextualError } from 'util/ContextualError'
import { Logger } from 'util/Logger'

import { BoxScoreCache, BoxScoreId } from './types'

// Tag for this cache within the logger.
const tag = 'box-score-cache:minute-by-minute'

// How long to leave data in a cache entry alone before updating it.
const cacheEntryDataLifespan = 60 * 1000 /* 1 minute (ms). */

// How long after the game that a cache entry represents ends before
// destroying it.
const cacheEntryLifespan = 2 * 24 * 60 * 60 * 1000 /* 2 days (ms). */

/** Box score cache that updates cached box scores every minute. */
export class MinuteByMinuteBoxScoreCache implements BoxScoreCache {
  private entries: Map<string, CacheEntry>
  private logger: Logger
  private nbaApiClient: NbaApiClient

  /**
   * Creates a new minute-by-minute box score cache.
   * @param nbaApiClient client for the NBA API.
   * @param logger the logging utility to use.
   */
  constructor(nbaApiClient: NbaApiClient, logger: Logger) {
    this.entries = new Map()
    this.logger = logger
    this.nbaApiClient = nbaApiClient
  }

  async retrieveById(boxScoreId: BoxScoreId): Promise<BoxScore> {
    const { gameId, date } = boxScoreId
    const key = this.composeMapKey(gameId, date)
    let entry = this.entries.get(key)

    // Check if we need to create a new entry first.
    if (!entry) {
      // Create a new entry.
      entry = new CacheEntry(gameId, date, this.nbaApiClient, this.logger)

      // Make sure it is represented in the entries map before continuing.
      this.entries.set(key, entry)
    }

    // If this entry needs to be deleted, delete it and throw an error.
    if (entry.hasExpired()) {
      this.entries.delete(key)

      // Throw an error since, clearly, this box score is not available.
      throw new ContextualError(
        `Could not get the game with id "${gameId}" because it has been ` +
          `marked as expired; try requesting a more recent box score`
      )
    }

    return await entry.boxScore()
  }

  collectGarbage() {
    // Get the list of expired keys to figure out what to cleanup.
    const expiredKeys = Array.from(this.entries.entries())
      .filter(([key, value]) => value.hasExpired())
      .map(([key]) => key)

    if (expiredKeys.length > 0) {
      this.logger.debug(
        tag,
        `Clearing away ${expiredKeys.length} expired box scores.`
      )

      // Delete each of the expired keys.
      expiredKeys.forEach(expiredKey => this.entries.delete(expiredKey))
    }
  }

  /**
   * Creates a map key from the gameId and the date of a box score.
   * @param gameId the id of the game for which the box score will be fetched.
   * @param date the date of the game for which the box score will be fetched.
   * @return a map key represening the game.
   */
  private composeMapKey(gameId: string, date: Date) {
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}:${gameId}`
  }
}

/** Entry of the cache. Wraps an individual box score. */
class CacheEntry {
  private cachedBoxScore: BoxScore
  private date: Date
  private gameId: string
  private logger: Logger
  private nbaApiClient: NbaApiClient
  private timeLastUpdated: number

  constructor(
    gameId: string,
    date: Date,
    nbaApiClient: NbaApiClient,
    logger: Logger
  ) {
    this.date = date
    this.gameId = gameId
    this.logger = logger
    this.nbaApiClient = nbaApiClient
  }

  /** Gets the value of this cache entry. */
  async boxScore(): Promise<BoxScore> {
    try {
      // Check if an update is required.
      if (this.isInvalidated()) {
        // An update is required, so perform the update first.
        await this.updateCachedBoxScore()
      }

      return this.cachedBoxScore
    } catch (err) {
      throw new ContextualError(
        `Failed to get the latest box score for game id "${this.gameId}"`,
        err
      )
    }
  }

  /** @return true if this entry should be destroyed. */
  hasExpired(): boolean {
    // Do not destroy has yet to be initialized.
    if (!this.boxScore || !this.timeLastUpdated) return false

    const gameEndTime = Date.parse(this.cachedBoxScore.basicGameData.endTimeUTC)
    const now = Date.now()

    // Destroy this entry if it has exceeded the lifespan.
    return now > gameEndTime + cacheEntryLifespan
  }

  /** Updates the value of this cache entry. */
  private async updateCachedBoxScore(): Promise<void> {
    this.logger.debug(
      tag,
      `updating cached box score for game with id "${this.gameId}"`
    )

    // Fetches the updated box score.
    const boxScore = await this.nbaApiClient.fetchBoxScore(
      this.date,
      this.gameId
    )

    // Update the box score.
    this.cachedBoxScore = boxScore
    this.timeLastUpdated = Date.now()
  }

  /** @return true if this entry should be updated. */
  private isInvalidated(): boolean {
    // Update if this entry has yet to be initialized.
    if (!this.boxScore || !this.timeLastUpdated) return true

    // Update is this entry's data has exceeded the lifespan.
    if (Date.now() - this.timeLastUpdated >= cacheEntryDataLifespan) return true

    return false
  }
}
