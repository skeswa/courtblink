import { Logger } from '../../util/Logger'

/** Responds to incoming Courtblink HTTP requests. */
export interface Server {
  /**
   * Starts the courtblink server on the specified port. The server will run
   * until it is stopped with the `stop()` method.
   */
  start(): void

  /**
   * Stops the courtblink server. Throws an error if the server wasn't running
   * to begin with.
   */
  stop(): Promise<void>
}

/** Strategy for creating a new `CourtblinkServer`. */
export enum ServerCreationStrategy {
  /**
   * Uses the http server that ships with node for the web server
   * implementation.
   */
  UsingDefaultNodeServer = 'UsingDefaultNodeServer',
}

/** Specifies the routes to use for different server endpoints. */
export type ServerEndpointRoutes = {
  gameNews: string
  splash: string
}
