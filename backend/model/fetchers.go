package model

import (
	"fmt"
	"time"

	teamColorsAPI "github.com/skeswa/enbiyay/backend/colors/api"
	teamColorsDTOs "github.com/skeswa/enbiyay/backend/colors/dtos"
	nbaAPI "github.com/skeswa/enbiyay/backend/nba/api"
	nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"
)

// fetchInitialStoreData uses the NBA and Github APIs, respectively, to get the
// requisite information to initialize the store.
func fetchInitialStoreData() (
	*nbaDTOs.NBAAllTeams,
	*nbaDTOs.NBAAllPlayers,
	*teamColorsDTOs.AllTeamColorDetails,
	*nbaDTOs.NBAScoreboard,
	[]nbaDTOs.NBABoxScore,
	error,
) {
	var (
		err        error
		teams      *nbaDTOs.NBAAllTeams
		players    *nbaDTOs.NBAAllPlayers
		teamColors *teamColorsDTOs.AllTeamColorDetails
		scoreboard *nbaDTOs.NBAScoreboard

		now            = time.Now()
		killed1        = false
		errorChan      = make(chan error)
		teamsChan      = make(chan nbaDTOs.NBAAllTeams)
		playersChan    = make(chan nbaDTOs.NBAAllPlayers)
		teamColorsChan = make(chan teamColorsDTOs.AllTeamColorDetails)
		scoreboardChan = make(chan nbaDTOs.NBAScoreboard)
	)

	go fetchTeams(teamsChan, errorChan, &killed1)
	go fetchPlayers(playersChan, errorChan, &killed1)
	go fetchTeamColors(teamColorsChan, errorChan, &killed1)
	go fetchScoreboard(now, scoreboardChan, errorChan, &killed1)

	for !killed1 {
		select {
		case result := <-teamsChan:
			teams = &result
		case result := <-playersChan:
			players = &result
		case result := <-teamColorsChan:
			teamColors = &result
		case result := <-scoreboardChan:
			scoreboard = &result
		case result := <-errorChan:
			err = result
		}

		if err != nil ||
			(teams != nil &&
				players != nil &&
				teamColors != nil &&
				scoreboard != nil) {
			killed1 = true
			close(teamsChan)
			close(errorChan)
			close(playersChan)
			close(teamColorsChan)
			close(scoreboardChan)
		}
		if err != nil {
			return nil, nil, nil, nil, nil, fmt.Errorf(
				"Failed to fetch initial store data: %v",
				err)
		}
	}

	var (
		boxScores []nbaDTOs.NBABoxScore

		killed2      = false
		boxScoreChan = make(chan nbaDTOs.NBABoxScore)
	)

	for _, game := range scoreboard.Games {
		go fetchBoxScore(
			now,
			game.ID,
			boxScoreChan,
			errorChan,
			&killed2)
	}

	errorChan = make(chan error)
	for !killed2 {
		select {
		case result := <-boxScoreChan:
			boxScores = append(boxScores, result)
		case result := <-errorChan:
			err = result
		}

		if err != nil ||
			(len(boxScores) >= len(scoreboard.Games)) {
			killed2 = true
			close(errorChan)
			close(boxScoreChan)
		}
		if err != nil {
			return nil, nil, nil, nil, nil, fmt.Errorf(
				"Failed to fetch initial store data: %v",
				err)
		}
	}

	return teams, players, teamColors, scoreboard, boxScores, nil
}

// fetchTeams is an asynchronous wrapper for FetchNBATeams(...).
func fetchTeams(
	resultChan chan<- nbaDTOs.NBAAllTeams,
	errorChan chan<- error,
	dead *bool,
) {
	teams, err := nbaAPI.FetchNBATeams()
	if !*dead {
		if err != nil {
			errorChan <- err
		} else {
			resultChan <- teams
		}
	}
}

// fetchPlayers is an asynchronous wrapper for FetchNBAPlayers(...).
func fetchPlayers(
	resultChan chan<- nbaDTOs.NBAAllPlayers,
	errorChan chan<- error,
	dead *bool,
) {
	players, err := nbaAPI.FetchNBAPlayers()
	if !*dead {
		if err != nil {
			errorChan <- err
		} else {
			resultChan <- players
		}
	}
}

// fetchScoreboard is an asynchronous wrapper for FetchNBAScoreboard(...).
func fetchScoreboard(
	date time.Time,
	resultChan chan<- nbaDTOs.NBAScoreboard,
	errorChan chan<- error,
	dead *bool,
) {
	scoreboard, err := nbaAPI.FetchNBAScoreboard(date)
	if !*dead {
		if err != nil {
			errorChan <- err
		} else {
			resultChan <- scoreboard
		}
	}
}

// fetchBoxScore is an asynchronous wrapper for FetchNBABoxScore(...).
func fetchBoxScore(
	date time.Time,
	gameID string,
	resultChan chan<- nbaDTOs.NBABoxScore,
	errorChan chan<- error,
	dead *bool,
) {
	boxScore, err := nbaAPI.FetchNBABoxScore(date, gameID)
	if !*dead {
		if err != nil {
			errorChan <- err
		} else {
			resultChan <- boxScore
		}
	}
}

// fetchTeamColors is an asynchronous wrapper for FetchTeamColors(...).
func fetchTeamColors(
	resultChan chan<- teamColorsDTOs.AllTeamColorDetails,
	errorChan chan<- error,
	dead *bool,
) {
	teamColors, err := teamColorsAPI.FetchTeamColors()
	if !*dead {
		if err != nil {
			errorChan <- err
		} else {
			resultChan <- teamColors
		}
	}
}
