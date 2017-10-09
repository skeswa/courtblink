import {
  Logger as WinstonLogger,
  LoggerInstance as WinstonLoggerInstance,
  transports as WinstonTransports,
} from 'winston'

import { Logger } from './types'

export class ProdLogger implements Logger {
  private winstonLogger: WinstonLoggerInstance

  constructor() {
    this.winstonLogger = new WinstonLogger({
      transports: [new WinstonTransports.Console()],
    })

    // Make sure that we get to see debug messages.
    this.winstonLogger.level = 'debug'
  }

  debug(tag: string, message: string): void {
    this.winstonLogger.debug(`[${tag}] ${message}`)
  }

  info(tag: string, message: string): void {
    this.winstonLogger.info(`[${tag}] ${message}`)
  }

  warn(tag: string, message: string): void {
    this.winstonLogger.warn(`[${tag}] ${message}`)
  }

  error(tag: string, message: string, error: any): void {
    this.winstonLogger.error(`[${tag}] ${message}`, error)
  }

  fatal(tag: string, message: string, error: any): void {
    this.winstonLogger.emerg(`[${tag}] ${message}`, error)
  }
}
