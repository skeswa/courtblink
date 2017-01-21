package model

import nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"

// PlayerCache is a cache for current NBA players.
type PlayerCache map[string]nbaDTOs.NBAPlayerDetails

// FindPlayerByID finds a player by the given id.
func (cache *PlayerCache) FindPlayerByID(
	playerID string,
) (nbaDTOs.NBAPlayerDetails, bool) {
	player, exists := (*cache)[playerID]
	return player, exists
}

// BuildPlayerCache takes the all players DTO and turns it into a map that
// references players by their IDs.
func BuildPlayerCache(allPlayers *nbaDTOs.NBAAllPlayers) *PlayerCache {
	cache := PlayerCache(make(map[string]nbaDTOs.NBAPlayerDetails))

	for _, player := range allPlayers.LeaguePlayers.Players {
		cache[player.ID] = player
	}

	return &cache
}
