package model

import (
	"fmt"

	colorDTOs "github.com/skeswa/enbiyay/backend/colors/dtos"
	"github.com/skeswa/enbiyay/backend/dtos"
	nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"
)

const (
	unknownPlayerName     = "Unknown Player"
	unkownJerseyNumber    = "??"
	defaultPrimaryColor   = "#666666"
	defaultSecondaryColor = "#222222"
)

// convertTeamColorToColors extracts the client-presentable colors for a team.
func convertTeamColorToColors(teamColors colorDTOs.TeamColorDetails) (
	primary string,
	secondary string,
) {
	if len(teamColors.Colors.Hex) > 1 {
		return normalizeHexColor(teamColors.Colors.Hex[0]),
			normalizeHexColor(teamColors.Colors.Hex[1])
	}

	if len(teamColors.Colors.RGB) > 1 {
		return normalizeRGBColor(teamColors.Colors.RGB[0]),
			normalizeRGBColor(teamColors.Colors.RGB[1])
	}

	return defaultPrimaryColor, defaultSecondaryColor
}

// convertNBAGameToGameSummary turns an NBA game DTO into a game summary DTO.
func convertNBAGameToGameSummary(game nbaDTOs.NBAGame) dtos.GameSummary {
	return dtos.GameSummary{
		ID: game.ID,
		LiveGameStats: dtos.LiveGameStats{
			Period:        game.Period.Current,
			Channel:       extractBroadcastChannel(game),
			TimeRemaining: game.Clock,
		},

		HomeTeamWins:    confidentAtoi(game.HomeTeam.Win),
		HomeTeamScore:   confidentAtoi(game.HomeTeam.Score),
		HomeTeamLosses:  confidentAtoi(game.HomeTeam.Loss),
		HomeTeamTeamID:  game.HomeTeam.ID,
		HomeTeamTriCode: game.HomeTeam.Tricode,

		AwayTeamWins:    confidentAtoi(game.AwayTeam.Win),
		AwayTeamScore:   confidentAtoi(game.AwayTeam.Score),
		AwayTeamLosses:  confidentAtoi(game.AwayTeam.Loss),
		AwayTeamTeamID:  game.AwayTeam.ID,
		AwayTeamTriCode: game.AwayTeam.Tricode,
	}
}

// convertNBAGameToGameDetails turns an NBA game dto into a game details DTO.
func convertNBAGameToGameDetails(
	game nbaDTOs.NBAGame,
	teamCache *TeamCache,
	playerCache *PlayerCache,
	boxScoreCache *BoxScoreCache,
	teamColorCache *TeamColorCache,
) (dtos.GameDetails, error) {
	var (
		details dtos.GameDetails

		homeTeam, homeTeamExists = teamCache.FindTeamByID(
			game.HomeTeam.ID)
		awayTeam, awayTeamExists = teamCache.FindTeamByID(
			game.AwayTeam.ID)
		homeTeamColors, homeTeamColorsExist = teamColorCache.FindTeamColorsByTeamID(
			game.HomeTeam.ID)
		awayTeamColors, awayTeamColorsExist = teamColorCache.FindTeamColorsByTeamID(
			game.AwayTeam.ID)
		boxScore, _ = boxScoreCache.FindBoxScoreByGameID(
			game.ID)
	)

	if !homeTeamExists {
		return details,
			fmt.Errorf("no such home team exists for team %v", game.HomeTeam.ID)
	}
	if !awayTeamExists {
		return details,
			fmt.Errorf("no such away team exists for team %v", game.AwayTeam.ID)
	}
	if !homeTeamColorsExist {
		return details,
			fmt.Errorf("no such home team colors exist for team %v", game.HomeTeam.ID)
	}
	if !awayTeamColorsExist {
		return details,
			fmt.Errorf("no such away team colors exist for team %v", game.AwayTeam.ID)
	}

	var (
		homeTeamPrimaryColor, homeTeamSecondaryColor = convertTeamColorToColors(
			homeTeamColors)
		awayTeamPrimaryColor, awayTeamSecondaryColor = convertTeamColorToColors(
			awayTeamColors)

		homeTeamPointsLeader,
		homeTeamAssistsLeader,
		homeTeamReboundsLeader,
		homeTeamStealsLeader,
		homeTeamBlocksLeader = extractStatLeaders(
			homeTeam.ID,
			boxScore.Stats.ActivePlayers,
			playerCache)

		awayTeamPointsLeader,
		awayTeamAssistsLeader,
		awayTeamReboundsLeader,
		awayTeamStealsLeader,
		awayTeamBlocksLeader = extractStatLeaders(
			awayTeam.ID,
			boxScore.Stats.ActivePlayers,
			playerCache)
	)

	details.HomeTeamName = homeTeam.FullName
	details.HomeTeamCity = homeTeam.City
	details.HomeTeamSplashURL = teamSplashPictureURL(homeTeam.ID)
	details.HomeTeamSplashPrimaryColor = homeTeamPrimaryColor
	details.HomeTeamSplashSecondaryColor = homeTeamSecondaryColor
	details.HomeTeamPointsLeader = homeTeamPointsLeader
	details.HomeTeamAssistsLeader = homeTeamAssistsLeader
	details.HomeTeamReboundsLeader = homeTeamReboundsLeader
	details.HomeTeamStealsLeader = homeTeamStealsLeader
	details.HomeTeamBlocksLeader = homeTeamBlocksLeader

	details.AwayTeamName = awayTeam.FullName
	details.AwayTeamCity = awayTeam.City
	details.AwayTeamSplashURL = teamSplashPictureURL(awayTeam.ID)
	details.AwayTeamSplashPrimaryColor = awayTeamPrimaryColor
	details.AwayTeamSplashSecondaryColor = awayTeamSecondaryColor
	details.AwayTeamPointsLeader = awayTeamPointsLeader
	details.AwayTeamAssistsLeader = awayTeamAssistsLeader
	details.AwayTeamReboundsLeader = awayTeamReboundsLeader
	details.AwayTeamStealsLeader = awayTeamStealsLeader
	details.AwayTeamBlocksLeader = awayTeamBlocksLeader

	return details, nil
}

// convertBoxScorePlayerStatsToGameLeader turns an NBA player statline into a
// game leader DTO.
func convertBoxScorePlayerStatsToGameLeader(
	boxScorePlayerStats nbaDTOs.NBABoxScorePlayerStats,
	playerCache *PlayerCache,
) dtos.GameLeader {
	playerDetails, exists := playerCache.FindPlayerByID(
		boxScorePlayerStats.PlayerID)

	if exists {
		return dtos.GameLeader{
			ID: boxScorePlayerStats.PlayerID,
			Name: composeFullName(
				playerDetails.FirstName,
				playerDetails.LastName),
			Minutes:      boxScorePlayerStats.Minutes,
			JerseyNumber: playerDetails.JerseyNumber,
		}
	}

	return dtos.GameLeader{
		ID:           boxScorePlayerStats.PlayerID,
		Name:         unknownPlayerName,
		Minutes:      boxScorePlayerStats.Minutes,
		JerseyNumber: unkownJerseyNumber,
	}
}
