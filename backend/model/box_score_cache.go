package model

import nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"

// BoxScoreCache is a cache for stats on recent and ongoing NBA games.
type BoxScoreCache struct {
	gameIDToBoxScore map[string]nbaDTOs.NBABoxScore
}

// Update refreshes the box score cache.
func (cache *BoxScoreCache) Update(boxScores []nbaDTOs.NBABoxScore) {
	gameIDToBoxScore := make(map[string]nbaDTOs.NBABoxScore)

	for _, boxScore := range boxScores {
		gameIDToBoxScore[boxScore.Game.ID] = boxScore
	}

	cache.gameIDToBoxScore = gameIDToBoxScore
}

// FindBoxScoreByGameID finds a box score by the given game id.
func (cache *BoxScoreCache) FindBoxScoreByGameID(
	gameID string,
) (nbaDTOs.NBABoxScore, bool) {
	boxScore, exists := cache.gameIDToBoxScore[gameID]
	return boxScore, exists
}

// BuildBoxScoreCache takes the all box score DTOs and turns them into a map
// that references box scores by their game IDs.
func BuildBoxScoreCache(boxScores []nbaDTOs.NBABoxScore) *BoxScoreCache {
	gameIDToBoxScore := make(map[string]nbaDTOs.NBABoxScore)

	for _, boxScore := range boxScores {
		gameIDToBoxScore[boxScore.Game.ID] = boxScore
	}

	return &BoxScoreCache{gameIDToBoxScore: gameIDToBoxScore}
}
