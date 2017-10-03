import { LoggerInstance } from 'winston'

import { HttpClient } from '../../networking/HttpClient'
import { HttpNbaApiClient } from './impl-http'
import { NbaApiClient, NbaApiClientCreationStrategy } from './types'

/**
 * Creates a new NBA API client.
 * @param strategy the creation strategy to use.
 * @param logger the logging utility to use.
 * @param HttpClient the client used to send HTTP requests.
 * @return the newly created NBA API client.
 */
export function createNbaApiClient(
  strategy: NbaApiClientCreationStrategy.UsingNbaHttpApi,
  logger: LoggerInstance,
  httpClient: HttpClient,
): NbaApiClient {
  return new HttpNbaApiClient(httpClient, logger)
}
