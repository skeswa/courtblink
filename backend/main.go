package main

import (
	"log"

	"github.com/skeswa/enbiyay/backend/model"
)

func main() {
	if store, err := model.NewStore(); err != nil {
		log.Fatalln("Failed to create the store:", err)
	} else {
		splashData, err := store.GetSplashData().MarshalJSON()
		log.Println("Created the store:\n\n", string(splashData[:]), "\n\n", err)
	}
}
