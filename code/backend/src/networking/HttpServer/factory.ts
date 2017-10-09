import { ApiService } from '../../api/ApiService'
import { HttpClient } from '../../networking/HttpClient'
import { Logger } from '../../util/Logger'

import { KoaServer } from './impl-koa'
import { HttpServer, HttpServerCreationStrategy } from './types'

/**
 * Creates a new HTTP server.
 * @param strategy the creation strategy to use.
 * @param port the port, over which, the server will respond to HTTP requests.
 * @param apiService service that implements the courtblink API.
 * @param logger the logging utility to use.
 * @return the newly created courtblink server.
 */
export function createHttpServer(
  strategy: HttpServerCreationStrategy.UsingKoa,
  port: number,
  apiService: ApiService,
  logger: Logger
): HttpServer {
  return new KoaServer(port, apiService, logger)
}
