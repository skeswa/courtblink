import {
  createServer,
  Server as NodeServer,
  ServerRequest,
  ServerResponse,
} from 'http'
import * as parseUrl from 'parseurl'

import { ApiService } from '../../courtblink/api/ApiService'
import { Clock } from '../../util/Clock'
import { Logger } from '../../util/Logger'
import { SplashData } from 'common/api/schema/generated'
import { ContextualError } from 'common/util/ContextualError'

import {
  extractYYYYMMDDFromSplashRequest,
  isSplashRoute,
  respondWithProto,
} from './helpers'
import { Server, ServerEndpointRoutes } from './types'

// Log tag that identifies this module.
const tag = 'server:node-http'

/** Courtblink server implementation that uses the node http. */
export class NodeHttpServer implements Server {
  private apiService: ApiService
  private clock: Clock
  private endpointRoutes: ServerEndpointRoutes
  private isListening: boolean
  private logger: Logger
  private port: number
  private server: NodeServer | null

  /**
   * Creates a new `CourtblinkKoaServer`.
   * @param apiService service that implements the courtblink API.
   * @param clock time utility.
   * @param endpointRoutes routes to use for each server endpoint.
   * @param logger the logging utility to use.
   * @param port the port, over which, the server will respond to HTTP requests.
   */
  constructor(
    apiService: ApiService,
    clock: Clock,
    endpointRoutes: ServerEndpointRoutes,
    logger: Logger,
    port: number
  ) {
    this.apiService = apiService
    this.clock = clock
    this.endpointRoutes = endpointRoutes
    this.isListening = false
    this.logger = logger
    this.port = port
    this.server = null
  }

  start(): void {
    // If `server` already exists, `start()` has already been called.
    if (this.server) {
      throw new Error(
        '`start()` cannot be called more than once without calling ' +
          '`stop()` first'
      )
    }

    try {
      // Create the server, and bind it to the `onRequest` method.
      this.server = createServer((req, res) => this.serve(req, res))

      // Start the server, and bind the listening event to the `onReady` method.
      this.server.listen(this.port, () => this.onReady())
    } catch (err) {
      throw new ContextualError(
        'Failed to start the courtblink node http server',
        err
      )
    }
  }

  stop(): Promise<void> {
    // Do not allow the server to be stopped if it has not successfully started
    // yet.
    if (!this.server || !this.isListening) {
      return Promise.reject(
        '`stop()` cannot be called yet, since the server has not yet ' +
          'started to accept incoming requests'
      )
    }

    this.logger.info(tag, `Closing off connections to port ${this.port}`)

    // Stop the server from accepting new incoming connections.
    return new Promise(resolve => {
      // Exit early if the server is not closable.
      if (!this.server) return

      this.server.close(() => {
        this.logger.info(tag, `Server stopped successfully`)

        // Exit early if we can't continue working with the server.
        if (!this.server) return resolve()

        // Unbind all the event handlers.
        this.server.removeAllListeners()

        // Null the server reference to commincate that a new one should be
        // created.
        this.server = null

        // All done!
        resolve()
      })
    })
  }

  /** Method called when this server is ready for incoming requests. */
  private onReady(): void {
    // Indicate that the server is now accepting incoming requests.
    this.isListening = true

    this.logger.info(tag, `Listening for http requests on port ${this.port}`)
  }

  /**
   * Responds to incoming HTTP requests.
   * @param request the incoming request to be handled.
   * @param response the outgoing response to the corresponding request.
   */
  private async serve(
    request: ServerRequest,
    response: ServerResponse
  ): Promise<void> {
    // Faster than node's native url parser.
    const url = parseUrl(request)

    // Do not continue if the request url is not parsable.
    if (!url || !url.pathname) {
      throw new Error(`Failed to parse the URL of request to "${request.url}"`)
    }

    // Alias the pathname variable to a more convenient `path` for no other
    // reason but easier reading.
    const path = url.pathname

    // Remember when the request came in,
    const startTime = this.clock.millisSinceEpoch()

    try {
      // Route the request differently according to the URL.
      if (path === '/') {
        this.serve200(response)
      } else if (isSplashRoute(path, this.endpointRoutes)) {
        await this.serveSplash(
          response,
          extractYYYYMMDDFromSplashRequest(path, this.endpointRoutes)
        )
      } else {
        this.serve404(response)
      }
    } catch (err) {
      // There was an error, so respond with a 500. Then log the problem.
      response.writeHead(500)
      response.end()

      this.logger.error(
        tag,
        `Failed to respond to request with path "${path}"`,
        err
      )
    }

    // Format how long we took to respond.
    const transactionDuration = (this.clock.millisSinceEpoch() - startTime
    ).toLocaleString()

    // Log how long it took to respond.
    this.logger.info(
      tag,
      `Responded to request with path "${path}" in ${transactionDuration}ms`
    )
  }

  /**
   * Responds with an "OK".
   * @param response the outgoing response to the corresponding request.
   */
  private serve200(response: ServerResponse): void {
    response.writeHead(200, 'OK')
    response.end()
  }

  /**
   * Responds with a "Not Found" error.
   * @param response the outgoing response to the corresponding request.
   */
  private serve404(response: ServerResponse): void {
    response.writeHead(404, 'Page not found')
    response.end()
  }

  /**
   * Responds to splash requests.
   * @param response the outgoing response to the corresponding request.
   * @param yyyymmdd date of the splash being requested.
   */
  private async serveSplash(
    response: ServerResponse,
    yyyymmdd: string
  ): Promise<void> {
    try {
      // Use the API service to get splash data for the date requested.
      const requestedSplashData = await this.apiService.fetchSplashData(
        yyyymmdd
      )

      respondWithProto(requestedSplashData, SplashData.encode, response)
    } catch (err) {
      throw new ContextualError('Failed to serve the splash', err)
    }
  }
}
