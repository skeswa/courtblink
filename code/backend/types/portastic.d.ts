declare module 'portastic' {
  type FindOptions = {
    /** Minimum port number to start with. */
    min?: number
    /** Maximum port number to scan. */
    max?: number
    /** How many ports to collect. */
    retrieve?: number
  }

  /**
   * Retrieve a list of open ports between min and max, if a callback is not
   * provided this method will resolve a promise with the results.
   * @param options configuration for the `find` function.
   * @return a list of available ports.
   */
  export function find(options: FindOptions): Promise<number[]>
}
