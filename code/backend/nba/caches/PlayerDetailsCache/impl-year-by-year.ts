import { PlayerDetails } from '../../../nba/api/schema'
import { NbaApiClient } from '../../../nba/api/NbaApiClient'
import { ContextualError } from '../../../../common/util/ContextualError'
import { Logger } from '../../../util/Logger'

import { PlayerDetailsCache } from './types'

// Log tag that identifies this module.
const tag = 'player-details-cache:year-by-year'

/** Player details cache that updates cached player details every year. */
export class YearByYearPlayerDetailsCache implements PlayerDetailsCache {
  private dateLastUpdated: Date
  private entries: Map<string, PlayerDetails>
  private logger: Logger
  private nbaApiClient: NbaApiClient

  /**
   * Creates a new year-by-year player details cache.
   * @param nbaApiClient client for the NBA API.
   * @param logger the logging utility to use.
   */
  constructor(nbaApiClient: NbaApiClient, logger: Logger) {
    this.entries = new Map()
    this.logger = logger
    this.nbaApiClient = nbaApiClient
  }

  async retrieveById(id: string): Promise<PlayerDetails | undefined> {
    try {
      // Check to see if the cache needs to be updated first.
      if (this.isInvalidated()) {
        // Looks like it does need an update, let's go ahead and update the
        // cache first.
        await this.update()
      }

      return this.entries.get(id)
    } catch (err) {
      throw new ContextualError(
        `Failed to retrieve the player details for player with id "${id}"`,
        err
      )
    }
  }

  // This is not necessary in this cache.
  collectGarbage() {}

  /** @return true if this cache needs to be updated. */
  private isInvalidated(): boolean {
    return (
      !this.dateLastUpdated ||
      new Date().getFullYear() > this.dateLastUpdated.getFullYear()
    )
  }

  /** Updates the entries in the cache. */
  private async update(): Promise<void> {
    this.logger.debug(tag, 'Updating the player details cache')

    try {
      // Cache the current date for use later on.
      const dateRequestMade = new Date()

      // Get all the player details from the NBA API.
      const allPlayerDetails = await this.nbaApiClient.fetchAllPlayerDetails(
        dateRequestMade
      )

      // Create a new entries map for the new player details.
      const newEntries = new Map<string, PlayerDetails>()

      // Stuff the new entries map with the recently fetched details.
      allPlayerDetails.league.standard.forEach(playerDetails =>
        newEntries.set(playerDetails.personId, playerDetails)
      )

      // Update the entries with the new entries.
      this.entries = newEntries
      this.dateLastUpdated = dateRequestMade
    } catch (err) {
      throw new ContextualError(
        `Failed to update the player details cache`,
        err
      )
    }
  }
}
