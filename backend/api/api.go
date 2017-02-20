package api

import (
	"fmt"

	"go.uber.org/zap"

	"github.com/skeswa/enbiyay/backend/model"
	"github.com/valyala/fasthttp"
)

// Listen starts listening on the supplied port for HTTP requests.
func Listen(store *model.Store, port int, logger *zap.Logger) {
	logger.Info("api is now servicing requests", zap.Int("port", port))
	fasthttp.ListenAndServe(fmt.Sprintf(":%d", port), func(ctx *fasthttp.RequestCtx) {
		switch string(ctx.Path()) {
		case "/api/splash":
			handleSplash(ctx, store, logger)
		default:
			ctx.Error(errorRouteDoesNotExist, fasthttp.StatusNotFound)
		}
	})
	logger.Fatal(
		"api could not service requests due to the designated port's unavailability",
		zap.Int("port", port))
}
