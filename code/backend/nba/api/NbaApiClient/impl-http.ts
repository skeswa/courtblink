import {
  AllPlayerDetails,
  AllTeamDetails,
  BoxScore,
  Scoreboard,
} from '../../../nba/api/schema'
import { HttpClient } from '../../../networking/HttpClient'
import { Logger } from '../../../util/Logger'
import { ContextualError } from 'common/util/ContextualError'

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

  async fetchAllTeamDetails(yyyy: string): Promise<AllTeamDetails> {
    this.logger.debug(tag, `Fetching all team details for ${yyyy}`)

    try {
      return await this.httpClient.get(
        `http://data.nba.net/data/10s/prod/v1/${yyyy}/teams.json`
      )
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch all team details for ${yyyy}`,
        err
      )
    }
  }

  async fetchAllPlayerDetails(yyyy: string): Promise<AllPlayerDetails> {
    this.logger.debug(tag, `Fetching all player details for ${yyyy}`)

    try {
      return await this.httpClient.get(
        `http://data.nba.net/data/10s/prod/v1/${yyyy}/players.json`
      )
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch all player details for ${yyyy}`,
        err
      )
    }
  }

  async fetchScoreboard(yyyymmdd: string): Promise<Scoreboard> {
    this.logger.debug(tag, `Fetching the scoreboard for ${yyyymmdd}`)

    try {
      return await this.httpClient.get(
        `http://data.nba.net/data/10s/prod/v1/${yyyymmdd}/scoreboard.json`
      )
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch the scoreboard for ${yyyymmdd}`,
        err
      )
    }
  }

  async fetchBoxScore(yyyymmdd: string, gameId: string): Promise<BoxScore> {
    this.logger.debug(
      tag,
      `Fetching the box score for "${gameId}" on ${yyyymmdd}`
    )

    try {
      return await this.httpClient.get(
        `http://data.nba.net/data/10s/prod/v1/${yyyymmdd}/` +
          `${gameId}_boxscore.json`
      )
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch the box score for "${gameId}" on ${yyyymmdd}`,
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
    } catch (err) {
      this.logger.error(tag, 'The API was not found to be reachable', err)

      return false
    }
  }
}
