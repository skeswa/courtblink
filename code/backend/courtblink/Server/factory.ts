import { ApiService } from '../../courtblink/api/ApiService'
import { TeamDetailsCache } from '../../nba/caches/TeamDetailsCache'
import { HttpClient } from '../../networking/HttpClient'
import { Clock } from '../../util/Clock'
import { Logger } from '../../util/Logger'

import { NodeHttpServer } from './impl-node-http'
import { Server, ServerCreationStrategy, ServerEndpointRoutes } from './types'

/**
 * Creates a new HTTP server.
 * @param strategy the creation strategy to use.
 * @param apiService service that implements the courtblink API.
 * @param endpointRoutes routes to use for each server endpoint.
 * @param logger the logging utility to use.
 * @param port the port, over which, the server will respond to HTTP requests.
 * @param teamDetailsCache caches team details.
 * @return the newly created courtblink server.
 */
export function createServer(
  strategy: ServerCreationStrategy.UsingDefaultNodeServer,
  apiService: ApiService,
  clock: Clock,
  endpointRoutes: ServerEndpointRoutes,
  logger: Logger,
  port: number,
  teamDetailsCache: TeamDetailsCache
): Server {
  return new NodeHttpServer(
    apiService,
    clock,
    endpointRoutes,
    logger,
    port,
    teamDetailsCache
  )
}
