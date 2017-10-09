import { TorClient } from 'networking/TorClient'

import { NormalHttpClient } from './impl-normal'
import { ProxiedHttpClient } from './impl-proxied'
import { HttpClient, HttpClientCreationStrategy } from './types'

/**
 * Creates a new http client.
 * @param strategy the creation strategy to use.
 * @param torClient the client used to communicate with tor. This parameter is
 *                  only necessary when using the `WithAProxy` strategy.
 * @return the newly created http client.
 */
export function createHttpClient(
  strategy: HttpClientCreationStrategy,
  torClient?: TorClient
): HttpClient {
  switch (strategy) {
    case HttpClientCreationStrategy.WithAProxy:
      if (!torClient) {
        throw new Error(
          'A tor client is required when using the "WithAProxy" strategy'
        )
      }

      return new ProxiedHttpClient(torClient)

    case HttpClientCreationStrategy.WithoutAnythingSpecial:
      return new NormalHttpClient()

    default:
      throw new Error(
        `Could not create an http client with unknown strategy ${strategy}`
      )
  }
}
