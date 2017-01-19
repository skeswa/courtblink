package dtos

// NBAScoreboard represents a scoreboard object from the NBA API.
//
// easyjson:json
type NBAScoreboard struct {
	Games []NBAGame `json:"games"`
}
