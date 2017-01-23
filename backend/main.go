package main

import (
	"log"

	"github.com/skeswa/enbiyay/backend/api"
	"github.com/skeswa/enbiyay/backend/model"
)

func main() {
	store, err := model.NewStore()
	if err != nil {
		log.Fatalln("Could not start the backend: Failed to create the store: ", err)
	}

	api.Listen(store, 3001)
}
