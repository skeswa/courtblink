import {
  AllPlayerDetails,
  AllTeamDetails,
  BoxScore,
  Scoreboard,
} from '../../../nba/api/schema'
import { HttpClient } from '../../../networking/HttpClient'
import { ContextualError } from '../../../util/ContextualError'
import { yyyy, yyyymmdd } from '../../../util/date/helpers'
import { Logger } from '../../../util/Logger'

import { NbaApiClient } from './types'

// Log tag that identifies this module.
const tag = 'nba:httpapi'

export class HttpNbaApiClient implements NbaApiClient {
  private httpClient: HttpClient
  private logger: Logger

  constructor(httpClient: HttpClient, logger: Logger) {
    this.httpClient = httpClient
    this.logger = logger
  }

  async fetchAllTeamDetails(date: Date): Promise<AllTeamDetails> {
    const formattedDate = yyyy(date)
    this.logger.debug(tag, `Fetching all team details for ${formattedDate}`)

    try {
      return await this.httpClient.get(
        `http://data.nba.net/data/10s/prod/v1/${formattedDate}/teams.json`
      )
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch all team details for ${formattedDate}`,
        err
      )
    }
  }

  async fetchAllPlayerDetails(date: Date): Promise<AllPlayerDetails> {
    const formattedDate = yyyy(date)
    this.logger.debug(tag, `Fetching all player details for ${formattedDate}`)

    try {
      return await this.httpClient.get(
        `http://data.nba.net/data/10s/prod/v1/${formattedDate}/players.json`
      )
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch all player details for ${formattedDate}`,
        err
      )
    }
  }

  async fetchScoreboard(date: Date): Promise<Scoreboard> {
    const formattedDate = yyyymmdd(date)
    this.logger.debug(tag, `Fetching the scoreboard for ${formattedDate}`)

    try {
      return await this.httpClient.get(
        `http://data.nba.net/data/10s/prod/v1/${formattedDate}/scoreboard.json`
      )
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch the scoreboard for ${formattedDate}`,
        err
      )
    }
  }

  async fetchBoxScore(date: Date, gameId: string): Promise<BoxScore> {
    const formattedDate = yyyymmdd(date)
    this.logger.debug(
      tag,
      `Fetching the box score for "${gameId}" on ${formattedDate}`
    )

    try {
      return await this.httpClient.get(
        `http://data.nba.net/data/10s/prod/v1/${formattedDate}/` +
          `${gameId}_boxscore.json`
      )
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch the box score for "${gameId}" on ${formattedDate}`,
        err
      )
    }
  }

  async isReachable(): Promise<boolean> {
    this.logger.debug(tag, 'Checking for API reachability')

    // Check if the base NBA API endpoint responds without timing out.
    try {
      await this.httpClient.get('http://data.nba.net')

      this.logger.debug(tag, 'The API was found to be reachable')

      return true
    } catch (_) {
      this.logger.debug(tag, 'The API was not found to be reachable')

      return false
    }
  }
}
