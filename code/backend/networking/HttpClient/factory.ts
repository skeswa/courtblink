import { TorClient } from '../TorClient'
import { ProxiedHttpClient } from './impl-proxied'
import { HttpClient, HttpClientCreationStrategy } from './types'

/**
 * Creates a new http client.
 * @param strategy the creation strategy to use.
 * @param TorClient the client used to communicate with tor.
 * @return the newly created http client.
 */
export function createHttpClient(
  strategy: HttpClientCreationStrategy.WithAProxy,
  torClient: TorClient
): HttpClient {
  return new ProxiedHttpClient(torClient)
}
