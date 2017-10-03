import { LoggerInstance } from 'winston'

import NBAAPIClient from './interface'
import { BoxScore } from '../schema/box-score'
import { AllPlayerDetails } from '../schema/player-details'
import { Scoreboard } from '../schema/scoreboard'
import { AllTeamDetails } from '../schema/team-details'
import ProxiedHttpClient from '../../networking/proxied-http-client'

class HTTPNBAAPIClient implements NBAAPIClient {
  private httpClient: ProxiedHttpClient
  private logger: LoggerInstance

  constructor(httpClient: ProxiedHttpClient, logger: LoggerInstance) {
    this.httpClient = httpClient
    this.logger = logger
  }

  async fetchAllTeamDetails(date: Date): Promise<AllTeamDetails> {
    const formattedDate = yyyy(date)
    this.logger.debug(`Fetching all team details for ${formattedDate}`)

    try {
      return await this.httpClient.get(
        `http://data.nba.net/data/10s/prod/v1/${formattedDate}/teams.json`
      )
    } catch (err) {
      throw new Error(
        `Failed to fetch all team details for ${formattedDate}: ${err}`
      )
    }
  }

  async fetchAllPlayerDetails(date: Date): Promise<AllPlayerDetails> {
    const formattedDate = yyyy(date)
    this.logger.debug(`Fetching all player details for ${formattedDate}`)

    try {
      return await this.httpClient.get(
        `http://data.nba.net/data/10s/prod/v1/${formattedDate}/players.json`
      )
    } catch (err) {
      throw new Error(
        `Failed to fetch all player details for ${formattedDate}: ${err}`
      )
    }
  }

  async fetchScoreboard(date: Date): Promise<Scoreboard> {
    const formattedDate = yyyymmdd(date)
    this.logger.debug(`Fetching the scoreboard for ${formattedDate}`)

    try {
      return await this.httpClient.get(
        `http://data.nba.net/data/10s/prod/v1/${formattedDate}/scoreboard.json`
      )
    } catch (err) {
      throw new Error(
        `Failed to fetch the scoreboard for ${formattedDate}: ${err}`
      )
    }
  }

  async fetchBoxScore(date: Date, gameId: string): Promise<BoxScore> {
    const formattedDate = yyyymmdd(date)
    this.logger.debug(
      `Fetching the box score for "${gameId}" on ${formattedDate}`
    )

    try {
      return await this.httpClient.get(
        `http://data.nba.net/data/10s/prod/v1/${formattedDate}/` +
          `${gameId}_boxscore.json`
      )
    } catch (err) {
      throw new Error(
        `Failed to fetch the box score for "${gameId}" on ${formattedDate}: ` +
          `${err}`
      )
    }
  }
}

function formatAsTwoDigits(num: number): string {
  return num > 9 ? num.toString() : '0' + num.toString()
}

function yyyy(date: Date): string {
  return date.getFullYear().toString()
}

function yyyymmdd(date: Date): string {
  const month = date.getMonth() + 1 // getMonth() is zero-based.
  const day = date.getDate()
  const year = date.getFullYear()

  const mm = formatAsTwoDigits(month)
  const dd = formatAsTwoDigits(day)
  const yyyy = year.toString()

  return yyyy + mm + dd
}
