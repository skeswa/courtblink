import fetch from 'node-fetch'

import { ContextualError } from 'common/util/ContextualError'

import { Logger } from '../../util/Logger'

import { HttpClient } from './types'

// Log tag that identifies this module.
const tag = 'http-client:normal'

export class NormalHttpClient implements HttpClient {
  private logger: Logger
  private pendingRequests: Map<string, Promise<any>> = new Map()

  /**
   * Creates a new `NormalHttpClient`.
   * @param logger logging utility.
   */
  constructor(logger: Logger) {
    this.logger = logger
  }

  async get(url: string, shouldParseJson: boolean = true): Promise<any> {
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
      const pendingRequest = this.request('GET', url, shouldParseJson)

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

  async request(
    method: string,
    url: string,
    shouldParseJson: boolean
  ): Promise<any> {
    this.logger.debug(tag, `${method} "${url}"`)

    try {
      // Issue the HTTP request and wait for the response to materialize.
      const response = await fetch(url, {
        method: method,
        // No request should take longer than 20s. This long timeout is fair
        // because sometimes tor is slow.
        timeout: 5000,
      })

      // Check if we got a 4XX or a 5XX.
      if (!response.ok) {
        throw new Error(`Remote host responded with code ${response.status}`)
      }

      // Then, get the body of the response, and return it if possible.
      return shouldParseJson ? await response.json() : await response.text()
    } catch (err) {
      throw new ContextualError(`${method} "${url}" request failed`, err)
    }
  }
}
