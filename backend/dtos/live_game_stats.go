package dtos

// LiveGameStats contains game data that is likely to change over time.
//
// easyjson:json
type LiveGameStats struct {
	Period        int    `json:"1"`
	Channel       string `json:"2"`
	TimeRemaining string `json:"3"`
}
