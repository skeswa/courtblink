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

  error(tag: string, message: string): void {
    console.log(`error: [${tag}]`, message)
  }

  fatal(tag: string, message: string): void {
    console.log(`fatal: [${tag}]`, message)
  }
}
