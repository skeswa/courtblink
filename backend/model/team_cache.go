package model

import nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"

// TeamCache is a cache for current NBA teams.
type TeamCache struct {
	idToTeam   map[string]nbaDTOs.NBATeamDetails
	nameToTeam map[string]nbaDTOs.NBATeamDetails
}

// FindTeamByID finds a team by the given id.
func (cache TeamCache) FindTeamByID(
	teamID string,
) (nbaDTOs.NBATeamDetails, bool) {
	team, exists := cache.idToTeam[teamID]
	return team, exists
}

// FindTeamByName finds a team by the given full name.
func (cache TeamCache) FindTeamByName(
	teamName string,
) (nbaDTOs.NBATeamDetails, bool) {
	team, exists := cache.nameToTeam[teamName]
	return team, exists
}

// BuildTeamCache takes the all players DTO and turns it into a map that
// references players by their IDs.
func BuildTeamCache(allTeams nbaDTOs.NBAAllTeams) TeamCache {
	var (
		idToTeam   = make(map[string]nbaDTOs.NBATeamDetails)
		nameToTeam = make(map[string]nbaDTOs.NBATeamDetails)
	)

	for _, team := range allTeams.LeagueTeams.Teams {
		idToTeam[team.ID] = team
		nameToTeam[team.FullName] = team
	}

	return TeamCache{idToTeam: idToTeam, nameToTeam: nameToTeam}
}
