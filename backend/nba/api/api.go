package api

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/skeswa/enbiyay/backend/nba/dtos"
)

const (
	apiDateFormat                 = "20060102"
	teamsAPIEndpoint              = "http://data.nba.net/data/10s/prod/v1/2016/teams.json"
	playersAPIEndpoint            = "http://data.nba.net/data/10s/prod/v1/2016/players.json"
	boxScoreAPIEndpointTemplate   = "http://data.nba.net/data/10s/prod/v1/%s/%s_boxscore.json"
	scoreboardAPIEndpointTemplate = "http://data.nba.net/data/10s/prod/v1/%s/scoreboard.json"
)

// FetchNBATeams uses the NBA API to fetch the list of all NBA teams.
func FetchNBATeams() (dtos.NBAAllTeams, error) {
	var (
		err      error
		body     []byte
		resp     *http.Response
		allTeams dtos.NBAAllTeams
	)

	if resp, err = http.Get(playersAPIEndpoint); err != nil {
		return allTeams, fmt.Errorf(
			"Failed to download the all players from NBA.com: %v",
			err)
	}

	defer resp.Body.Close()
	body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return allTeams, fmt.Errorf(
			"Failed to parse the all players downloaded from NBA.com: %v",
			err)
	}

	if err = allTeams.UnmarshalJSON(body); err != nil {
		return allTeams, fmt.Errorf(
			"Failed to unmarshal the all players downloaded from NBA.com: %v",
			err)
	}

	return allTeams, nil
}

// FetchNBAPlayers uses the NBA API to fetch the list of all NBA players.
func FetchNBAPlayers() (dtos.NBAAllPlayers, error) {
	var (
		err        error
		body       []byte
		resp       *http.Response
		allPlayers dtos.NBAAllPlayers
	)

	if resp, err = http.Get(playersAPIEndpoint); err != nil {
		return allPlayers, fmt.Errorf(
			"Failed to download the all players from NBA.com: %v",
			err)
	}

	defer resp.Body.Close()
	body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return allPlayers, fmt.Errorf(
			"Failed to parse the all players downloaded from NBA.com: %v",
			err)
	}

	if err = allPlayers.UnmarshalJSON(body); err != nil {
		return allPlayers, fmt.Errorf(
			"Failed to unmarshal the all players downloaded from NBA.com: %v",
			err)
	}

	return allPlayers, nil
}

// FetchNBAScoreboard uses the NBA API to fetch the scoreboard for the provided
// date.
func FetchNBAScoreboard(date time.Time) (dtos.NBAScoreboard, error) {
	var (
		err        error
		body       []byte
		resp       *http.Response
		scoreboard dtos.NBAScoreboard
	)

	if resp, err = http.Get(fmt.Sprintf(
		scoreboardAPIEndpointTemplate,
		date.Format(apiDateFormat))); err != nil {
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

// FetchNBABoxScore uses the NBA API to fetch the box score for the provided
// game and the date on which it took place.
func FetchNBABoxScore(date time.Time, gameID string) (dtos.NBABoxScore, error) {
	var (
		err      error
		body     []byte
		resp     *http.Response
		boxScore dtos.NBABoxScore
	)

	if resp, err = http.Get(fmt.Sprintf(
		boxScoreAPIEndpointTemplate,
		date.Format(apiDateFormat),
		gameID)); err != nil {
		return boxScore, fmt.Errorf(
			"Failed to download the box score from NBA.com: %v",
			err)
	}

	defer resp.Body.Close()
	body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return boxScore, fmt.Errorf(
			"Failed to parse the box score downloaded from NBA.com: %v",
			err)
	}

	if err = boxScore.UnmarshalJSON(body); err != nil {
		return boxScore, fmt.Errorf(
			"Failed to unmarshal the box score downloaded from NBA.com: %v",
			err)
	}

	return boxScore, nil
}
