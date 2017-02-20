package dtos

// GameTeamStatus is the status of a team in a game.
//
// easyjson:json
type GameTeamStatus struct {
	Wins                 int        `json:"1"`
	Score                int        `json:"2"`
	Losses               int        `json:"3"`
	TeamID               string     `json:"4"`
	TriCode              string     `json:"5"`
	Name                 string     `json:"6"`
	City                 string     `json:"7"`
	SplashURL            string     `json:"8"`
	SplashPrimaryColor   string     `json:"9"`
	SplashSecondaryColor string     `json:"10"`
	PointsLeader         GameLeader `json:"11"`
	AssistsLeader        GameLeader `json:"12"`
	ReboundsLeader       GameLeader `json:"13"`
}
