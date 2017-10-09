import { Agent } from 'http'
import { LoggerInstance } from 'winston'

/** Manages and monitors a tor connection. */
export interface TorClient {
  /** Connects to the tor network. Throws an error if the operation fails. */
  connect(): Promise<void>

  /** @return true if this client is connected. */
  isConnected(): boolean

  /** @return a tor-connected HTTP agent for use with HTTP clients. */
  agent(): Agent

  /**
   * Requests a new IP address from tor. Throws an error if the operation fails
   * or if this client is not currently connected to the tor network.
   */
  switchIP(): Promise<void>

  /**
   * Disconnects from the tor network. Throws an error if the operation fails
   * or if this client is not currently connected to the tor network.
   */
  disconnect(): Promise<void>
}

export type TorConfig = {
  /** Port used to communicate with the tor client. */
  controlPort: number
  /** Host address on which tor is listening for socks connections. */
  socksHost: string
  /** Port on which tor is accepting socks connections. */
  socksPort: number
}

export type TorConfigFileRef = {
  /** Path to the config file. */
  configFilePath: string
  /** Path to the directory containing the config file. */
  configDirPath: string
}

/** Strategy for creating a new `TorClient`. */
export enum TorClientCreationStrategy {
  /** Uses the `tor` binary installed on the local system. */
  WithATorProcess = 'WithATorProcess',
}

export type TorProcessMonitorOptions = {
  /** Name of the `tor` command in the operating system. */
  torExecutableName: string
  /** Used by the monitor to log messages. */
  logger: LoggerInstance
  /** Callback triggered when tor exits unexpectedly. */
  onExit: () => void
}
