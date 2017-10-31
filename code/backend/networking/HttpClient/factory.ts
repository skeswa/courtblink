import { TorClient } from '../../networking/TorClient'
import { Logger } from '../../util/Logger'

import { NormalHttpClient } from './impl-normal'
import { ProxiedSerialHttpClient } from './impl-proxied-serial'
import { HttpClient, HttpClientCreationStrategy } from './types'

/**
 * Creates a new http client.
 * @param strategy the creation strategy to use.
 * @param logger logging utility.
 * @param torClient the client used to communicate with tor. This parameter is
 *                  only necessary when using the `WithAProxy` strategy.
 * @return the newly created http client.
 */
export function createHttpClient(
  strategy: HttpClientCreationStrategy,
  logger: Logger,
  torClient?: TorClient
): HttpClient {
  switch (strategy) {
    case HttpClientCreationStrategy.WithAProxy:
      if (!torClient) {
        throw new Error(
          'A tor client is required when using the "WithAProxy" strategy'
        )
      }

      return new ProxiedSerialHttpClient(torClient, logger)

    case HttpClientCreationStrategy.WithoutAnythingSpecial:
      return new NormalHttpClient(logger)

    default:
      throw new Error(
        `Could not create an http client with unknown strategy ${strategy}`
      )
  }
}
