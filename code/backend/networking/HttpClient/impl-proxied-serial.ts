import fetch from 'node-fetch'

import { TorClient } from '../../networking/TorClient'
import { Logger } from '../../util/Logger'

import { HttpClient } from './types'

// Log tag that identifies this module.
const tag = 'http-client:proxied-serial'

/**
 * HTTP client that uses tor to proxy outgoing requests, and makes sure that
 * identical requests never occur at once.
 */
export class ProxiedSerialHttpClient implements HttpClient {
  private logger: Logger
  private pendingRequests: Map<string, Promise<any>>
  private torClient: TorClient

  /**
   * Creates a new `ProxiedSerialHttpClient`.
   * @param torClient client used to communicate with tor.
   * @param logger logging utility.
   */
  constructor(torClient: TorClient, logger: Logger) {
    this.logger = logger
    this.pendingRequests = new Map()
    this.torClient = torClient
  }

  get(url: string): Promise<any> {
    try {
      // Check if there is already a request in flight. If so, just return a
      // reference to that, so we don't waste time.
      if (this.pendingRequests.has(url)) {
        this.logger.debug(
          tag,
          `GET "${url}" request is already in flight - joining this request ` +
            `and the existing one`
        )

        // Use a type assertion to idnicate that we're confident that the
        // pending request exists.
        return this.pendingRequests.get(url) as Promise<any>
      }

      this.logger.debug(tag, `GET "${url}"`)

      // Ship the request using `fetch` and keep a handle of the promise.
      const pendingRequest = fetch(url, {
        method: 'GET',
        // Follow at most 2 redirects - fail fast.
        follow: 2,
        // No request should take longer than 15s. This long timeout is fair
        // because sometimes tor is slow.
        timeout: 15000 /*  */,
        agent: this.torClient.agent(),
      }).then(response => response.json())

      // Cache the request promise to prevent the next identical request from
      // unnecessarily repeating work.
      this.pendingRequests.set(url, pendingRequest)

      // Wait for the request to expire, then remove it from the cache.
      pendingRequest
        .then(() => this.pendingRequests.delete(url))
        .catch(() => this.pendingRequests.delete(url))

      return pendingRequest
    } catch (err) {
      return Promise.reject(`Failed to execute GET request to "${url}": ${err}`)
    }
  }
}
