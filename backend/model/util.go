package model

import (
	"fmt"
	"strconv"
)

import nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"

const (
	channelTNT        = "TNT"
	channelLocal      = "Local"
	channelLeaguePass = "League Pass"

	fullNameTemplate         = "%s %s"
	splashPictureURLTemplate = "http://i.cdn.turner.com/nba/nba/assets/teams/spotlight/%s.jpg"
)

// Wrapper for strconv.Atoi(...) that panics instead of returning an error.
func confidentAtoi(a string) int {
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

// teamSplashPictureURL gets the splash picture URL for a game.
func teamSplashPictureURL(game nbaDTOs.NBAGame) string {
	return fmt.Sprintf(splashPictureURLTemplate, game.ID)
}

// composeFullName concatenates a first name with a last name.
func composeFullName(firstName, lastName string) string {
	return fmt.Sprintf(fullNameTemplate, firstName, lastName)
}
