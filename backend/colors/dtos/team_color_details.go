package dtos

// AllTeamColorDetails contains the color information for all sports team.
//
// easyjson:json
type AllTeamColorDetails struct {
	TeamColors []TeamColorDetails `json:"teamColors"`
}

// TeamColorDetails contains the color information for a sports team.
//
// easyjson:json
type TeamColorDetails struct {
	Name   string `json:"name"`
	League string `json:"league"`
	Colors struct {
		Hex []string `json:"hex"`
	} `json:"colors"`
}
