package model

import (
	"sync"
	"time"

	"github.com/pkg/errors"
	"github.com/skeswa/enbiyay/backend/dtos"
	nbaAPI "github.com/skeswa/enbiyay/backend/nba/api"
	nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"
)

// storeUpdateInterval = how often the store queries the NBA API for fresh data.
const storeUpdateInterval = 2 * time.Minute

// Store encapsulates all data that will be eventually served to the frontend.
type Store struct {
	lock                 *sync.RWMutex
	teamCache            *TeamCache
	playerCache          *PlayerCache
	boxScoreCache        *BoxScoreCache
	teamColorCache       *TeamColorCache
	timeLastUpdated      time.Time
	latestScoreboard     *nbaDTOs.NBAScoreboard
	latestSplashDataJSON []byte
}

// NewStore creates a new Store.
func NewStore() (*Store, error) {
	teams, players, teamColors, scoreboard, boxScores, err := fetchInitialStoreData()
	if err != nil {
		return nil, errors.Wrap(err, "failed to create a new store")
	}

	var (
		teamCache      = BuildTeamCache(teams)
		playerCache    = BuildPlayerCache(players)
		boxScoreCache  = BuildBoxScoreCache(boxScores)
		teamColorCache = BuildTeamColorCache(teamCache, teamColors)

		store = Store{
			lock:             &sync.RWMutex{},
			teamCache:        teamCache,
			playerCache:      playerCache,
			boxScoreCache:    boxScoreCache,
			teamColorCache:   teamColorCache,
			latestScoreboard: scoreboard,
		}
	)

	splashDataJSON, err := extractSplashDataJSON(
		scoreboard,
		teamCache,
		playerCache,
		boxScoreCache,
		teamColorCache)
	if err != nil {
		return nil, errors.Wrap(err, "failed to create a new store")
	}

	store.timeLastUpdated = time.Now()
	store.latestSplashDataJSON = splashDataJSON

	return &store, nil
}

// update refreshes the data in the store that changes often.
func (s *Store) update() error {
	var (
		now             = time.Now()
		scoreboard, err = nbaAPI.FetchNBAScoreboard(now)
	)

	if err != nil {
		return errors.Wrap(err, "failed to update the store's scoreboard")
	}

	boxScores, err := fetchBoxScores(now, &scoreboard)
	if err != nil {
		return errors.Wrap(err, "failed to update the store's box scores")
	}

	s.lock.RLock()
	teamCache := s.teamCache
	playerCache := s.playerCache
	boxScoreCache := s.boxScoreCache
	teamColorCache := s.teamColorCache
	s.lock.RUnlock()

	s.boxScoreCache.Update(boxScores)

	splashDataJSON, err := extractSplashDataJSON(
		&scoreboard,
		teamCache,
		playerCache,
		boxScoreCache,
		teamColorCache)
	if err != nil {
		return errors.Wrap(err, "failed to update the store's splash data json")
	}

	s.lock.Lock()
	s.latestScoreboard = &scoreboard
	s.timeLastUpdated = now
	s.latestSplashDataJSON = splashDataJSON
	s.lock.Unlock()

	return nil
}

// GetSplashDataJSON fetches the JSON-serialized form of the latest splash data
// available in the store.
func (s *Store) GetSplashDataJSON() ([]byte, error) {
	s.lock.RLock()
	now := time.Now()
	timeLastUpdated := s.timeLastUpdated
	s.lock.RUnlock()

	if now.After(timeLastUpdated.Add(storeUpdateInterval)) {
		if err := s.update(); err != nil {
			return nil, errors.Wrap(err, "failed update store to extract splash data")
		}
	}

	s.lock.RLock()
	splashDataJSON := s.latestSplashDataJSON
	s.lock.RUnlock()

	return splashDataJSON, nil
}

// extractSplashDataJSON gets the splash data from the provided scoreboard and
// caches and returns the JSON-serialized form of the aforesaid data.
func extractSplashDataJSON(
	scoreboard *nbaDTOs.NBAScoreboard,
	teamCache *TeamCache,
	playerCache *PlayerCache,
	boxScoreCache *BoxScoreCache,
	teamColorCache *TeamColorCache,
) ([]byte, error) {
	games := scoreboard.Games
	gameSummaries := make([]dtos.GameSummary, len(games))
	for i, game := range games {
		gameSummaries[i] = convertNBAGameToGameSummary(game)
	}

	var firstGameDetails *dtos.GameDetails
	if len(games) > 0 {
		details, err := convertNBAGameToGameDetails(
			games[0],
			teamCache,
			playerCache,
			boxScoreCache,
			teamColorCache)
		if err != nil {
			errors.Wrap(err, "failed extract spalsh data JSON")
		}

		firstGameDetails = &details
	}

	splashData := dtos.SplashData{
		Games:            gameSummaries,
		FirstGameDetails: firstGameDetails,
	}

	return splashData.MarshalJSON()
}
