package model

import (
	"fmt"

	"github.com/skeswa/enbiyay/backend/dtos"
	nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"
)

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

	details.HomeTeamName = homeTeam.FullName
	details.HomeTeamCity = homeTeam.City
	details.HomeTeamSplashURL = teamSplashPictureURL(game)
	details.HomeTeamSplashColor = homeTeamColors.Colors.Hex[0]
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
	details.AwayTeamSplashURL = teamSplashPictureURL(game)
	details.AwayTeamSplashColor = awayTeamColors.Colors.Hex[0]
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
