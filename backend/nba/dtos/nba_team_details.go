package dtos

// NBAAllTeams represents a team collection object from the NBA API.
//
// easyjson:json
type NBAAllTeams struct {
	LeagueTeams NBALeagueTeams `json:"league"`
}

// NBALeagueTeams represents a team collection object from the NBA API.
//
// easyjson:json
type NBALeagueTeams struct {
	Teams []NBATeamDetails `json:"standard"`
}

// NBATeamDetails represents a scoreboard team detials object from the NBA API.
//
// easyjson:json
type NBATeamDetails struct {
	ID             string `json:"teamId"`
	City           string `json:"city"`
	TriCode        string `json:"tricode"`
	FullName       string `json:"fullName"`
	Nickname       string `json:"nickname"`
	Division       string `json:"divName"`
	Conference     string `json:"confName"`
	AltCityName    string `json:"altCityName"`
	IsNBAFranchise bool   `json:"isNBAFranchise"`
}
