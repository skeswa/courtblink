import { Logger } from 'util/Logger'

/** Responds to incoming Courtblink HTTP requests. */
export interface CourtblinkServer {
  /**
   * Starts the courtblink server on the specified port. The server will run
   * until it is stopped with the `stop()` method.
   */
  start(): void

  /**
   * Stops the courtblink server. Throws an error if the server wasn't running
   * to begin with.
   */
  stop(): void
}

/** Strategy for creating a new `CourtblinkServer`. */
export enum CourtblinkServerCreationStrategy {
  /** Uses koa for the web server implementation. */
  UsingKoa = 'UsingKoa',
}