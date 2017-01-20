package dtos

// GameDetails contains the details of a game. This information is used to
// render the splash for a specific game.
//
// easyjson:json
type GameDetails struct {
	HomeTeamName                      string `json:"2.1"`
	HomeTeamCity                      string `json:"2.2"`
	HomeTeamSplashURL                 string `json:"2.3"`
	HomeTeamPointsLeaderID            string `json:"2.4.1"`
	HomeTeamPointsLeaderName          string `json:"2.4.2"`
	HomeTeamPointsLeaderMinutes       string `json:"2.4.3"`
	HomeTeamPointsLeaderJerseyName    string `json:"2.4.4"`
	HomeTeamAssistsLeaderID           string `json:"2.5.1"`
	HomeTeamAssistsLeaderName         string `json:"2.5.2"`
	HomeTeamAssistsLeaderMinutes      string `json:"2.5.3"`
	HomeTeamAssistsLeaderJerseyNumber string `json:"2.5.4"`
	HomeTeamReboundsLeaderID          string `json:"2.6.1"`
	HomeTeamReboundsLeaderName        string `json:"2.6.2"`
	HomeTeamReboundsLeaderMinutes     string `json:"2.6.3"`
	HomeTeamReboundsLeaderJerseyName  string `json:"2.6.4"`
	HomeTeamBlocksLeaderID            string `json:"2.7.1"`
	HomeTeamBlocksLeaderName          string `json:"2.7.2"`
	HomeTeamBlocksLeaderMinutes       string `json:"2.7.3"`
	HomeTeamBlocksLeaderJerseyName    string `json:"2.7.4"`
	HomeTeamStealsLeaderID            string `json:"2.8.1"`
	HomeTeamStealsLeaderName          string `json:"2.8.2"`
	HomeTeamStealsLeaderMinutes       string `json:"2.8.3"`
	HomeTeamStealsLeaderJerseyName    string `json:"2.8.4"`

	AwayTeamName                      string `json:"3.1"`
	AwayTeamCity                      string `json:"3.2"`
	AwayTeamSplashURL                 string `json:"3.3"`
	AwayTeamPointsLeaderID            string `json:"3.4.1"`
	AwayTeamPointsLeaderName          string `json:"3.4.2"`
	AwayTeamPointsLeaderMinutes       string `json:"3.4.3"`
	AwayTeamPointsLeaderJerseyName    string `json:"3.4.4"`
	AwayTeamAssistsLeaderID           string `json:"3.5.1"`
	AwayTeamAssistsLeaderName         string `json:"3.5.2"`
	AwayTeamAssistsLeaderMinutes      string `json:"3.5.3"`
	AwayTeamAssistsLeaderJerseyNumber string `json:"3.5.4"`
	AwayTeamReboundsLeaderID          string `json:"3.6.1"`
	AwayTeamReboundsLeaderName        string `json:"3.6.2"`
	AwayTeamReboundsLeaderMinutes     string `json:"3.6.3"`
	AwayTeamReboundsLeaderJerseyName  string `json:"3.6.4"`
	AwayTeamBlocksLeaderID            string `json:"3.7.1"`
	AwayTeamBlocksLeaderName          string `json:"3.7.2"`
	AwayTeamBlocksLeaderMinutes       string `json:"3.7.3"`
	AwayTeamBlocksLeaderJerseyName    string `json:"3.7.4"`
	AwayTeamStealsLeaderID            string `json:"3.8.1"`
	AwayTeamStealsLeaderName          string `json:"3.8.2"`
	AwayTeamStealsLeaderMinutes       string `json:"3.8.3"`
	AwayTeamStealsLeaderJerseyName    string `json:"3.8.4"`
}
