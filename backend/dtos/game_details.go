package dtos

// GameDetails contains the details of a game. This information is used to
// render the splash for a specific game.
//
// easyjson:json
type GameDetails struct {
	HomeTeamName                 string     `json:"1.1"`
	HomeTeamCity                 string     `json:"1.2"`
	HomeTeamSplashURL            string     `json:"1.3"`
	HomeTeamSplashPrimaryColor   string     `json:"1.4.1"`
	HomeTeamSplashSecondaryColor string     `json:"1.4.2"`
	HomeTeamPointsLeader         GameLeader `json:"1.5"`
	HomeTeamAssistsLeader        GameLeader `json:"1.6"`
	HomeTeamReboundsLeader       GameLeader `json:"1.7"`
	HomeTeamStealsLeader         GameLeader `json:"1.8"`
	HomeTeamBlocksLeader         GameLeader `json:"1.9"`

	AwayTeamName                 string     `json:"2.1"`
	AwayTeamCity                 string     `json:"2.2"`
	AwayTeamSplashURL            string     `json:"2.3"`
	AwayTeamSplashPrimaryColor   string     `json:"2.4.1"`
	AwayTeamSplashSecondaryColor string     `json:"2.4.2"`
	AwayTeamPointsLeader         GameLeader `json:"2.5"`
	AwayTeamAssistsLeader        GameLeader `json:"2.6"`
	AwayTeamReboundsLeader       GameLeader `json:"2.7"`
	AwayTeamStealsLeader         GameLeader `json:"2.8"`
	AwayTeamBlocksLeader         GameLeader `json:"2.9"`
}
