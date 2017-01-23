package api

import (
	"fmt"
	"log"

	"github.com/skeswa/enbiyay/backend/model"
	"github.com/valyala/fasthttp"
)

// Listen starts listening on the supplied port for HTTP requests.
func Listen(store *model.Store, port int) {
	log.Printf("API is now servicing requests on port %d.\n", port)
	fasthttp.ListenAndServe(fmt.Sprintf(":%d", port), func(ctx *fasthttp.RequestCtx) {
		switch string(ctx.Path()) {
		case "/api/splash":
			handleSplash(ctx, store)
		default:
			ctx.Error(errorRouteDoesNotExist, fasthttp.StatusNotFound)
		}
	})
}
