package main

import (
	"log"

	"go.uber.org/zap"

	"github.com/skeswa/enbiyay/backend/api"
	"github.com/skeswa/enbiyay/backend/model"
)

func main() {
	logger, _ := zap.NewDevelopment()
	store, err := model.NewStore(logger)
	if err != nil {
		log.Fatalln("Could not start the backend: Failed to create the store: ", err)
	}

	api.Listen(store, 3001, logger)
}
