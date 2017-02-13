package dtos

// SplashData is the data required for the splash page to render correctly.
//
// easyjson:json
type SplashData struct {
	Games []GameSummary `json:"1"`
}
