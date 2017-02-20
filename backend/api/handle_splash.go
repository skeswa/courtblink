package api

import (
	"time"

	"github.com/skeswa/enbiyay/backend/model"
	"github.com/valyala/fasthttp"
	"go.uber.org/zap"
)

// handleSplash responds to requests for splash data.
func handleSplash(ctx *fasthttp.RequestCtx, store *model.Store, logger *zap.Logger) {
	logger.Info("handling splash request")
	startTime := time.Now()

	splashDataJSON, err := store.GetSplashDataJSON(logger)
	if err != nil {
		logger.Error(
			"failed to respond to splash request",
			zap.Error(err),
			zap.Duration("duration", time.Since(startTime)))

		ctx.Error(errorNBAAPIFailure, fasthttp.StatusInternalServerError)
		return
	}

	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.SetContentType(contentTypeJSON)
	ctx.SetBody(splashDataJSON)

	logger.Info(
		"handled splash request successfully",
		zap.Duration("duration", time.Since(startTime)))
}
