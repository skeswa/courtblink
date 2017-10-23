import fetch from 'node-fetch'

import { ContextualError } from 'common/util/ContextualError'

import { TorClient } from '../../networking/TorClient'
import { Logger } from '../../util/Logger'

import { isATimeoutError } from './helpers'
import { HttpClient } from './types'

// Log tag that identifies this module.
const tag = 'http-client:proxied-serial'

// TODO(skeswa): 2 things:
// - Add re-attempt logic.
// - Make it request a new connection after a series of timeouts.

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

    try {
      // Ship the request using `fetch` and keep a handle of the promise.
      const pendingRequest = this.request('GET', url)

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

  /**
   * Executes an HTTP request and returns the JSON body of the response. This
   * method re-attempts the same request `maxAttempts` times. If all of the
   * errors are timeouts, this method will ask tor for a new connection and
   * then try again.
   * @param method HTTP method to use.
   * @param url the URL of the HTTP request to be made.
   * @param initialAttempts number of attempts to start at.
   * @param maxAttempts number of attempts to stop at.
   */
  private async request(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    initialAttempts: number = 0,
    maxAttempts: number = 3
  ): Promise<any> {
    let attempts = initialAttempts
    let lastError: Error | undefined
    let timeoutFailures = 0

    // Attempt the fetch three times. If it fails all three times due to a
    // timeout, then ask tor for a new IP address.
    for (attempts = 0; attempts < maxAttempts; attempts++) {
      this.logger.debug(
        tag,
        `${method} "${url}" (attempt ${attempts + 1}/${maxAttempts})`
      )

      try {
        // Issue the HTTP request and wait for the response to materialize.
        const response = await fetch(url, {
          method: 'GET',
          // Follow at most 2 redirects - fail fast.
          follow: 2,
          // No request should take longer than 20s. This long timeout is fair
          // because sometimes tor is slow.
          timeout: 20000,
          agent: this.torClient.agent(),
        })

        // Then, get the body of the response, and return it if possible.
        return await response.json()
      } catch (err) {
        // Check if the error was due to a timeout. If so, increment the number
        // of timeout failures.
        if (isATimeoutError(err)) {
          this.logger.debug(tag, `${method} "${url}" timed out`)

          timeoutFailures++
        } else {
          this.logger.error(tag, `${method} "${url}" failed`, err)
        }

        lastError = err
        continue
      }
    }

    // Check if all the failures were timeouts. If so, ask for a new connection.
    if (timeoutFailures === attempts) {
      try {
        await this.torClient.switchIP()

        // After the IP switch happens, try another request. Make sure the
        // number of attempts is preserved for our records.
        return this.request(
          method,
          url,
          attempts,
          maxAttempts + (maxAttempts - attempts)
        )
      } catch (err) {
        throw new ContextualError(
          `Failed to request a new IP while sending a ${method} request` +
            ` to "${url}"`,
          err
        )
      }
    }

    // Throw the error that we bumped into, because it wasn't timeout related.
    throw new ContextualError(
      `Failed to send a ${method} request to "${url}" after ` +
        `${attempts} attempts`,
      lastError
    )
  }
}
