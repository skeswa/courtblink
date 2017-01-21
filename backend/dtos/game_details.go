package dtos

// GameDetails contains the details of a game. This information is used to
// render the splash for a specific game.
//
// easyjson:json
type GameDetails struct {
	HomeTeamName                       string `json:"1.1"`
	HomeTeamCity                       string `json:"1.2"`
	HomeTeamSplashURL                  string `json:"1.3"`
	HomeTeamSplashColor                string `json:"1.4"`
	HomeTeamPointsLeaderID             string `json:"1.5.1"`
	HomeTeamPointsLeaderName           string `json:"1.5.2"`
	HomeTeamPointsLeaderJerseyNumber   string `json:"1.5.3"`
	HomeTeamAssistsLeaderID            string `json:"1.6.1"`
	HomeTeamAssistsLeaderName          string `json:"1.6.2"`
	HomeTeamAssistsLeaderJerseyNumber  string `json:"1.6.3"`
	HomeTeamReboundsLeaderID           string `json:"1.7.1"`
	HomeTeamReboundsLeaderName         string `json:"1.7.2"`
	HomeTeamReboundsLeaderJerseyNumber string `json:"1.7.3"`

	AwayTeamName                       string `json:"2.1"`
	AwayTeamCity                       string `json:"2.2"`
	AwayTeamSplashURL                  string `json:"2.3"`
	AwayTeamSplashColor                string `json:"2.4"`
	AwayTeamPointsLeaderID             string `json:"2.5.1"`
	AwayTeamPointsLeaderName           string `json:"2.5.2"`
	AwayTeamPointsLeaderJerseyNumber   string `json:"2.5.3"`
	AwayTeamAssistsLeaderID            string `json:"2.6.1"`
	AwayTeamAssistsLeaderName          string `json:"2.6.2"`
	AwayTeamAssistsLeaderJerseyNumber  string `json:"2.6.3"`
	AwayTeamReboundsLeaderID           string `json:"2.7.1"`
	AwayTeamReboundsLeaderName         string `json:"2.7.2"`
	AwayTeamReboundsLeaderJerseyNumber string `json:"2.7.3"`
}
