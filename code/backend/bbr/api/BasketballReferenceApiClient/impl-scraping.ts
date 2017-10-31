import { load as loadHtml } from 'cheerio'

import { ContextualError } from 'common/util/ContextualError'

import { TeamRating } from '../../../bbr/api/schema'
import { HttpClient } from '../../../networking/HttpClient'
import { Logger } from '../../../util/Logger'

import { BasketballReferenceApiClient } from './types'
import { toDouble, toInt } from './helpers'

// Log tag that identifies this module.
const tag = 'bbr:httpapi'

/**
 * Basketball reference API client that communicates with the service over HTTP
 * and reads data by parsing website pages.
 */
export class ScrapingBasketballReferenceApiClient
  implements BasketballReferenceApiClient {
  private httpClient: HttpClient
  private logger: Logger

  /**
   * Creates a new `BasketballReferenceApiClient`.
   * @param httpClient client used to make HTTP requests.
   * @param logger logging utility.
   */
  constructor(httpClient: HttpClient, logger: Logger) {
    this.httpClient = httpClient
    this.logger = logger
  }

  async fetchAllTeamRatings(seasonEndingYear: number): Promise<TeamRating[]> {
    this.logger.debug(
      tag,
      `Fetching all team ratings for ${seasonEndingYear} season`
    )

    try {
      // Download the team ratings page.
      const teamRatingsPageHtml = await this.httpClient.get(
        `https://www.basketball-reference.com/leagues/` +
          `NBA_${seasonEndingYear}_ratings.html`,
        /* shouldParseJson */ false
      )

      // Use cheerio to parse out the DOM of the page html.
      const $ = loadHtml(teamRatingsPageHtml)

      // Turn the raw table rows into ratings, but don't rank them yet.
      const ratings = $('#ratings tbody tr')
        .toArray()
        // Turn each `tr` into a representative object.
        .map(row =>
          $(row)
            .find('td')
            .toArray()
            // Turn each cell of the table row into a key-value pair
            // representing one stat.
            .map(tdEl => {
              const td = $(tdEl)
              return {
                key: td.attr('data-stat') as keyof TeamRatingsTableRow,
                value: td.text(),
              }
            })
            // Compose all the key-value pairs together into one ratings
            // object.
            .reduce(
              (entries, entry) => {
                entries[entry.key] = entry.value
                return entries
              },
              {} as TeamRatingsTableRow
            )
        )
        // Massage each table row into a more scrictly typed version of
        // itself.
        .map(row => ({
          adjustedDefensiveRating: toDouble(row.def_rtg_adj),
          adjustedOffensiveRating: toDouble(row.off_rtg_adj),
          adjustedMarginOfVictory: toDouble(row.off_rtg_adj),
          adjustedNetRating: toDouble(row.net_rtg_adj),
          defensiveRating: toDouble(row.def_rtg),
          losses: toInt(row.losses),
          marginOfVictory: toDouble(row.mov),
          netRating: toDouble(row.net_rtg),
          offensiveRating: toDouble(row.off_rtg),
          teamName: row.team_name,
          winLossPercentage: toDouble(row.win_loss_pct),
          wins: toInt(row.wins),

          defensiveRank: -1,
          offensiveRank: -1,
          overallRank: -1,
        }))

      // Sort all the ratings so that we can calculate rank.
      const ratingsSortedByOffense = ratings
        .slice(0)
        .sort(
          (a, b) =>
            (b.adjustedOffensiveRating || 0) - (a.adjustedOffensiveRating || 0)
        )
      const ratingsSortedByDefense = ratings
        .slice(0)
        .sort(
          (a, b) =>
            (a.adjustedDefensiveRating || 200) -
            (b.adjustedDefensiveRating || 200)
        )
      const ratingsSortedByOverall = ratings
        .slice(0)
        .sort((a, b) => (b.adjustedNetRating || 0) - (a.adjustedNetRating || 0))

      // Mutate each rating in-place with rank metadata.
      ratingsSortedByOffense.forEach(
        (rating, i) => (rating.offensiveRank = i + 1)
      )
      ratingsSortedByDefense.forEach(
        (rating, i) => (rating.defensiveRank = i + 1)
      )
      ratingsSortedByOverall.forEach(
        (rating, i) => (rating.overallRank = i + 1)
      )

      return ratings
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch all team ratings for ${seasonEndingYear}`,
        err
      )
    }
  }
}

/** Represents one row of the team ratings table. */
type TeamRatingsTableRow = {
  team_name?: string
  conf_id?: string
  div_id?: string
  wins?: string
  losses?: string
  win_loss_pct?: string
  mov?: string
  off_rtg?: string
  def_rtg?: string
  net_rtg?: string
  mov_adj?: string
  off_rtg_adj?: string
  def_rtg_adj?: string
  net_rtg_adj?: string
}
