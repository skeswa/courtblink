/** Executes HTTP requests. */
export interface HttpClient {
  /**
   * Executes an HTTP GET against the specified URL and returns the
   * corresponding JSON response.
   * @param url non-HTTPS URL to execute the request against.
   * @param shouldParseJson true if the response should be parsed as JSON.
   * @return the JSON response.
   */
  get(url: string, shouldParseJson?: boolean): Promise<any>
}

/** Strategy for creating a new `HttpClient`. */
export enum HttpClientCreationStrategy {
  /** Uses `tor` to proxy HTTP requests. */
  WithAProxy = 'WithProxy',
  /** Performs plain-vanilla HTTP requests. */
  WithoutAnythingSpecial = 'WithoutAnythingSpecial',
}
