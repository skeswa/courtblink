import { BoxScore } from 'nba/schema/box-score'
import { AllPlayerDetails } from 'nba/schema/player-details'
import { Scoreboard } from 'nba/schema/scoreboard'
import { AllTeamDetails } from 'nba/schema/team-details'
import { HttpClient } from 'networking/HttpClient'
import { ContextualError } from 'util/ContextualError'
import { Logger } from 'util/Logger'

import { yyyy, yyyymmdd } from './helpers'
import { NbaApiClient } from './types'

export class HttpNbaApiClient implements NbaApiClient {
  private httpClient: HttpClient
  private logger: Logger

  constructor(httpClient: HttpClient, logger: Logger) {
    this.httpClient = httpClient
    this.logger = logger
  }

  async fetchAllTeamDetails(date: Date): Promise<AllTeamDetails> {
    const formattedDate = yyyy(date)
    this.logger.debug(
      'nba:httpapi',
      `Fetching all team details for ${formattedDate}`
    )

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
    this.logger.debug(
      'nba:httpapi',
      `Fetching all player details for ${formattedDate}`
    )

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
    this.logger.debug(
      'nba:httpapi',
      `Fetching the scoreboard for ${formattedDate}`
    )

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
      'nba:httpapi',
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
}
