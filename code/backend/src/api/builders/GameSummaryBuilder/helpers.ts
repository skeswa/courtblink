import { Game } from '../../../nba/api/schema'

// Constants for different channel names.
const leaguePassChannelName = 'League Pass'
const localChannelName = 'Local'
const tntChannelName = 'TNT'

/**
 * Estimates what the broadcast channel is by looking at the provided game.
 * Returns an educated guess about what channel is broadcasting.
 * @param game game from the NBA API.
 * @return educated guess about what channel is broadcasting the given game.
 */
export function extractBroadcastChannel(game: Game): string {
  // If there is a national broadcaster, return it. We prioritize national
  // broadcast information.
  if (game.watch.broadcast.broadcasters.national.length > 0) {
    return game.watch.broadcast.broadcasters.national[0].shortName
  }

  // Check if the game is TNT next.
  if (game.watch.broadcast.video.isTNTOT) {
    return tntChannelName
  }

  // Check if the game is on league pass last.
  if (game.watch.broadcast.video.isLeaguePass) {
    return leaguePassChannelName
  }

  // If none of the national channels are broadcasting, just assume the game is
  // being shown locally.
  return localChannelName
}

/**
 * @param intString an integer in string form.
 * @return int version of the provided numeric string, or zero.
 */
export function parseIntOrReturnZero(intString: string): number {
  const int = parseInt(intString || '', 10)
  return int ? int : 0
}

/**
 * @param teamId id of the team to get the splash url for.
 * @return the plash url for the specified team.
 */
export function toSplashUrl(teamId: string): string {
  return `http://i.cdn.turner.com/nba/nba/assets/teams/spotlight/${teamId}.jpg`
}
