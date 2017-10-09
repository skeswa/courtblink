/** Logs messages that describe things that this server is doing. */
export interface Logger {
  /**
   * Logs at the `debug` level.
   * @param tag specified the origin of this log message.
   * @param message message to log.
   */
  debug(tag: string, message: string): void

  /**
   * Logs at the `info` level.
   * @param tag specified the origin of this log message.
   * @param message message to log.
   */
  info(tag: string, message: string): void

  /**
   * Logs at the `warn` level.
   * @param tag specified the origin of this log message.
   * @param message message to log.
   */
  warn(tag: string, message: string): void

  /**
   * Logs at the `error` level.
   * @param tag specified the origin of this log message.
   * @param message message to log.
   */
  error(tag: string, message: string): void

  /**
   * Logs at the `fatal` level.
   * @param tag specified the origin of this log message.
   * @param message message to log.
   */
  fatal(tag: string, message: string): void
}

/** Strategy for creating a new `Logger`. */
export enum LoggerCreationStrategy {
  /** Logger for use in development. */
  ForDev = 'ForDev',
  /** Logger for use in production. */
  ForProd = 'ForProd',
}
