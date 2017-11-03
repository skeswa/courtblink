import {
  AllPlayerDetails,
  AllTeamDetails,
  BoxScore,
  NewsArticle,
  Scoreboard,
} from '../../../nba/api/schema'
import { HttpClient } from '../../../networking/HttpClient'
import { Logger } from '../../../util/Logger'
import { ContextualError } from 'common/util/ContextualError'

import { first, NbaRssFeed, parseNbaRssFeed } from './helpers'
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

  async fetchTeamNews(teamUrlName: string): Promise<NewsArticle[]> {
    this.logger.debug(tag, `Fetching team news for "${teamUrlName}"`)

    try {
      const rssXml = await this.httpClient.get(
        `http://www.nba.com/${teamUrlName}/rss.xml`,
        false
      )

      // Use the resulting XML string to read the feed.
      const feed = await parseNbaRssFeed(rssXml)

      // Get the interesting bits of the feed.
      const feedItems =
        feed && feed.rss && feed.rss.channel && feed.rss.channel.length > 0
          ? feed.rss.channel[0].item
          : undefined

      // Exit early if there is no interesting data.
      if (!feedItems || feedItems.length < 1) return []

      return feedItems.map(feedItem => {
        const author = first(feedItem.author)
        const description = first(feedItem.description)
        const link = first(feedItem.link)
        const title = first(feedItem.title)

        const imageUrl =
          feedItem.enclosure &&
          feedItem.enclosure.length > 0 &&
          feedItem.enclosure[0].$
            ? feedItem.enclosure[0].$.url
            : undefined

        return { author, description, imageUrl, link, title }
      })
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch team news for "${teamUrlName}"`,
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
