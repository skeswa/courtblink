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
	NotStarted       bool          `json:"1.6"`

	HomeTeamWins                 int        `json:"2.1"`
	HomeTeamScore                int        `json:"2.2"`
	HomeTeamLosses               int        `json:"2.3"`
	HomeTeamTeamID               string     `json:"2.4"`
	HomeTeamTriCode              string     `json:"2.5"`
	HomeTeamName                 string     `json:"2.6"`
	HomeTeamCity                 string     `json:"2.7"`
	HomeTeamSplashURL            string     `json:"2.8"`
	HomeTeamSplashPrimaryColor   string     `json:"2.9"`
	HomeTeamSplashSecondaryColor string     `json:"2.10"`
	HomeTeamPointsLeader         GameLeader `json:"2.11"`
	HomeTeamAssistsLeader        GameLeader `json:"2.12"`
	HomeTeamReboundsLeader       GameLeader `json:"2.13"`

	AwayTeamWins                 int        `json:"3.1"`
	AwayTeamScore                int        `json:"3.2"`
	AwayTeamLosses               int        `json:"3.3"`
	AwayTeamTeamID               string     `json:"3.4"`
	AwayTeamTriCode              string     `json:"3.5"`
	AwayTeamName                 string     `json:"3.6"`
	AwayTeamCity                 string     `json:"3.7"`
	AwayTeamSplashURL            string     `json:"3.8"`
	AwayTeamSplashPrimaryColor   string     `json:"3.9"`
	AwayTeamSplashSecondaryColor string     `json:"3.10"`
	AwayTeamPointsLeader         GameLeader `json:"3.11"`
	AwayTeamAssistsLeader        GameLeader `json:"3.12"`
	AwayTeamReboundsLeader       GameLeader `json:"3.13"`
}
