package main

import (
	"log"
	"time"

	nbaAPI "github.com/skeswa/enbiyay/backend/nba/api"
)

func main() {
	now := time.Date(2017, 1, 9, 12, 12, 0, 0, time.UTC)
	scoreboard, err := nbaAPI.FetchNBAScoreboard(now)
	if err != nil {
		log.Fatalf("Failed to fetch the NBA scoreboard: %v.\n", err)
	}

	for _, game := range scoreboard.Games {
		if _, err := nbaAPI.FetchNBABoxScore(now, game.ID); err != nil {
			log.Fatalf("Failed to fetch the NBA box score: %v.\n", err)
		}
	}

	if players, err := nbaAPI.FetchNBAPlayers(); err != nil {
		log.Fatalf("Failed to fetch the NBA players list: %v.\n", err)
	} else {
		log.Println("Got the players list! Length:", len(players.LeaguePlayers.Players))
	}
}
