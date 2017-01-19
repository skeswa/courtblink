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
		if boxScore, err := nbaAPI.FetchNBABoxScore(now, game.ID); err != nil {
			log.Fatalf("Failed to fetch the NBA box score: %v.\n", err)
		} else {
			if data, err := boxScore.MarshalJSON(); err != nil {
				log.Println("Error serializing the box score:", err)
			} else {
				log.Println("Fetched the NBA box score:", string(data[:]))
			}
		}
	}
}
