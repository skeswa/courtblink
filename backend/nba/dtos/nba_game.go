package dtos

// NBAGame represents a scoreboard game object from the NBA API.
//
// easyjson:json
type NBAGame struct {
	ID             string               `json:"gameId"`
	StartTime      string               `json:"startTimeUTC"`
	IsStartTimeTBD bool                 `json:"isStartTimeTBD"`
	Duration       NBAGameDuration      `json:"gameDuration"`
	Period         NBAGamePeriod        `json:"period"`
	HomeTeam       NBATeam              `json:"hTeam"`
	AwayTeam       NBATeam              `json:"vTeam"`
	VideoMetadata  NBAGameVideoMetadata `json:"watch"`
}

// NBAGameVideoMetadata represents a scoreboard video metadata object from
// the NBA API.
//
// easyjson:json
type NBAGameVideoMetadata struct {
	Broadcast NBAGameBroadcast `json:"broadcast"`
}

// NBAGameBroadcast represents a scoreboard broadcasters object from the
// NBA API.
//
// easyjson:json
type NBAGameBroadcast struct {
	Broadcasters NBAGameBroadcasters `json:"broadcasters"`
	Details      NBAGameVideoDetails `json:"video"`
}

// NBAGameBroadcasters represents a scoreboard broadcasters object from
// the NBA API.
//
// easyjson:json
type NBAGameBroadcasters struct {
	National  []NBAGameBroadcaster `json:"national"`
	Canadian  []NBAGameBroadcaster `json:"canadian"`
	LocalHome []NBAGameBroadcaster `json:"hTeam"`
	LocalAway []NBAGameBroadcaster `json:"vTeam"`
}

// NBAGameVideoDetails represents a scoreboard video details object from
// the NBA API.
//
// easyjson:json
type NBAGameVideoDetails struct {
	CanPurchase    bool              `json:"canPurchase"`
	IsOnLeaguePass bool              `json:"isLeaguePass"`
	IsOnTNT        bool              `json:"isTNTOT"`
	Streams        []NBAGameStream   `json:"streams"`
	DeepLinks      []NBAGameDeepLink `json:"deepLink"`
}

// NBAGameStream represents a scoreboard stream object from the NBA API.
//
// easyjson:json
type NBAGameStream struct {
	ID               string `json:"streamId"`
	Type             string `json:"streamType"`
	IsOnAir          bool   `json:"isOnAir"`
	Duration         int    `json:"duration"`
	ArchiveAvailable bool   `json:"isArchiveAvailToWatch"`
}

// NBAGameDeepLink represents a scoreboard deep link object from the NBA
// API.
//
// easyjson:json
type NBAGameDeepLink struct {
	IOS         string `json:"iosApp"`
	Mobile      string `json:"mobileApp"`
	Android     string `json:"androidApp"`
	Desktop     string `json:"desktopWeb"`
	Broadcaster string `json:"broadcaster"`
}

// NBAGamePeriod represents a scoreboard period object from the NBA API.
//
// easyjson:json
type NBAGamePeriod struct {
	Type          int  `json:"type"`
	Current       int  `json:"current"`
	MaxRegular    int  `json:"maxRegular"`
	IsHalftime    bool `json:"isHalftime"`
	IsEndOfPeriod bool `json:"isEndOfPeriod"`
}

// NBAGameDuration represents a scoreboard durarion object from the
// NBA API.
//
// easyjson:json
type NBAGameDuration struct {
	Hours  string `json:"hours"`
	Minute string `json:"minute"`
}

// NBAGameBroadcaster represents a scoreboard broadcaster object from the
// NBA API.
//
// easyjson:json
type NBAGameBroadcaster struct {
	LongName  string `json:"longName"`
	ShortName string `json:"shortName"`
}
