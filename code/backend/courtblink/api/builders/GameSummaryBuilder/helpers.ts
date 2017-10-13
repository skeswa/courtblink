import { Game, TeamDetails } from '../../../../nba/api/schema'

// Constants for different channel names.
const leaguePassChannelName = 'League Pass'
const localChannelName = 'Local'
const tntChannelName = 'TNT'

// Generic picture of a basketball used a fallback when there is no splash url.
const fallbackSplashUrl =
  'https://www.ivacy.com/blog/wp-content/' +
  'uploads/2016/08/olympics-basketball.jpg'

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
 * @param teamDetails details about the team to get the splash url for.
 * @return the splash url for the specified team.
 */
export function extractSplashUrl(teamDetails: TeamDetails | undefined): string {
  // Use the fallback if there are no team details to work off of.
  if (!teamDetails || !teamDetails.teamId) return fallbackSplashUrl

  return (
    `http://i.cdn.turner.com/nba/nba/assets/teams/spotlight/` +
    `${teamDetails.teamId}.jpg`
  )
}

/**
 * @param intString an integer in string form.
 * @return int version of the provided numeric string, or zero.
 */
export function parseIntOrReturnZero(intString: string): number {
  const int = parseInt(intString || '', 10)
  return int ? int : 0
}
