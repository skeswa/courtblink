import { ApiService } from 'api/ApiService'
import { HttpClient } from 'networking/HttpClient'
import { Logger } from 'util/Logger'

import { CourtblinkKoaServer } from './impl-koa'
import { CourtblinkServer, CourtblinkServerCreationStrategy } from './types'

/**
 * Creates a new courtblink server.
 * @param strategy the creation strategy to use.
 * @param port the port, over which, the server will respond to HTTP requests.
 * @param apiService service that implements the courtblink API.
 * @param logger the logging utility to use.
 * @return the newly created courtblink server.
 */
export function createCourtblinkServer(
  strategy: CourtblinkServerCreationStrategy.UsingKoa,
  port: number,
  apiService: ApiService,
  logger: Logger
): CourtblinkServer {
  return new CourtblinkKoaServer(port, apiService, logger)
}
