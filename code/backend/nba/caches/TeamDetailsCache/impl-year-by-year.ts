import { TeamDetails } from '../../../nba/api/schema'
import { NbaApiClient } from '../../../nba/api/NbaApiClient'
import { Logger } from '../../../util/Logger'
import { ContextualError } from 'common/util/ContextualError'
import { yyyy } from 'common/util/date/helpers'

import { TeamDetailsCache } from './types'

// Log tag that identifies this module.
const tag = 'team-details-cache:year-by-year'

/** Team details cache that updates cached team details every year. */
export class YearByYearTeamDetailsCache implements TeamDetailsCache {
  private dateLastUpdated: Date
  private entriesById: Map<string, TeamDetails>
  private entriesByName: Map<string, TeamDetails>
  private logger: Logger
  private nbaApiClient: NbaApiClient

  /**
   * Creates a new year-by-year team details cache.
   * @param nbaApiClient client for the NBA API.
   * @param logger the logging utility to use.
   */
  constructor(nbaApiClient: NbaApiClient, logger: Logger) {
    this.entriesById = new Map()
    this.entriesByName = new Map()
    this.logger = logger
    this.nbaApiClient = nbaApiClient
  }

  async retrieveById(id: string): Promise<TeamDetails | undefined> {
    try {
      // Check to see if the cache needs to be updated first.
      if (this.isInvalidated()) {
        // Looks like it does need an update, let's go ahead and update the
        // cache first.
        await this.update()
      }

      return this.entriesById.get(id)
    } catch (err) {
      throw new ContextualError(
        `Failed to retrieve the team details for team with id "${id}"`,
        err
      )
    }
  }

  async retrieveByName(name: string): Promise<TeamDetails | undefined> {
    try {
      // Check to see if the cache needs to be updated first.
      if (this.isInvalidated()) {
        // Looks like it does need an update, let's go ahead and update the
        // cache first.
        await this.update()
      }

      return this.entriesByName.get(name)
    } catch (err) {
      throw new ContextualError(
        `Failed to retrieve the team details for team with name "${name}"`,
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
    this.logger.debug(tag, 'Updating the team details cache')

    try {
      // Cache the current date for use later on.
      const dateRequestMade = new Date()

      // Get all the team details from the NBA API.
      const allTeamDetails = await this.nbaApiClient.fetchAllTeamDetails(
        yyyy(dateRequestMade)
      )

      // Create a new entries map for the new team details.
      const newEntriesById = new Map<string, TeamDetails>()
      const newEntriesByName = new Map<string, TeamDetails>()

      // Stuff the new entries map with the recently fetched details.
      allTeamDetails.league.standard.forEach(teamDetails => {
        newEntriesById.set(teamDetails.teamId, teamDetails)
        newEntriesByName.set(teamDetails.fullName, teamDetails)
      })

      // Update the entries with the new entries.
      this.entriesById = newEntriesById
      this.entriesByName = newEntriesByName
      this.dateLastUpdated = dateRequestMade
    } catch (err) {
      throw new ContextualError(`Failed to update the team details cache`, err)
    }
  }
}
