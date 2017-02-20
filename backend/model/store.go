package model

import (
	"sync"
	"time"

	"go.uber.org/zap"

	"github.com/pkg/errors"
	nbaAPI "github.com/skeswa/enbiyay/backend/nba/api"
	nbaDTOs "github.com/skeswa/enbiyay/backend/nba/dtos"
)

// storeUpdateInterval = how often the store queries the NBA API for fresh data.
const storeUpdateInterval = 1 * time.Minute

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
func NewStore(logger *zap.Logger) (*Store, error) {
	teams, players, teamColors, scoreboard, boxScores, err := fetchInitialStoreData(logger)
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
func (s *Store) update(logger *zap.Logger) error {
	logger.Debug("updating the store")

	var (
		// Don't move on to the next day until 2pm.
		now             = time.Now().Add(-14 * time.Hour)
		scoreboard, err = nbaAPI.FetchNBAScoreboard(now)
	)

	if err != nil {
		return errors.Wrap(err, "failed to update the store's scoreboard")
	}

	logger.Debug("fetched the nba scoreboard; now fetching box scores")
	boxScores, err := fetchBoxScores(now, &scoreboard, logger)
	if err != nil {
		return errors.Wrap(err, "failed to update the store's box scores")
	}

	s.lock.RLock()
	teamCache := s.teamCache
	playerCache := s.playerCache
	boxScoreCache := s.boxScoreCache
	teamColorCache := s.teamColorCache
	s.lock.RUnlock()

	logger.Debug("updating the box score cache")
	s.boxScoreCache.Update(boxScores)

	logger.Debug("extracting the splash data json")
	splashDataJSON, err := extractSplashDataJSON(
		&scoreboard,
		teamCache,
		playerCache,
		boxScoreCache,
		teamColorCache)
	if err != nil {
		return errors.Wrap(err, "failed to update the store's splash data json")
	}

	logger.Debug("updating store state")
	s.lock.Lock()
	s.latestScoreboard = &scoreboard
	s.timeLastUpdated = now
	s.latestSplashDataJSON = splashDataJSON
	s.lock.Unlock()

	return nil
}

// GetSplashDataJSON fetches the JSON-serialized form of the latest splash data
// available in the store.
func (s *Store) GetSplashDataJSON(logger *zap.Logger) ([]byte, error) {
	logger.Debug("getting splash data json")
	now := time.Now()
	s.lock.RLock()
	timeLastUpdated := s.timeLastUpdated
	s.lock.RUnlock()

	if now.After(timeLastUpdated.Add(storeUpdateInterval)) {
		logger.Debug("the cached splash data has expired; updating accordingly")
		if err := s.update(logger); err != nil {
			return nil, errors.Wrap(err, "failed update store to extract splash data")
		}
	}

	logger.Debug("returning splash data json")
	s.lock.RLock()
	splashDataJSON := s.latestSplashDataJSON
	s.lock.RUnlock()

	return splashDataJSON, nil
}
