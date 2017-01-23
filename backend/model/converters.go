package model

import (
	"fmt"

	colorDTOs "github.com/skeswa/enbiyay/backend/colors/dtos"
	"github.com/skeswa/enbiyay/backend/dtos"
	nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"
)

const (
	defaultPrimaryColor   = "#666666"
	defaultSecondaryColor = "#222222"
)

// convertTeamColorToColors extracts the client-presentable colors for a team.
func convertTeamColorToColors(teamColors colorDTOs.TeamColorDetails) (primary, secondary string) {
	if len(teamColors.Colors.Hex) > 1 {
		return normalizeHexColor(teamColors.Colors.Hex[0]), normalizeHexColor(teamColors.Colors.Hex[1])
	}

	if len(teamColors.Colors.RGB) > 1 {
		return normalizeRGBColor(teamColors.Colors.RGB[0]), normalizeRGBColor(teamColors.Colors.RGB[1])
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
) dtos.GameDetails {
	var (
		details            dtos.GameDetails
		playerID           string
		playerDetails      nbaDTOs.NBAPlayerDetails
		playerDetailsExist bool

		homeTeam, homeTeamExists            = teamCache.FindTeamByID(game.HomeTeam.ID)
		awayTeam, awayTeamExists            = teamCache.FindTeamByID(game.AwayTeam.ID)
		homeTeamColors, homeTeamColorsExist = teamColorCache.FindTeamColorsByTeamID(game.HomeTeam.ID)
		awayTeamColors, awayTeamColorsExist = teamColorCache.FindTeamColorsByTeamID(game.AwayTeam.ID)
		boxScore, boxScoreExists            = boxScoreCache.FindBoxScoreByGameID(game.ID)
	)

	if !homeTeamExists {
		panic(fmt.Sprintf("No such home team exists: %v", game.HomeTeam.ID))
	}
	if !awayTeamExists {
		panic(fmt.Sprintf("No such away team exists: %v", game.AwayTeam.ID))
	}
	if !homeTeamColorsExist {
		panic(fmt.Sprintf("No such home team colors exist: %v", game.HomeTeam.ID))
	}
	if !awayTeamColorsExist {
		panic(fmt.Sprintf("No such away team colors exist: %v", game.AwayTeam.ID))
	}

	var (
		homeTeamPrimaryColor, homeTeamSecondaryColor = convertTeamColorToColors(homeTeamColors)
		awayTeamPrimaryColor, awayTeamSecondaryColor = convertTeamColorToColors(awayTeamColors)
	)

	details.HomeTeamName = homeTeam.FullName
	details.HomeTeamCity = homeTeam.City
	details.HomeTeamSplashURL = teamSplashPictureURL(homeTeam.ID)
	details.HomeTeamSplashPrimaryColor = homeTeamPrimaryColor
	details.HomeTeamSplashSecondaryColor = homeTeamSecondaryColor
	if boxScoreExists && len(boxScore.Stats.HomeTeamStats.Leaders.PointsLeader.Players) > 0 {
		playerID = boxScore.Stats.HomeTeamStats.Leaders.PointsLeader.Players[0].ID
		playerDetails, playerDetailsExist = playerCache.FindPlayerByID(playerID)
		if !playerDetailsExist {
			panic(fmt.Sprintf("No such player details exist: %v", playerID))
		}
		details.HomeTeamPointsLeaderID = playerID
		details.HomeTeamPointsLeaderName = composeFullName(
			playerDetails.FirstName,
			playerDetails.LastName)
		details.HomeTeamPointsLeaderJerseyNumber = playerDetails.JerseyNumber
	}
	if boxScoreExists && len(boxScore.Stats.HomeTeamStats.Leaders.AssistsLeader.Players) > 0 {
		playerID = boxScore.Stats.HomeTeamStats.Leaders.AssistsLeader.Players[0].ID
		playerDetails, playerDetailsExist = playerCache.FindPlayerByID(playerID)
		if !playerDetailsExist {
			panic(fmt.Sprintf("No such player details exist: %v", playerID))
		}
		details.HomeTeamAssistsLeaderID = playerID
		details.HomeTeamAssistsLeaderName = composeFullName(
			playerDetails.FirstName,
			playerDetails.LastName)
		details.HomeTeamAssistsLeaderJerseyNumber = playerDetails.JerseyNumber
	}
	if boxScoreExists && len(boxScore.Stats.HomeTeamStats.Leaders.ReboundsLeader.Players) > 0 {
		playerID = boxScore.Stats.HomeTeamStats.Leaders.ReboundsLeader.Players[0].ID
		playerDetails, playerDetailsExist = playerCache.FindPlayerByID(playerID)
		if !playerDetailsExist {
			panic(fmt.Sprintf("No such player details exist: %v", playerID))
		}
		details.HomeTeamReboundsLeaderID = playerID
		details.HomeTeamReboundsLeaderName = composeFullName(
			playerDetails.FirstName,
			playerDetails.LastName)
		details.HomeTeamReboundsLeaderJerseyNumber = playerDetails.JerseyNumber
	}

	details.AwayTeamName = awayTeam.FullName
	details.AwayTeamCity = awayTeam.City
	details.AwayTeamSplashURL = teamSplashPictureURL(awayTeam.ID)
	details.AwayTeamSplashPrimaryColor = awayTeamPrimaryColor
	details.AwayTeamSplashSecondaryColor = awayTeamSecondaryColor
	if boxScoreExists && len(boxScore.Stats.AwayTeamStats.Leaders.PointsLeader.Players) > 0 {
		playerID = boxScore.Stats.AwayTeamStats.Leaders.PointsLeader.Players[0].ID
		playerDetails, playerDetailsExist = playerCache.FindPlayerByID(playerID)
		if !playerDetailsExist {
			panic(fmt.Sprintf("No such player details exist: %v", playerID))
		}
		details.AwayTeamPointsLeaderID = playerID
		details.AwayTeamPointsLeaderName = composeFullName(
			playerDetails.FirstName,
			playerDetails.LastName)
		details.AwayTeamPointsLeaderJerseyNumber = playerDetails.JerseyNumber
	}
	if boxScoreExists && len(boxScore.Stats.AwayTeamStats.Leaders.AssistsLeader.Players) > 0 {
		playerID = boxScore.Stats.AwayTeamStats.Leaders.AssistsLeader.Players[0].ID
		playerDetails, playerDetailsExist = playerCache.FindPlayerByID(playerID)
		if !playerDetailsExist {
			panic(fmt.Sprintf("No such player details exist: %v", playerID))
		}
		details.AwayTeamAssistsLeaderID = playerID
		details.AwayTeamAssistsLeaderName = composeFullName(
			playerDetails.FirstName,
			playerDetails.LastName)
		details.AwayTeamAssistsLeaderJerseyNumber = playerDetails.JerseyNumber
	}
	if boxScoreExists && len(boxScore.Stats.AwayTeamStats.Leaders.ReboundsLeader.Players) > 0 {
		playerID = boxScore.Stats.AwayTeamStats.Leaders.ReboundsLeader.Players[0].ID
		playerDetails, playerDetailsExist = playerCache.FindPlayerByID(playerID)
		if !playerDetailsExist {
			panic(fmt.Sprintf("No such player details exist: %v", playerID))
		}
		details.AwayTeamReboundsLeaderID = playerID
		details.AwayTeamReboundsLeaderName = composeFullName(
			playerDetails.FirstName,
			playerDetails.LastName)
		details.AwayTeamReboundsLeaderJerseyNumber = playerDetails.JerseyNumber
	}

	return details
}