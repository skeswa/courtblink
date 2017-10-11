import { GameLeadersBuilder } from '../../../api/builders/GameLeadersBuilder'
import {
  IGameLeader,
  IGameSummary,
  IGameTeamStatus,
  ILiveGameStats,
} from '../../../api/schema'
import { Game } from '../../../nba/api/schema'
import { BoxScoreCache } from '../../../nba/caches/BoxScoreCache'
import { PlayerDetailsCache } from '../../../nba/caches/PlayerDetailsCache'
import { TeamColorsCache } from '../../../nba/caches/TeamColorsCache'
import { TeamDetailsCache } from '../../../nba/caches/TeamDetailsCache'
import { ContextualError } from '../../../util/ContextualError'

import {
  extractBroadcastChannel,
  extractSplashUrl,
  parseIntOrReturnZero,
} from './helpers'
import { GameSummaryBuilder } from './types'

// Default team city to use when a team doesn't have a city.
const unknownTeamCity = 'Unknown City'

// Default grayish colors to use when we don't know what colors a team has.
const unknownTeamColors = { primaryColor: '#000000', secondaryColor: '#888888' }

// Default team name to use when a team doesn't have a name.
const unknownTeamName = 'Unknown Team'

/** Uses caches to help build new game summary objects. */
export class CachedGameSummaryBuilder implements GameSummaryBuilder {
  private boxScoreCache: BoxScoreCache
  private gameLeadersBuilder: GameLeadersBuilder
  private playerDetailsCache: PlayerDetailsCache
  private teamColorsCache: TeamColorsCache
  private teamDetailsCache: TeamDetailsCache

  /**
   * Creates a new `CachedGameSummaryBuilder`.
   *
   * @param boxScoreCache caches box scores of games.
   * @param gameLeadersBuilder builds game leader objects.
   * @param playerDetailsCache caches details about players.
   * @param teamColorsCache caches colors for teams.
   * @param teamDetailsCache caches details about teams.
   */
  constructor(
    boxScoreCache: BoxScoreCache,
    gameLeadersBuilder: GameLeadersBuilder,
    playerDetailsCache: PlayerDetailsCache,
    teamColorsCache: TeamColorsCache,
    teamDetailsCache: TeamDetailsCache
  ) {
    this.boxScoreCache = boxScoreCache
    this.gameLeadersBuilder = gameLeadersBuilder
    this.playerDetailsCache = playerDetailsCache
    this.teamColorsCache = teamColorsCache
    this.teamDetailsCache = teamDetailsCache
  }

  async build(game: Game): Promise<IGameSummary> {
    try {
      // Retrieve information about the game and teams involved.
      const [homeTeam, awayTeam, boxScore] = await Promise.all([
        this.teamDetailsCache.retrieveById(game.hTeam.teamId),
        this.teamDetailsCache.retrieveById(game.vTeam.teamId),
        this.boxScoreCache.retrieveById({
          date: new Date(game.startTimeUTC),
          gameId: game.gameId,
        }),
      ])

      // Get colors for both home and away teams.
      const [homeTeamColors, awayTeamColors] = await Promise.all([
        homeTeam
          ? this.teamColorsCache.retrieveByName(homeTeam.fullName)
          : unknownTeamColors,
        awayTeam
          ? this.teamColorsCache.retrieveByName(awayTeam.fullName)
          : unknownTeamColors,
      ])

      // Create a JS date from the start time for easy time checks.
      const startTime = new Date(game.startTimeUTC)

      // To figure out if the game is over, check if the the current quarter is
      // the 4th or later and the clock has expired.
      const isGameFinished =
        startTime.getTime() < Date.now() &&
        !game.clock &&
        game.period.current > 3

      // Figure out where the game is/was being broadcasted.
      const broadcastChannel = extractBroadcastChannel(game)

      // True if the game hasn't started yet.
      const hasGameNotStarted = startTime.getTime() > Date.now()

      // Calculate home team numbers.
      const homeTeamLosses = parseIntOrReturnZero(game.hTeam.loss)
      const homeTeamScore = parseIntOrReturnZero(game.hTeam.score)
      const homeTeamWins = parseIntOrReturnZero(game.hTeam.win)

      // Calculate away team numbers.
      const awayTeamLosses = parseIntOrReturnZero(game.vTeam.loss)
      const awayTeamScore = parseIntOrReturnZero(game.vTeam.score)
      const awayTeamWins = parseIntOrReturnZero(game.vTeam.win)

      // Before creating the game summary, we need to figure out who the stat.
      // leaders of the game are.
      const gameLeaders = await this.gameLeadersBuilder.build(game)

      return {
        id: game.gameId,
        gameStartTime: startTime.getTime(),
        gameStartTimeTbd: game.isStartTimeTBD,
        finished: isGameFinished,
        notStarted: hasGameNotStarted,

        liveGameStats: {
          period: game.period.current,
          channel: broadcastChannel,
          timeRemaining: game.clock,
        },

        homeTeamStatus: {
          wins: homeTeamLosses,
          score: homeTeamScore,
          losses: homeTeamWins,
          teamId: game.hTeam.teamId,
          tricode: game.hTeam.triCode,
          name: homeTeam ? homeTeam.fullName : unknownTeamName,
          city: homeTeam ? homeTeam.city : unknownTeamCity,
          splashUrl: extractSplashUrl(homeTeam),
          splashPrimaryColor: homeTeamColors
            ? homeTeamColors.primaryColor
            : unknownTeamColors.primaryColor,
          splashSecondaryColor: homeTeamColors
            ? homeTeamColors.secondaryColor
            : unknownTeamColors.secondaryColor,
          pointsLeader: gameLeaders.homeTeam.pointsLeader,
          assistsLeader: gameLeaders.homeTeam.assistsLeader,
          reboundsLeader: gameLeaders.homeTeam.reboundsLeader,
        },

        awayTeamStatus: {
          wins: awayTeamLosses,
          score: awayTeamScore,
          losses: awayTeamWins,
          teamId: game.vTeam.teamId,
          tricode: game.vTeam.triCode,
          name: awayTeam ? awayTeam.fullName : unknownTeamName,
          city: awayTeam ? awayTeam.city : unknownTeamCity,
          splashUrl: extractSplashUrl(awayTeam),
          splashPrimaryColor: awayTeamColors
            ? awayTeamColors.primaryColor
            : unknownTeamColors.primaryColor,
          splashSecondaryColor: awayTeamColors
            ? awayTeamColors.secondaryColor
            : unknownTeamColors.secondaryColor,
          pointsLeader: gameLeaders.awayTeam.pointsLeader,
          assistsLeader: gameLeaders.awayTeam.assistsLeader,
          reboundsLeader: gameLeaders.awayTeam.reboundsLeader,
        },
      }
    } catch (err) {
      throw new ContextualError(
        'Failed to create a new game summary object',
        err
      )
    }
  }
}
