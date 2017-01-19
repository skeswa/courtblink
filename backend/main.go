package main

import (
	"log"
	"time"

	"github.com/skeswa/enbiyay/backend/dtos"
)

func main() {
	if scoreboard, err := dtos.FetchNBAScoreboard(time.Now()); err != nil {
		log.Fatalf("Failed to fetch the NBA scoreboard: %v.\n", err)
	} else {
		log.Println("scoreboard:", scoreboard)
	}
}
