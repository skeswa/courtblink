package model

import (
	"time"

	"go.uber.org/zap"

	"github.com/pkg/errors"
	teamColorsAPI "github.com/skeswa/enbiyay/backend/colors/api"
	teamColorsDTOs "github.com/skeswa/enbiyay/backend/colors/dtos"
	nbaAPI "github.com/skeswa/enbiyay/backend/nba/api"
	nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"
)

// fetchInitialStoreData uses the NBA and Github APIs, respectively, to get the
// requisite information to initialize the store.
func fetchInitialStoreData(logger *zap.Logger) (
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

		// Don't move on to the next day until 2pm.
		now            = time.Now().Add(-14 * time.Hour)
		killed1        = false
		errorChan      = make(chan error)
		teamsChan      = make(chan nbaDTOs.NBAAllTeams)
		playersChan    = make(chan nbaDTOs.NBAAllPlayers)
		teamColorsChan = make(chan teamColorsDTOs.AllTeamColorDetails)
		scoreboardChan = make(chan nbaDTOs.NBAScoreboard)
	)

	logger.Debug("fetching initial store data")

	go fetchTeams(teamsChan, errorChan, &killed1)
	go fetchPlayers(playersChan, errorChan, &killed1)
	go fetchTeamColors(teamColorsChan, errorChan, &killed1)
	go fetchScoreboard(now, scoreboardChan, errorChan, &killed1)

	for !killed1 {
		select {
		case result := <-teamsChan:
			logger.Debug("initial store data fetcher received team")

			teams = &result
		case result := <-playersChan:
			logger.Debug("initial store data fetcher received players")

			players = &result
		case result := <-teamColorsChan:
			logger.Debug("initial store data fetcher received colors")

			teamColors = &result
		case result := <-scoreboardChan:
			logger.Debug("initial store data fetcher received scoreboard")

			scoreboard = &result
		case result := <-errorChan:
			logger.Debug("initial store data fetcher received error")

			err = result
		}

		if err != nil ||
			(teams != nil &&
				players != nil &&
				teamColors != nil &&
				scoreboard != nil) {
			logger.Debug("initial store data fetcher activated the kill switch")

			killed1 = true
			close(teamsChan)
			close(errorChan)
			close(playersChan)
			close(teamColorsChan)
			close(scoreboardChan)
		}
		if err != nil {
			return nil, nil, nil, nil, nil, errors.Wrap(
				err,
				"failed to fetch initial store data")
		}
	}

	boxScores, err := fetchBoxScores(now, scoreboard, logger)
	if err != nil {
		return nil, nil, nil, nil, nil, errors.Wrap(
			err,
			"failed to fetch initial store data")
	}

	logger.Debug("initial store data fetcher returning initial store data")
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

// fetchBoxScores fetches all the box scores for the provided scoreboard in
// parallel.
func fetchBoxScores(
	date time.Time,
	scoreboard *nbaDTOs.NBAScoreboard,
	logger *zap.Logger,
) ([]nbaDTOs.NBABoxScore, error) {
	if len(scoreboard.Games) < 1 {
		return nil, nil
	}

	var (
		err       error
		boxScores []nbaDTOs.NBABoxScore

		killed2      = false
		errorChan    = make(chan error)
		boxScoreChan = make(chan nbaDTOs.NBABoxScore)
	)

	logger.Debug(
		"fetching box scores",
		zap.Int("numBoxScores", len(scoreboard.Games)))
	for _, game := range scoreboard.Games {
		go fetchBoxScore(
			date,
			game.ID,
			boxScoreChan,
			errorChan,
			&killed2)
	}

	errorChan = make(chan error)
	for !killed2 {
		select {
		case result := <-boxScoreChan:
			logger.Debug("plural box score fetcher received box score")

			boxScores = append(boxScores, result)
		case result := <-errorChan:
			logger.Debug("plural box score fetcher received error")

			err = result
		}

		if err != nil ||
			(len(boxScores) >= len(scoreboard.Games)) {
			logger.Debug("plural box score fetcher activated the kill switch")

			killed2 = true
			close(errorChan)
			close(boxScoreChan)
		}
		if err != nil {
			return boxScores, errors.Wrap(
				err,
				"failed to fetch box scores")
		}
	}

	logger.Debug("plural box score fetcher returning box scores")
	return boxScores, nil
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
