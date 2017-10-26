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
    this.winstonLogger.debug(this.timeStamp(), tag, message)
  }

  info(tag: string, message: string): void {
    this.winstonLogger.info(this.timeStamp(), tag, message)
  }

  warn(tag: string, message: string): void {
    this.winstonLogger.warn(this.timeStamp(), tag, message)
  }

  error(tag: string, message: string, error: any): void {
    this.winstonLogger.error(this.timeStamp(), tag, message)
  }

  fatal(tag: string, message: string, error: any): void {
    this.winstonLogger.emerg(this.timeStamp(), tag, message)
  }

  /** @return the current timestamp. */
  private timeStamp(): string {
    const now = new Date()
    return (
      now.getFullYear() +
      '/' +
      (now.getMonth() + 1) +
      '/' +
      now.getDate() +
      ' ' +
      now.getHours() +
      ':' +
      now.getMinutes() +
      ':' +
      now.getMilliseconds()
    )
  }
}
