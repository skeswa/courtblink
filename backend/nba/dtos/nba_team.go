package dtos

// NBATeam represents a scoreboard team object from the NBA API.
//
// easyjson:json
type NBATeam struct {
	ID           string `json:"teamId"`
	Win          string `json:"win"`
	Loss         string `json:"loss"`
	Score        string `json:"score"`
	Tricode      string `json:"triCode"`
	SeriesWin    string `json:"seriesWin"`
	SeriesLoss   string `json:"seriesLoss"`
	PeriodScores []struct {
		Score string `json:"score"`
	} `json:"linescore"`
}
