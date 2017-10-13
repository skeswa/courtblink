import { ApiService } from '../../courtblink/api/ApiService'
import { HttpClient } from '../../networking/HttpClient'
import { Clock } from '../../util/Clock'
import { Logger } from '../../util/Logger'

import { NodeHttpServer } from './impl-node-http'
import {
  HttpServer,
  HttpServerCreationStrategy,
  HttpServerEndpointRoutes,
} from './types'

/**
 * Creates a new HTTP server.
 * @param strategy the creation strategy to use.
 * @param apiService service that implements the courtblink API.
 * @param endpointRoutes routes to use for each server endpoint.
 * @param logger the logging utility to use.
 * @param port the port, over which, the server will respond to HTTP requests.
 * @return the newly created courtblink server.
 */
export function createHttpServer(
  strategy: HttpServerCreationStrategy.UsingDefaultNodeHttpServer,
  apiService: ApiService,
  clock: Clock,
  endpointRoutes: HttpServerEndpointRoutes,
  logger: Logger,
  port: number
): HttpServer {
  return new NodeHttpServer(apiService, clock, endpointRoutes, logger, port)
}
