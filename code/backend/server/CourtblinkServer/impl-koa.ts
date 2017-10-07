import { ApiService } from 'api/ApiService'
import * as App from 'koa'
import { ContextualError } from 'util/ContextualError'
import { Logger } from 'util/Logger'

import { CourtblinkServer } from './types'

// Tag for this server within the logger.
const tag = 'server:koa'

/** Courtblink server implementation that uses the koa web framework. */
export class CourtblinkKoaServer implements CourtblinkServer {
  private apiService: ApiService
  private app: App
  private logger: Logger
  private port: number

  /**
   * Creates a new `CourtblinkKoaServer`.
   * @param port the port, over which, the server will respond to HTTP requests.
   * @param apiService service that implements the courtblink API.
   * @param logger the logging utility to use.
   */
  constructor(port: number, apiService: ApiService, logger: Logger) {
    this.apiService = apiService
    this.logger = logger
    this.port = port
  }

  start(): void {
    // If `app` already exists, `start()` has already been called.
    if (this.app) {
      throw new Error(
        '`CourtblinkKoaServer#start()` cannot be called more than once ' +
          'without calling `CourtblinkKoaServer#stop()` first'
      )
    }

    this.logger.info(
      tag,
      `Starting the courtblink koa server on port ${this.port}`
    )

    // TODO(skeswa): make this work.
    this.app = new App()
    this.app.listen(this.port, this.onReady)
  }

  stop(): void {
    // If `app` doesn't already exists, `start()` has not been called.
    if (!this.app) {
      throw new Error(
        '`CourtblinkKoaServer#stop()` cannot be called before calling ' +
          '`CourtblinkKoaServer#start()` first'
      )
    }

    // TODO(skeswa): make this work.
  }

  /** Method that is invoked when this server is ready for incoming requests. */
  private onReady(): void {
    this.logger.info(
      tag,
      `Courtblink koa server is now listening for HTTP requests on port ` +
        `${this.port}`
    )
  }
}
