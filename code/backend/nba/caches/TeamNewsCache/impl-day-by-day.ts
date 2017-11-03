import { NewsArticle } from '../../../nba/api/schema'
import { NbaApiClient } from '../../../nba/api/NbaApiClient'
import { Clock } from '../../../util/Clock'
import { Logger } from '../../../util/Logger'
import { ContextualError } from 'common/util/ContextualError'

import { TeamNewsCache } from './types'

// Log tag that identifies this module.
const tag = 'team-news-cache:day-by-day'

// How long to leave data in a cache entry alone before updating it.
const cacheEntryDataLifespan = 24 * 60 * 60 * 1000 /* 1 day (ms). */

/** Team news cache that updates cached team newss every day. */
export class DayByDayTeamNewsCache implements TeamNewsCache {
  private clock: Clock
  private entries: Map<string, CacheEntry>
  private logger: Logger
  private nbaApiClient: NbaApiClient

  /**
   * Creates a new day-by-day team news cache.
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

  async retrieveById(id: null): Promise<NewsArticle[]> {
    throw new Error('DayByDayTeamNewsCache does not support retrieval by id')
  }

  async retrieveByName(teamUrlName: string): Promise<NewsArticle[]> {
    let entry = this.entries.get(teamUrlName)

    // Check if we need to create a new entry first.
    if (!entry) {
      // Create a new entry.
      entry = new CacheEntry(
        this.clock,
        this.logger,
        this.nbaApiClient,
        teamUrlName
      )

      // Make sure it is represented in the entries map before continuing.
      this.entries.set(teamUrlName, entry)
    }

    return await entry.teamNews()
  }

  // This is not necessary in this cache.
  collectGarbage() {}
}

/** Entry of the cache. Wraps an individual team news. */
class CacheEntry {
  private cachedTeamNews: NewsArticle[]
  private clock: Clock
  private logger: Logger
  private nbaApiClient: NbaApiClient
  private timeLastUpdated: number
  private teamUrlName: string

  constructor(
    clock: Clock,
    logger: Logger,
    nbaApiClient: NbaApiClient,
    teamUrlName: string
  ) {
    this.clock = clock
    this.logger = logger
    this.nbaApiClient = nbaApiClient
    this.teamUrlName = teamUrlName
  }

  /** Gets the value of this cache entry. */
  async teamNews(): Promise<NewsArticle[]> {
    try {
      // Check if an update is required.
      if (this.isInvalidated()) {
        // An update is required, so perform the update first.
        await this.updateCachedTeamNews()
      }

      return this.cachedTeamNews
    } catch (err) {
      throw new ContextualError(
        `Failed to get the latest team news for "${this.teamUrlName}"`,
        err
      )
    }
  }

  /** Updates the value of this cache entry. */
  private async updateCachedTeamNews(): Promise<void> {
    this.logger.debug(
      tag,
      `updating cached team news for "${this.teamUrlName}"`
    )

    // Fetches the updated team news.
    const teamNews = await this.nbaApiClient.fetchTeamNews(this.teamUrlName)

    // Update the team news.
    this.cachedTeamNews = teamNews
    this.timeLastUpdated = this.clock.millisSinceEpoch()
  }

  /** @return true if this entry should be updated. */
  private isInvalidated(): boolean {
    // Update if this entry has yet to be initialized.
    if (!this.cachedTeamNews || !this.timeLastUpdated) return true

    return (
      this.clock.millisSinceEpoch() - this.timeLastUpdated >
      cacheEntryDataLifespan
    )
  }
}
