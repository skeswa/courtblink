import { GameLeadersBuilder } from '../../../../courtblink/api/builders/GameLeadersBuilder'
import { Game } from '../../../../nba/api/schema'
import { BoxScoreCache } from '../../../../nba/caches/BoxScoreCache'
import { PlayerDetailsCache } from '../../../../nba/caches/PlayerDetailsCache'
import { TeamColorsCache } from '../../../../nba/caches/TeamColorsCache'
import { TeamDetailsCache } from '../../../../nba/caches/TeamDetailsCache'
import { Clock } from '../../../../util/Clock'
import {
  IGameLeader,
  IGameSummary,
  IGameTeamStatus,
  ILiveGameStats,
} from 'common/api/schema/generated'
import { ContextualError } from 'common/util/ContextualError'

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
  private clock: Clock
  private gameLeadersBuilder: GameLeadersBuilder
  private playerDetailsCache: PlayerDetailsCache
  private teamColorsCache: TeamColorsCache
  private teamDetailsCache: TeamDetailsCache

  /**
   * Creates a new `CachedGameSummaryBuilder`.
   *
   * @param boxScoreCache caches box scores of games.
   * @param clock time utility.
   * @param gameLeadersBuilder builds game leader objects.
   * @param playerDetailsCache caches details about players.
   * @param teamColorsCache caches colors for teams.
   * @param teamDetailsCache caches details about teams.
   */
  constructor(
    boxScoreCache: BoxScoreCache,
    clock: Clock,
    gameLeadersBuilder: GameLeadersBuilder,
    playerDetailsCache: PlayerDetailsCache,
    teamColorsCache: TeamColorsCache,
    teamDetailsCache: TeamDetailsCache
  ) {
    this.boxScoreCache = boxScoreCache
    this.clock = clock
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
          gameId: game.gameId,
          yyyymmdd: game.startDateEastern,
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
        startTime.getTime() < this.clock.millisSinceEpoch() &&
        !game.clock &&
        game.period.current > 3

      // Figure out where the game is/was being broadcasted.
      const broadcastChannel = extractBroadcastChannel(game)

      // True if the game hasn't started yet.
      const hasGameNotStarted =
        startTime.getTime() > this.clock.millisSinceEpoch()

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
        // We send this value over the wire in minutes - not much precision is
        // needed.
        gameStartTime: startTime.getTime() / 1000 / 60,
        gameStartTimeTbd: game.isStartTimeTBD,
        finished: isGameFinished,
        notStarted: hasGameNotStarted,

        liveGameStats: {
          period: game.period.current,
          channel: broadcastChannel,
          timeRemaining: game.clock,
        },

        homeTeamStatus: {
          wins: homeTeamWins,
          score: homeTeamScore,
          losses: homeTeamLosses,
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
          wins: awayTeamWins,
          score: awayTeamScore,
          losses: awayTeamLosses,
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
