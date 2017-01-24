
export function transformSplashData(splashData) {
  if (!splashData) return null

  return {
    'games': transformSplashDataGames(splashData['1']),
    'firstGameDetails': transformGameDetails(splashData['2']),
  }
}

function transformSplashDataGames(games) {
  if (!games) return []

  return games.map(transformGameSummary)
}

function transformGameSummary(gameSummary) {
  if (!gameSummary) return null

  return {
    'id': gameSummary['1.1'],
    'liveGameStats': transformLiveGameStats(gameSummary['1.2']),

    'homeTeamWins': gameSummary['2.1'],
    'homeTeamScore': gameSummary['2.2'],
    'homeTeamLosses': gameSummary['2.3'],
    'homeTeamTeamId': gameSummary['2.4'],
    'homeTeamTriCode': gameSummary['2.5'],

    'awayTeamWins': gameSummary['3.1'],
    'awayTeamScore': gameSummary['3.2'],
    'awayTeamLosses': gameSummary['3.3'],
    'awayTeamTeamId': gameSummary['3.4'],
    'awayTeamTriCode': gameSummary['3.5'],
  }
}

function transformLiveGameStats(liveGameStats) {
  if (!liveGameStats) return null

  return {
    'period': liveGameStats['1'],
    'channel': liveGameStats['2'],
    'timeRemaining': liveGameStats['3'],
  }
}

function transformGameDetails(gameDetails) {
  if (!gameDetails) return null

  return {
    'homeTeamName': gameDetails['1.1'],
    'homeTeamCity': gameDetails['1.2'],
    'homeTeamSplashUrl': gameDetails['1.3'],
    'homeTeamSplashPrimaryColor': gameDetails['1.4.1'],
    'homeTeamSplashSecondaryColor': gameDetails['1.4.2'],
    'homeTeamPointsLeader': transformGameLeader(gameDetails['1.5']),
    'homeTeamAssistsLeader': transformGameLeader(gameDetails['1.6']),
    'homeTeamReboundsLeader': transformGameLeader(gameDetails['1.7']),
    'homeTeamStealsLeader': transformGameLeader(gameDetails['1.8']),
    'homeTeamBlocksLeader': transformGameLeader(gameDetails['1.9']),

    'awayTeamName': gameDetails['2.1'],
    'awayTeamCity': gameDetails['2.2'],
    'awayTeamSplashUrl': gameDetails['2.3'],
    'awayTeamSplashPrimaryColor': gameDetails['2.4.1'],
    'awayTeamSplashSecondaryColor': gameDetails['2.4.2'],
    'awayTeamPointsLeader': transformGameLeader(gameDetails['2.5']),
    'awayTeamAssistsLeader': transformGameLeader(gameDetails['2.6']),
    'awayTeamReboundsLeader': transformGameLeader(gameDetails['2.7']),
    'awayTeamStealsLeader': transformGameLeader(gameDetails['2.8']),
    'awayTeamBlocksLeader': transformGameLeader(gameDetails['2.9']),
  }
}

function transformGameLeader(gameLeader) {
  if (!gameLeader) return null

  return {
    'id': gameLeader['1'],
    'name': gameLeader['2'],
    'minutes': gameLeader['3'],
    'statValue': gameLeader['4'],
    'jerseyNumber': gameLeader['5'],
  }
}
