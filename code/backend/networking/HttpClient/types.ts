/** Executes HTTP requests. */
export interface HttpClient {
  /**
   * Executes an HTTP GET against the specified URL and returns the
   * corresponding JSON response.
   * @param url non-HTTPS URL to execute the request against.
   * @return the JSON response.
   */
  get(url: string): Promise<any>
}

/** Strategy for creating a new `HttpClient`. */
export enum HttpClientCreationStrategy {
  /** Uses `tor` to proxy HTTP requests. */
  WithAProxy,
  /** Performs plain-vanilla HTTP requests. */
  WithoutAnythingSpecial
}