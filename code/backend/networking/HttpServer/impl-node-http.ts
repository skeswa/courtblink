import { createServer, Server, ServerRequest, ServerResponse } from 'http'
import * as parseUrl from 'parseurl'

import { ApiService } from '../../api/ApiService'
import { SplashData } from '../../api/schema'
import { ContextualError } from '../../util/ContextualError'
import { Logger } from '../../util/Logger'

import {
  extractRequestSplashDate,
  isSplashRoute,
  respondWithProto,
} from './helpers'
import { HttpServer, HttpServerEndpointRoutes } from './types'

// Log tag that identifies this module.
const tag = 'server:node-http'

/** Courtblink server implementation that uses the node http. */
export class NodeHttpServer implements HttpServer {
  private apiService: ApiService
  private endpointRoutes: HttpServerEndpointRoutes
  private isListening: boolean
  private logger: Logger
  private port: number
  private server: Server

  /**
   * Creates a new `CourtblinkKoaServer`.
   * @param port the port, over which, the server will respond to HTTP requests.
   * @param apiService service that implements the courtblink API.
   * @param logger the logging utility to use.
   * @param endpointRoutes routes to use for each server endpoint.
   */
  constructor(
    port: number,
    apiService: ApiService,
    logger: Logger,
    endpointRoutes: HttpServerEndpointRoutes
  ) {
    this.apiService = apiService
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
      const server = createServer((req, res) => this.serve(req, res))

      // Bind the `onError` method to handle uncaught errors.
      server.on('error', err => this.onError(err))

      // Start the server, and bind the listening event to the `onReady` method.
      server.listen(this.port, () => this.onReady())
    } catch (err) {
      throw new ContextualError(
        'Failed to start the courtblink node http server',
        err
      )
    }
  }

  stop(): void {
    // Do not allow the server to be stopped if it has not successfully started
    // yet.
    if (!this.server || !this.isListening) {
      throw new Error(
        '`stop()` cannot be called yet, since the server has not yet started ' +
          'to accept incoming requests'
      )
    }

    this.logger.info(tag, `Closing off connections to port ${this.port}`)

    // Stop the server from accepting new incoming connections.
    this.server.close(() => {
      this.logger.info(tag, `Server stopped successfully`)

      // Unbind all the event handlers.
      this.server.removeAllListeners()

      // Nul lthe server reference to commincate that a new one should be
      // created.
      this.server = null
    })
  }

  /**
   * Method called when the server encounters an uncaught error.
   * @param error the uncaught error to handle.
   */
  private onError(err: Error): void {
    this.logger.error(tag, 'Encounted an uncaught error', err)
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
    const path = parseUrl(request).pathname

    // Remember when the request came in,
    const startTime = Date.now()

    try {
      // Route the request differently according to the URL.
      if (isSplashRoute(path, this.endpointRoutes)) {
        await this.serveSplash(
          extractRequestSplashDate(path, this.endpointRoutes),
          response
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

    // Log how long it took to respond.
    this.logger.debug(
      tag,
      `Responded to request with path "${path}" in ${Date.now() - startTime}ms`
    )
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
   * @param requestedDate date of the splash being requested.
   * @param response the outgoing response to the corresponding request.
   */
  private async serveSplash(
    requestedDate: Date,
    response: ServerResponse
  ): Promise<void> {
    try {
      // Use the API service to get splash data for the date requested.
      const requestedSplashData = await this.apiService.fetchSplashData(
        requestedDate
      )

      respondWithProto(requestedSplashData, SplashData.encode, response)
    } catch (err) {
      throw new ContextualError('Failed to serve the splash', err)
    }
  }
}
