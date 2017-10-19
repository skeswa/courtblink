import { Logger } from './types'

export class DevLogger implements Logger {
  debug(tag: string, message: string): void {
    console.log(`debug: [${tag}]`, message)
  }

  info(tag: string, message: string): void {
    console.log(`info: [${tag}]`, message)
  }

  warn(tag: string, message: string): void {
    console.log(`warn: [${tag}]`, message)
  }

  error(tag: string, message: string, error: any): void {
    console.log(`error: [${tag}] ${message}:`, error)
  }

  fatal(tag: string, message: string, error: any): void {
    console.log(`fatal: [${tag}] ${message}:`, error)
  }
}
