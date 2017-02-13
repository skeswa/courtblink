
export function transformSplashData(splashData) {
  if (!splashData) return null

  return {
    'games': transformSplashDataGames(splashData['1']),
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
    'startTime': gameSummary['1.3'] ? gameSummary['1.3'] * 1000 : null,
    'startTimeTBD': gameSummary['1.4'],
    'finished': gameSummary['1.5'],
    'notStarted': gameSummary['1.6'],

    'homeTeamWins': gameSummary['2.1'],
    'homeTeamScore': gameSummary['2.2'],
    'homeTeamLosses': gameSummary['2.3'],
    'homeTeamTeamId': gameSummary['2.4'],
    'homeTeamTriCode': gameSummary['2.5'],
    'homeTeamName': gameSummary['2.6'],
    'homeTeamCity': gameSummary['2.7'],
    'homeTeamSplashUrl': gameSummary['2.8'],
    'homeTeamSplashPrimaryColor': gameSummary['2.9'],
    'homeTeamSplashSecondaryColor': gameSummary['2.10'],
    'homeTeamPointsLeader': transformGameLeader(gameSummary['2.11']),
    'homeTeamAssistsLeader': transformGameLeader(gameSummary['2.12']),
    'homeTeamReboundsLeader': transformGameLeader(gameSummary['2.13']),

    'awayTeamWins': gameSummary['3.1'],
    'awayTeamScore': gameSummary['3.2'],
    'awayTeamLosses': gameSummary['3.3'],
    'awayTeamTeamId': gameSummary['3.4'],
    'awayTeamTriCode': gameSummary['3.5'],
    'awayTeamName': gameSummary['3.6'],
    'awayTeamCity': gameSummary['3.7'],
    'awayTeamSplashUrl': gameSummary['3.8'],
    'awayTeamSplashPrimaryColor': gameSummary['3.9'],
    'awayTeamSplashSecondaryColor': gameSummary['3.10'],
    'awayTeamPointsLeader': transformGameLeader(gameSummary['3.11']),
    'awayTeamAssistsLeader': transformGameLeader(gameSummary['3.12']),
    'awayTeamReboundsLeader': transformGameLeader(gameSummary['3.13']),
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
