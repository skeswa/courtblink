package dtos

// GameLeader contains information about a player leading in a statistical
// category.
//
// easyjson:json
type GameLeader struct {
	ID           string `json:"1"`
	Name         string `json:"2"`
	Minutes      string `json:"3"`
	StatValue    string `json:"4"`
	JerseyNumber string `json:"5"`
}
