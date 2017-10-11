import { ApiService } from '../../api/ApiService'
import { HttpClient } from '../../networking/HttpClient'
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
 * @param port the port, over which, the server will respond to HTTP requests.
 * @param apiService service that implements the courtblink API.
 * @param logger the logging utility to use.
 * @param endpointRoutes routes to use for each server endpoint.
 * @return the newly created courtblink server.
 */
export function createHttpServer(
  strategy: HttpServerCreationStrategy.UsingDefaultNodeHttpServer,
  port: number,
  apiService: ApiService,
  logger: Logger,
  endpointRoutes: HttpServerEndpointRoutes
): HttpServer {
  return new NodeHttpServer(port, apiService, logger, endpointRoutes)
}
