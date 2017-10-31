import { BasketballReferenceApiClient } from '../../../bbr/api/BasketballReferenceApiClient'
import { TeamRating } from '../../../bbr/api/schema'
import { Logger } from '../../../util/Logger'
import { ContextualError } from 'common/util/ContextualError'

import { getCurrentSeason } from './helpers'
import { TeamRatingsCache } from './types'

// Log tag that identifies this module.
const tag = 'bbr:team-ratings-cache:day-by-day'

/** Team ratings cache that updates cached team ratings every day. */
export class DayByDayTeamRatingsCache implements TeamRatingsCache {
  private dateLastUpdated: Date
  private ratingsByName: Map<string, TeamRating>
  private logger: Logger
  private bbrApiClient: BasketballReferenceApiClient

  /**
   * Creates a new day-by-day team ratings cache.
   * @param bbrApiClient client used to communicate with basketball reference.
   * @param logger the logging utility to use.
   */
  constructor(bbrApiClient: BasketballReferenceApiClient, logger: Logger) {
    this.bbrApiClient = bbrApiClient
    this.ratingsByName = new Map()
    this.logger = logger
  }

  async retrieveById(id: string): Promise<TeamRating> {
    throw new Error('DayByDayTeamRatingsCache does not support retrieval by id')
  }

  async retrieveByName(name: string): Promise<TeamRating | undefined> {
    try {
      // Check to see if the cache needs to be updated first.
      if (this.isInvalidated()) {
        // Looks like it does need an update, let's go ahead and update the
        // cache first.
        await this.update()
      }

      // Make some data corrections.
      if (name === 'LA Clippers') {
        name = 'Los Angeles Clippers'
      }

      return this.ratingsByName.get(name)
    } catch (err) {
      throw new ContextualError(
        `Failed to retrieve the ratings for team with name "${name}"`,
        err
      )
    }
  }

  // This is not necessary in this cache.
  public collectGarbage() {}

  /** @return true if this cache needs to be updated. */
  private isInvalidated(): boolean {
    // Exit early if this cache has never seen an `update()`.
    if (!this.dateLastUpdated) return true

    const now = new Date()
    const then = this.dateLastUpdated

    return (
      now.getFullYear() > then.getFullYear() ||
      now.getMonth() > then.getMonth() ||
      now.getDate() > then.getDate()
    )
  }

  /** Updates the entries in the cache. */
  private async update(): Promise<void> {
    this.logger.debug(tag, 'Updating the team ratings cache')

    try {
      // Cache the current date for use later on.
      const dateRequestMade = new Date()

      // Get the year that this season ends.
      const { endingYear } = getCurrentSeason()

      // Get all the team ratings from the B.B.R API.
      const allTeamRatings = await this.bbrApiClient.fetchAllTeamRatings(
        endingYear
      )

      // Create a new entries map for the new team ratings.
      const newRatingsByName = new Map<string, TeamRating>()

      // Stuff the new entries map with the recently fetched details.
      allTeamRatings.forEach(
        rating =>
          rating.teamName
            ? newRatingsByName.set(rating.teamName, rating)
            : undefined
      )

      // Update the entries with the new entries.
      this.ratingsByName = newRatingsByName
      this.dateLastUpdated = dateRequestMade
    } catch (err) {
      throw new ContextualError(`Failed to update the team ratings cache`, err)
    }
  }
}
