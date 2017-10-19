import { HttpServerEndpointRoutes } from '../../networking/HttpServer'
import { Logger } from '../../util/Logger'

/** Options used to create the courtblink backend app. */
export type AppOptions = {
  /** Specifies the routes to use for different API endpoints. */
  endpoints: HttpServerEndpointRoutes
  /** True if running in production. */
  inProd: boolean
  /** Logging utility. */
  logger: Logger
  /** Port over which this server responds to HTTP requests. */
  port: number
  /** Name of the tor executable in the host OS. */
  torExecutableName: string
}

/**
 * The courtlink backend application type. All backend functionality is
 * encapsulated by this class.
 */
export interface App {
  /** Starts the courtblink server app. */
  start(): Promise<void>

  /** Halts the courtblink server app. Kicks off a graceful shutdown. */
  stop(): Promise<void>
}
