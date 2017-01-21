package model

import (
	"fmt"

	"github.com/skeswa/enbiyay/backend/dtos"
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

	fmt.Println("NewStore", teams, players)

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

// GetSplashData gets the latest splash data.
func (s *Store) GetSplashData() dtos.SplashData {
	if len(s.latestScoreboard.Games) <= 0 {
		return dtos.SplashData{}
	}

	var (
		gameSummaries    []dtos.GameSummary
		firstGameDetails = convertNBAGameToGameDetails(
			s.latestScoreboard.Games[0],
			s.teamCache,
			s.playerCache,
			s.boxScoreCache,
			s.teamColorCache)
	)

	for _, game := range s.latestScoreboard.Games {
		gameSummaries = append(gameSummaries, convertNBAGameToGameSummary(game))
	}

	return dtos.SplashData{
		FirstGameDetails: &firstGameDetails,
		Games:            gameSummaries,
	}
}
