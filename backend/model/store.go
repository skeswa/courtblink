package model

import (
	"fmt"

	nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"
)

// Store encapsulates all data that will be eventually served to the frontend.
type Store struct {
	teamCache        *TeamCache
	playerCache      *PlayerCache
	boxScoreCache    *BoxScoreCache
	teamColorCache   *TeamColorCache
	latestScoreboard *nbaDTOs.NBAScoreboard
}

// NewStore creates a new Store.
func NewStore() (*Store, error) {
	teams, players, teamColors, scoreboard, boxScores, err := fetchInitialStoreData()
	if err != nil {
		return nil, fmt.Errorf("Failed to create a new store: %v", err)
	}

	var (
		teamCache      = BuildTeamCache(teams)
		playerCache    = BuildPlayerCache(players)
		boxScoreCache  = BuildBoxScoreCache(boxScores)
		teamColorCache = BuildTeamColorCache(teamCache, teamColors)
	)

	return &Store{
		teamCache:        teamCache,
		playerCache:      playerCache,
		boxScoreCache:    boxScoreCache,
		teamColorCache:   teamColorCache,
		latestScoreboard: scoreboard,
	}, nil
}
