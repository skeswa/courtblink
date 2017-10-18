import { IGameLeader } from 'common/api/schema/generated/schema'

import { BoxScore, PlayerStatline } from '../../../../nba/api/schema'
import { PlayerDetailsCache } from '../../../../nba/caches/PlayerDetailsCache'
import { ContextualError } from '../../../../../common/util/ContextualError'

import { TeamLeaders } from './types'

/**
 * Calculates stat. leaders for a particular team.
 * @param boxScore the box score used to build the team leaders.
 * @param teamId id of the team for which leaders will be found.
 * @param playerDetailsCache cache for detailed player information.
 * @return stat. leaders for the specified team.
 */
export async function calculateTeamLeaders(
  boxScore: BoxScore,
  teamId: string,
  playerDetailsCache: PlayerDetailsCache
): Promise<TeamLeaders> {
  // Exit early if there aren't yet stats to work with.
  if (!boxScore.stats) {
    return {}
  }

  let lowestAssistsSortKey: number | null = null,
    lowestPointsSortKey: number | null = null,
    lowestReboundsSortKey: number | null = null

  let assistsLeaderStatLine: PlayerStatline | null = null,
    pointsLeaderStatLine: PlayerStatline | null = null,
    reboundsLeaderStatLine: PlayerStatline | null = null

  try {
    // Loop through the active players looking for the leaders.
    for (let activePlayer of boxScore.stats.activePlayers) {
      // Skip players not on this team.
      if (activePlayer.teamId !== teamId) continue

      const {
        sortKey: {
          assists: assistsSortKey,
          points: pointsSortKey,
          totReb: reboundsSortKey,
        },
      } = activePlayer

      // Check if this player is the assists leader.
      if (
        lowestAssistsSortKey === null ||
        assistsSortKey < lowestAssistsSortKey
      ) {
        lowestAssistsSortKey = assistsSortKey
        assistsLeaderStatLine = activePlayer
      }

      // Check if this player is the points leader.
      if (lowestPointsSortKey === null || pointsSortKey < lowestPointsSortKey) {
        lowestPointsSortKey = pointsSortKey
        pointsLeaderStatLine = activePlayer
      }

      // Check if this player is the rebounds leader.
      if (
        lowestReboundsSortKey === null ||
        reboundsSortKey < lowestReboundsSortKey
      ) {
        lowestReboundsSortKey = reboundsSortKey
        reboundsLeaderStatLine = activePlayer
      }
    }

    // Turn each of the leader stat lines into a game leader object.
    const [assistsLeader, pointsLeader, reboundsLeader] = await Promise.all([
      toGameLeader(
        assistsLeaderStatLine,
        assistsLeaderStatLine ? assistsLeaderStatLine.assists : null,
        playerDetailsCache
      ),
      toGameLeader(
        pointsLeaderStatLine,
        pointsLeaderStatLine ? pointsLeaderStatLine.points : null,
        playerDetailsCache
      ),
      toGameLeader(
        reboundsLeaderStatLine,
        reboundsLeaderStatLine ? reboundsLeaderStatLine.totReb : null,
        playerDetailsCache
      ),
    ])

    return { assistsLeader, pointsLeader, reboundsLeader }
  } catch (err) {
    throw new ContextualError('Failed to calculate team leaders', err)
  }
}

/**
 * Turns a stat line and a stat value into a game leader.
 * @param statLine stats for the the game leader.
 * @param statValue the value of the stat that this player leads.
 * @param playerDetailsCache cache for detailed player information.
 * @return game leader object that represents the player of the stat line.
 */
export async function toGameLeader(
  statLine: PlayerStatline | null,
  statValue: string | null,
  playerDetailsCache: PlayerDetailsCache
): Promise<IGameLeader | undefined> {
  // Exit early if there is no data to work with. Return `undefined` instead
  // of `null` due to how optional fields work in typescript.
  if (!statLine || !statValue) return undefined

  // Get some more information about the player that generated this statline.
  const playerDetails = await playerDetailsCache.retrieveById(statLine.personId)

  return playerDetails
    ? {
        id: statLine.personId,
        name: `${playerDetails.firstName} ${playerDetails.lastName}`,
        minutes: statLine.min,
        jerseyNumber: playerDetails.jersey,
        statValue: statValue.toString(),
      }
    : // If there aren't player details, make it up.
      {
        id: statLine.personId,
        name: 'Unknown Player',
        minutes: statLine.min,
        jerseyNumber: '??',
        statValue: statValue.toString(),
      }
}
