package dtos

// GameSummary is the summary of a game. Has just enough information to render
// the game card.
//
// easyjson:json
type GameSummary struct {
	ID               string        `json:"1.1"`
	LiveGameStats    LiveGameStats `json:"1.2"`
	GameStartTime    int           `json:"1.3"`
	GameStartTimeTBD bool          `json:"1.4"`
	Finished         bool          `json:"1.5"`

	HomeTeamWins    int    `json:"2.1"`
	HomeTeamScore   int    `json:"2.2"`
	HomeTeamLosses  int    `json:"2.3"`
	HomeTeamTeamID  string `json:"2.4"`
	HomeTeamTriCode string `json:"2.5"`

	AwayTeamWins    int    `json:"3.1"`
	AwayTeamScore   int    `json:"3.2"`
	AwayTeamLosses  int    `json:"3.3"`
	AwayTeamTeamID  string `json:"3.4"`
	AwayTeamTriCode string `json:"3.5"`
}
