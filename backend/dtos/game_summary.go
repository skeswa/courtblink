package dtos

// GameSummary is the summary of a game. Has just enough information to render
// the game card.
//
// easyjson:json
type GameSummary struct {
	ID               string         `json:"1"`
	LiveGameStats    LiveGameStats  `json:"2"`
	GameStartTime    int            `json:"3"`
	GameStartTimeTBD bool           `json:"4"`
	Finished         bool           `json:"5"`
	NotStarted       bool           `json:"6"`
	HomeTeamStatus   GameTeamStatus `json:"7"`
	AwayTeamStatus   GameTeamStatus `json:"8"`
}
