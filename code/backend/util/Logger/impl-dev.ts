import {
  Logger as WinstonLogger,
  LoggerInstance as WinstonLoggerInstance,
  transports as WinstonTransports,
} from 'winston'

import { Logger } from './types'

export class DevLogger implements Logger {
  private winstonLogger: WinstonLoggerInstance

  constructor() {
    this.winstonLogger = new WinstonLogger({
      transports: [new WinstonTransports.Console()],
    })
  }

  debug(tag: string, message: string, info?: object): void {
    this.winstonLogger.debug(`[${tag}] ${message}`, info)
  }

  info(tag: string, message: string, info?: object): void {
    this.winstonLogger.info(`[${tag}] ${message}`, info)
  }

  warn(tag: string, message: string, info?: object): void {
    this.winstonLogger.warn(`[${tag}] ${message}`, info)
  }

  error(tag: string, message: string, info?: object): void {
    this.winstonLogger.error(`[${tag}] ${message}`, info)
  }

  fatal(tag: string, message: string, info?: object): void {
    this.winstonLogger.emerg(`[${tag}] ${message}`, info)
  }
}
