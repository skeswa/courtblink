package dtos

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

const (
	scoreboardDateFormat          = "20060102"
	scoreboardAPIEndpointTemplate = "http://data.nba.net/data/10s/prod/v1/%s/scoreboard.json"
)

// NBAScoreboard represents a scoreboard object from the NBA API.
//
// easyjson:json
type NBAScoreboard struct {
	Games []NBAScoreboardGame `json:"games"`
}

// NBAScoreboardGame represents a scoreboard game object from the NBA API.
//
// easyjson:json
type NBAScoreboardGame struct {
	StartTime      string                     `json:"startTimeUTC"`
	IsStartTimeTBD bool                       `json:"isStartTimeTBD"`
	Duration       NBAScoreboardDuration      `json:"gameDuration"`
	Period         NBAScoreboardPeriod        `json:"period"`
	HomeTeam       NBAScoreboardTeam          `json:"hTeam"`
	AwayTeam       NBAScoreboardTeam          `json:"vTeam"`
	VideoMetadata  NBAScoreboardVideoMetadata `json:"watch"`
}

// NBAScoreboardVideoMetadata represents a scoreboard video metadata object from
// the NBA API.
//
// easyjson:json
type NBAScoreboardVideoMetadata struct {
	Broadcast NBAScoreboardBroadcast `json:"broadcast"`
}

// NBAScoreboardBroadcast represents a scoreboard broadcasters object from the
// NBA API.
//
// easyjson:json
type NBAScoreboardBroadcast struct {
	Broadcasters NBAScoreboardBroadcasters `json:"broadcasters"`
	Details      NBAScoreboardVideoDetails `json:"video"`
}

// NBAScoreboardBroadcasters represents a scoreboard broadcasters object from
// the NBA API.
//
// easyjson:json
type NBAScoreboardBroadcasters struct {
	National  []NBAScoreboardBroadcaster `json:"national"`
	Canadian  []NBAScoreboardBroadcaster `json:"canadian"`
	LocalHome []NBAScoreboardBroadcaster `json:"hTeam"`
	LocalAway []NBAScoreboardBroadcaster `json:"vTeam"`
}

// NBAScoreboardVideoDetails represents a scoreboard video details object from
// the NBA API.
//
// easyjson:json
type NBAScoreboardVideoDetails struct {
	CanPurchase    bool                    `json:"canPurchase"`
	IsOnLeaguePass bool                    `json:"isLeaguePass"`
	IsOnTNT        bool                    `json:"isTNTOT"`
	Streams        []NBAScoreboardStream   `json:"streams"`
	DeepLinks      []NBAScoreboardDeepLink `json:"deepLink"`
}

// NBAScoreboardStream represents a scoreboard stream object from the NBA API.
//
// easyjson:json
type NBAScoreboardStream struct {
	ID               string `json:"streamId"`
	Type             string `json:"streamType"`
	IsOnAir          bool   `json:"isOnAir"`
	Duration         int    `json:"duration"`
	ArchiveAvailable bool   `json:"isArchiveAvailToWatch"`
}

// NBAScoreboardDeepLink represents a scoreboard deep link object from the NBA
// API.
//
// easyjson:json
type NBAScoreboardDeepLink struct {
	IOS         string `json:"iosApp"`
	Mobile      string `json:"mobileApp"`
	Android     string `json:"androidApp"`
	Desktop     string `json:"desktopWeb"`
	Broadcaster string `json:"broadcaster"`
}

// NBAScoreboardPeriod represents a scoreboard period object from the NBA API.
//
// easyjson:json
type NBAScoreboardPeriod struct {
	Type          int  `json:"type"`
	Current       int  `json:"current"`
	MaxRegular    int  `json:"maxRegular"`
	IsHalftime    bool `json:"isHalftime"`
	IsEndOfPeriod bool `json:"isEndOfPeriod"`
}

// NBAScoreboardDuration represents a scoreboard durarion object from the
// NBA API.
//
// easyjson:json
type NBAScoreboardDuration struct {
	Hours  string `json:"hours"`
	Minute string `json:"minute"`
}

// NBAScoreboardTeam represents a scoreboard team object from the NBA API.
//
// easyjson:json
type NBAScoreboardTeam struct {
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

// NBAScoreboardBroadcaster represents a scoreboard broadcaster object from the
// NBA API.
//
// easyjson:json
type NBAScoreboardBroadcaster struct {
	LongName  string `json:"longName"`
	ShortName string `json:"shortName"`
}

// FetchNBAScoreboard uses the NBA API to fetch the scoreboard for the provided
// date.
func FetchNBAScoreboard(date time.Time) (NBAScoreboard, error) {
	var (
		err        error
		body       []byte
		resp       *http.Response
		scoreboard NBAScoreboard
	)

	if resp, err = http.Get(fmt.Sprintf(
		scoreboardAPIEndpointTemplate,
		date.Format(scoreboardDateFormat))); err != nil {
		return scoreboard, fmt.Errorf(
			"Failed to download the scoreboard from NBA.com: %v",
			err)
	}

	defer resp.Body.Close()
	body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return scoreboard, fmt.Errorf(
			"Failed to parse the scoreboard downloaded from NBA.com: %v",
			err)
	}

	if err = scoreboard.UnmarshalJSON(body); err != nil {
		return scoreboard, fmt.Errorf(
			"Failed to unmarshal the scoreboard downloaded from NBA.com: %v",
			err)
	}

	return scoreboard, nil
}
