package api

import (
	"io/ioutil"
	"net/http"

	"github.com/pkg/errors"
	"github.com/skeswa/enbiyay/backend/colors/dtos"
)

const teamColorsAPIEndpoint = "https://raw.githubusercontent.com/jimniels/teamcolors/master/static/data/teams.json"

var (
	payloadPrefix = []byte(`{"teamColors":`)
	payloadSuffix = []byte(`}`)
)

// FetchTeamColors uses the the github repo made by jimniels to fetch the
// list of all team colors.
func FetchTeamColors() (dtos.AllTeamColorDetails, error) {
	var (
		err           error
		body          []byte
		resp          *http.Response
		allTeamColors dtos.AllTeamColorDetails
	)

	if resp, err = http.Get(teamColorsAPIEndpoint); err != nil {
		return allTeamColors, errors.Wrap(
			err,
			"failed to download the team colors from github")
	}

	defer resp.Body.Close()
	body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		return allTeamColors, errors.Wrap(
			err,
			"failed to parse the team colors from github")
	}

	if err = allTeamColors.UnmarshalJSON(wrapPayload(body)); err != nil {
		return allTeamColors, errors.Wrap(
			err,
			"failed to unmarshal the team colors from github")
	}

	return allTeamColors, nil
}

// wrapPayload surrounds the payload (an array) in json to make it an object.
func wrapPayload(payload []byte) []byte {
	var newPayload []byte
	newPayload = append(newPayload, payloadPrefix...)
	newPayload = append(newPayload, payload...)
	newPayload = append(newPayload, payloadSuffix...)
	return newPayload
}
