package dtos

// NBAAllPlayers represents a player collection object from the NBA API.
//
// easyjson:json
type NBAAllPlayers struct {
	LeaguePlayers NBALeaguePlayers `json:"league"`
}

// NBALeaguePlayers represents a player collection object from the NBA API.
//
// easyjson:json
type NBALeaguePlayers struct {
	Players []NBAPlayerDetails `json:"standard"`
}

// NBAPlayerDetails represents a player collection object from the NBA API.
//
// easyjson:json
type NBAPlayerDetails struct {
	FirstName    string                `json:"firstName"`
	LastName     string                `json:"lastName"`
	ID           string                `json:"personId"`
	TeamID       string                `json:"teamId"`
	JerseyNumber string                `json:"jersey"`
	Position     string                `json:"pos"`
	HeightFeet   string                `json:"heightFeet"`
	HeightInches string                `json:"heightInches"`
	Weight       string                `json:"weightPounds"`
	DebutYear    string                `json:"nbaDebutYear"`
	YearsPro     string                `json:"yearsPro"`
	CollegeName  string                `json:"collegeName"`
	Country      string                `json:"country"`
	DraftDetails NBAPlayerDraftDetails `json:"draft"`
}

type NBAPlayerDraftDetails struct {
	TeamID      string `json:"teamId"`
	PickNumber  string `json:"pickNum"`
	RoundNumber string `json:"roundNum"`
	Year        string `json:"seasonYear"`
}
