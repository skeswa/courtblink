import {
  NbaColorService,
  TeamColors,
} from '../../../nba/colors/NbaColorService'
import { ContextualError } from '../../../../common/util/ContextualError'
import { Logger } from '../../../util/Logger'

import { isYearByYearCacheEntryStale } from './helpers'
import { TeamColorsCache, TeamColorsCacheEntry } from './types'

// Log tag that identifies this module.
const tag = 'team-colors-cache:year-by-year'

/** Team colors cache that updates cached team colors every year. */
export class YearByYearTeamColorsCache implements TeamColorsCache {
  private dateLastUpdated: Date
  private entriesByName: Map<string, TeamColorsCacheEntry>
  private logger: Logger
  private nbaColorService: NbaColorService

  /**
   * Creates a new year-by-year team colors cache.
   * @param nbaColorService the service used to fetch team colors.
   * @param logger the logging utility to use.
   */
  constructor(nbaColorService: NbaColorService, logger: Logger) {
    this.entriesByName = new Map()
    this.logger = logger
    this.nbaColorService = nbaColorService
  }

  async retrieveById(id: string): Promise<TeamColors> {
    throw new Error(
      'YearByYearTeamColorsCache does not support retrieval by id'
    )
  }

  async retrieveByName(name: string): Promise<TeamColors> {
    // Get the entry out of the map.
    let entry = this.entriesByName.get(name)

    // If the entry is stale, or null, create a new entry.
    if (!entry || isYearByYearCacheEntryStale(entry)) {
      // First, get the team colors using the service.
      const teamColors = await this.nbaColorService.fetchTeamColor(name)

      // Then, create and save the entry.
      entry = { teamColors, dateLastUpdated: new Date() }
      this.entriesByName.set(name, entry)
    }

    return entry.teamColors
  }

  // This is not necessary in this cache.
  collectGarbage() {}
}
