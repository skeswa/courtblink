package model

import (
	"fmt"
	"time"

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
func convertNBAGameToGameSummary(
	game nbaDTOs.NBAGame,
	teamCache *TeamCache,
	playerCache *PlayerCache,
	boxScoreCache *BoxScoreCache,
	teamColorCache *TeamColorCache,
) (dtos.GameSummary, error) {
	var (
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
		startTimeTBD = game.IsStartTimeTBD
	)

	if !homeTeamExists {
		return dtos.GameSummary{},
			fmt.Errorf("no such home team exists for team %v", game.HomeTeam.ID)
	}
	if !awayTeamExists {
		return dtos.GameSummary{},
			fmt.Errorf("no such away team exists for team %v", game.AwayTeam.ID)
	}
	if !homeTeamColorsExist {
		return dtos.GameSummary{},
			fmt.Errorf("no such home team colors exist for team %v", game.HomeTeam.ID)
	}
	if !awayTeamColorsExist {
		return dtos.GameSummary{},
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
		_,
		_ = extractStatLeaders(
			homeTeam.ID,
			boxScore.Stats.ActivePlayers,
			playerCache)

		awayTeamPointsLeader,
		awayTeamAssistsLeader,
		awayTeamReboundsLeader,
		_,
		_ = extractStatLeaders(
			awayTeam.ID,
			boxScore.Stats.ActivePlayers,
			playerCache)

		startTime, err = time.Parse(time.RFC3339, game.StartTime)
	)

	if err != nil && !startTimeTBD {
		startTimeTBD = true
	}

	return dtos.GameSummary{
		ID: game.ID,
		LiveGameStats: dtos.LiveGameStats{
			Period:        game.Period.Current,
			Channel:       extractBroadcastChannel(game),
			TimeRemaining: game.Clock,
		},
		GameStartTime:    int(startTime.Unix()),
		GameStartTimeTBD: startTimeTBD,
		Finished:         startTime.Before(time.Now()) && len(game.Clock) == 0 && game.Period.Current > 3,
		NotStarted:       startTime.After(time.Now()),

		HomeTeamWins:                 confidentAtoi(game.HomeTeam.Win),
		HomeTeamScore:                confidentAtoi(game.HomeTeam.Score),
		HomeTeamLosses:               confidentAtoi(game.HomeTeam.Loss),
		HomeTeamTeamID:               game.HomeTeam.ID,
		HomeTeamTriCode:              game.HomeTeam.Tricode,
		HomeTeamName:                 homeTeam.FullName,
		HomeTeamCity:                 homeTeam.City,
		HomeTeamSplashURL:            teamSplashPictureURL(homeTeam.ID),
		HomeTeamSplashPrimaryColor:   homeTeamPrimaryColor,
		HomeTeamSplashSecondaryColor: homeTeamSecondaryColor,
		HomeTeamPointsLeader:         homeTeamPointsLeader,
		HomeTeamAssistsLeader:        homeTeamAssistsLeader,
		HomeTeamReboundsLeader:       homeTeamReboundsLeader,

		AwayTeamWins:                 confidentAtoi(game.AwayTeam.Win),
		AwayTeamScore:                confidentAtoi(game.AwayTeam.Score),
		AwayTeamLosses:               confidentAtoi(game.AwayTeam.Loss),
		AwayTeamTeamID:               game.AwayTeam.ID,
		AwayTeamTriCode:              game.AwayTeam.Tricode,
		AwayTeamName:                 awayTeam.FullName,
		AwayTeamCity:                 awayTeam.City,
		AwayTeamSplashURL:            teamSplashPictureURL(awayTeam.ID),
		AwayTeamSplashPrimaryColor:   awayTeamPrimaryColor,
		AwayTeamSplashSecondaryColor: awayTeamSecondaryColor,
		AwayTeamPointsLeader:         awayTeamPointsLeader,
		AwayTeamAssistsLeader:        awayTeamAssistsLeader,
		AwayTeamReboundsLeader:       awayTeamReboundsLeader,
	}, nil
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
