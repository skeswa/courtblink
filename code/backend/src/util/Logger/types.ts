/** Logs messages that describe things that this server is doing. */
export interface Logger {
  /**
   * Logs at the `debug` level.
   * @param tag specified the origin of this log message.
   * @param message message to log.
   * @param info data to attach to the message.
   */
  debug(tag: string, message: string, info?: object): void

  /**
   * Logs at the `info` level.
   * @param tag specified the origin of this log message.
   * @param message message to log.
   * @param info data to attach to the message.
   */
  info(tag: string, message: string, info?: object): void

  /**
   * Logs at the `warn` level.
   * @param tag specified the origin of this log message.
   * @param message message to log.
   * @param info data to attach to the message.
   */
  warn(tag: string, message: string, info?: object): void

  /**
   * Logs at the `error` level.
   * @param tag specified the origin of this log message.
   * @param message message to log.
   * @param info data to attach to the message.
   */
  error(tag: string, message: string, info?: object): void

  /**
   * Logs at the `fatal` level.
   * @param tag specified the origin of this log message.
   * @param message message to log.
   * @param info data to attach to the message.
   */
  fatal(tag: string, message: string, info?: object): void
}

/** Strategy for creating a new `Logger`. */
export enum LoggerCreationStrategy {
  /** Logger for use in development. */
  ForDev = 'ForDev',
  /** Logger for use in production. */
  ForProd = 'ForProd',
}
