package api

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/pkg/errors"
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

	if resp, err = http.Get(teamsAPIEndpoint); err != nil {
		return allTeams, errors.Wrap(err,
			"failed to download the all players from NBA.com")
	}

	defer resp.Body.Close()
	body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return allTeams, errors.Wrap(err,
			"failed to parse the all players downloaded from NBA.com")
	}

	if err = allTeams.UnmarshalJSON(body); err != nil {
		return allTeams, errors.Wrap(err,
			"failed to unmarshal the all players downloaded from NBA.com")
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
		return allPlayers, errors.Wrap(err,
			"failed to download the all players from NBA.com")
	}

	defer resp.Body.Close()
	body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return allPlayers, errors.Wrap(err,
			"failed to parse the all players downloaded from NBA.com")
	}

	if err = allPlayers.UnmarshalJSON(body); err != nil {
		return allPlayers, errors.Wrap(err,
			"failed to unmarshal the all players downloaded from NBA.com")
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
		return scoreboard, errors.Wrap(err,
			"failed to download the scoreboard from NBA.com")
	}

	defer resp.Body.Close()
	body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return scoreboard, errors.Wrap(err,
			"failed to parse the scoreboard downloaded from NBA.com")
	}

	if err = scoreboard.UnmarshalJSON(body); err != nil {
		return scoreboard, errors.Wrap(err,
			"failed to unmarshal the scoreboard downloaded from NBA.com")
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
		return boxScore, errors.Wrap(err,
			"failed to download the box score from NBA.com")
	}

	defer resp.Body.Close()
	body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return boxScore, errors.Wrap(err,
			"failed to parse the box score downloaded from NBA.com")
	}

	if err = boxScore.UnmarshalJSON(body); err != nil {
		return boxScore, errors.Wrap(err,
			"failed to unmarshal the box score downloaded from NBA.com")
	}

	return boxScore, nil
}
