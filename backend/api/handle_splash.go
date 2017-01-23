package api

import (
	"github.com/skeswa/enbiyay/backend/model"
	"github.com/valyala/fasthttp"
)

// handleSplash responds to requests for splash data.
func handleSplash(ctx *fasthttp.RequestCtx, store *model.Store) {
	splashDataJSON, err := store.GetSplashDataJSON()
	if err != nil {
		ctx.Error(errorNBAAPIFailure, fasthttp.StatusInternalServerError)
		return
	}

	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.SetContentType(contentTypeJSON)
	ctx.SetBody(splashDataJSON)
}
