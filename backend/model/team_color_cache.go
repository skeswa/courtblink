package model

import colorDTOs "github.com/skeswa/enbiyay/backend/colors/dtos"

const nbaTeamColorLeague = "nba"

// TeamColorCache is a cache for current NBA team colors.
type TeamColorCache map[string]colorDTOs.TeamColorDetails

// FindTeamColorsByTeamID finds team colors by the given id.
func (cache *TeamColorCache) FindTeamColorsByTeamID(
	teamID string,
) (colorDTOs.TeamColorDetails, bool) {
	colors, exists := (*cache)[teamID]
	return colors, exists
}

// BuildTeamColorCache takes the all team colors DTO and turns it into a map
// that references team colors by their team IDs.
func BuildTeamColorCache(
	teamCache *TeamCache,
	allTeamColors *colorDTOs.AllTeamColorDetails,
) *TeamColorCache {
	cache := TeamColorCache(make(map[string]colorDTOs.TeamColorDetails))

	for _, teamColorDetails := range allTeamColors.TeamColors {
		if teamColorDetails.League == nbaTeamColorLeague {
			if team, exists := teamCache.FindTeamByName(teamColorDetails.Name); exists {
				cache[team.ID] = teamColorDetails
			}
		}
	}

	return &cache
}
