package model

import (
	"fmt"
	"math"
	"strconv"
	"strings"

	"github.com/skeswa/enbiyay/backend/dtos"
	nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"
)

const (
	channelTNT        = "TNT"
	channelLocal      = "Local"
	channelLeaguePass = "League Pass"

	hexColorTemplate         = "#%s"
	rgbColorTemplate         = "rgb(%s,%s,%s)"
	fullNameTemplate         = "%s %s"
	splashPictureURLTemplate = "http://i.cdn.turner.com/nba/nba/assets/teams/spotlight/%s.jpg"
)

// Wrapper for strconv.Atoi(...) that panics instead of returning an error.
func confidentAtoi(a string) int {
	if a == "" {
		return 0
	}

	if i, err := strconv.Atoi(a); err != nil {
		panic(fmt.Sprintf("Failed to turn an string into an integer: %v", err))
	} else {
		return i
	}
}

// extractBroadcastChannel gets the name of the broadcast channel for a game.
func extractBroadcastChannel(game nbaDTOs.NBAGame) string {
	switch {
	case len(game.VideoMetadata.Broadcast.Broadcasters.National) > 0:
		return game.VideoMetadata.Broadcast.Broadcasters.National[0].ShortName
	case game.VideoMetadata.Broadcast.Details.IsOnTNT:
		return channelTNT
	case game.VideoMetadata.Broadcast.Details.IsOnLeaguePass:
		return channelLeaguePass
	default:
		return channelLocal
	}
}

// teamSplashPictureURL gets the splash picture URL for a team by team id.
func teamSplashPictureURL(teamID string) string {
	return fmt.Sprintf(splashPictureURLTemplate, teamID)
}

// composeFullName concatenates a first name with a last name.
func composeFullName(firstName, lastName string) string {
	return fmt.Sprintf(fullNameTemplate, firstName, lastName)
}

// normalizeHexColor formats hex colors for browsers.
func normalizeHexColor(hexColor string) string {
	if hexColor[0] == '#' {
		return hexColor
	}
	return fmt.Sprintf(hexColorTemplate, hexColor)
}

// normalizeRGBColor formats rgb colors for browsers.
func normalizeRGBColor(rgbColor string) string {
	parts := strings.Split(strings.TrimSpace(rgbColor), " ")
	return fmt.Sprintf(rgbColorTemplate, parts[0], parts[1], parts[2])
}

// extractStatLeaders gets the statistical leaders of a game from the box score.
func extractStatLeaders(
	teamID string,
	playerStatLines []nbaDTOs.NBABoxScorePlayerStats,
	playerCache *PlayerCache,
) (
	pointsLeader dtos.GameLeader,
	assistsLeader dtos.GameLeader,
	reboundsLeader dtos.GameLeader,
	stealsLeader dtos.GameLeader,
	blocksLeader dtos.GameLeader,
) {
	if len(playerStatLines) < 1 {
		return
	}

	var (
		pointsLeaderSortKey   = math.MaxInt32
		assistsLeaderSortKey  = math.MaxInt32
		reboundsLeaderSortKey = math.MaxInt32
		stealsLeaderSortKey   = math.MaxInt32
		blocksLeaderSortKey   = math.MaxInt32
	)

	for _, playerStatLine := range playerStatLines {
		if playerStatLine.TeamID != teamID {
			continue
		}

		var (
			isPointsLeader   = playerStatLine.SortKey.Points < pointsLeaderSortKey
			isAssistsLeader  = playerStatLine.SortKey.Assists < assistsLeaderSortKey
			isReboundsLeader = playerStatLine.SortKey.TotalRebounds <
				reboundsLeaderSortKey
			isStealsLeader = playerStatLine.SortKey.Steals < stealsLeaderSortKey
			isBlocksLeader = playerStatLine.SortKey.Blocks < blocksLeaderSortKey
			isLeader       = isPointsLeader ||
				isAssistsLeader ||
				isReboundsLeader ||
				isStealsLeader ||
				isBlocksLeader
		)

		if !isLeader {
			continue
		}

		if isPointsLeader {
			pointsLeader = convertBoxScorePlayerStatsToGameLeader(
				playerStatLine,
				playerCache)
			pointsLeader.StatValue = playerStatLine.Points

			pointsLeaderSortKey = playerStatLine.SortKey.Points
		}
		if isAssistsLeader {
			assistsLeader = convertBoxScorePlayerStatsToGameLeader(
				playerStatLine,
				playerCache)
			assistsLeader.StatValue = playerStatLine.Assists

			assistsLeaderSortKey = playerStatLine.SortKey.Assists
		}
		if isReboundsLeader {
			reboundsLeader = convertBoxScorePlayerStatsToGameLeader(
				playerStatLine,
				playerCache)
			reboundsLeader.StatValue = playerStatLine.TotalRebounds

			reboundsLeaderSortKey = playerStatLine.SortKey.TotalRebounds
		}
		if isStealsLeader {
			stealsLeader = convertBoxScorePlayerStatsToGameLeader(
				playerStatLine,
				playerCache)
			stealsLeader.StatValue = playerStatLine.Steals

			stealsLeaderSortKey = playerStatLine.SortKey.Steals
		}
		if isBlocksLeader {
			blocksLeader = convertBoxScorePlayerStatsToGameLeader(
				playerStatLine,
				playerCache)
			blocksLeader.StatValue = playerStatLine.Blocks

			blocksLeaderSortKey = playerStatLine.SortKey.Blocks
		}
	}

	return
}
