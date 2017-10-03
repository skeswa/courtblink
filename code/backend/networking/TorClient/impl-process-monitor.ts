import { Agent } from 'http'
import { ChildProcess } from 'mz/child_process'
import * as Socks from 'socks'
import { LoggerInstance } from 'winston'

import {
  createTorConfig,
  createTorConfigFile,
  deleteTorConfigFile,
  startTorProcess,
} from './helpers'
import { TorClient, TorConfig, TorConfigFileRef } from './types'

/** Manages and monitors a tor process. */
export class TorProcessMonitor implements TorClient {
  private connected: boolean
  private logger: LoggerInstance
  private socksAgent: Agent
  private torConfig: TorConfig
  private torConfigFileRef: TorConfigFileRef
  private torExecutableName: string
  private torProcess: ChildProcess
  private disconnectPromiseResolver: () => void

  constructor(logger: LoggerInstance, torExecutableName: string) {
    this.connected = false
    this.logger = logger
    this.torExecutableName = torExecutableName

    this.subscribeToProcessEvents()
  }

  async connect(): Promise<void> {
    if (this.connected) {
      throw new Error('Cannot connect to tor if already connected')
    }

    try {
      // Create the tor configuration before starting tor.
      this.torConfig = await createTorConfig()
      this.torConfigFileRef = await createTorConfigFile(this.torConfig)

      // Start the tor process.
      const torProcess = await startTorProcess(
        this.torExecutableName,
        this.torConfigFileRef
      )

      // Create a new agent using the tor configuration.
      this.socksAgent = new Socks.Agent(
        {
          proxy: {
            ipaddress: this.torConfig.socksHost,
            port: this.torConfig.socksPort,
            type: 5 /* Assume that tor is using SOCKS v5. */,
          },
        },
        /* secure */ false,
        /* rejectUnauthorized */ false
      )

      // Signal that this client is now connected.
      this.connected = true
    } catch (err) {
      throw new Error(`Failed to connect: ${err}`)
    }
  }

  /** @return true if this client is connected. */
  isConnected(): boolean {
    return this.connected
  }

  /** @return a tor-connected HTTP agent for use with HTTP clients. */
  agent(): Agent {
    if (!this.connected) {
      throw new Error('Cannot create an agent if not connected to tor')
    }

    return this.socksAgent
  }

  async switchIP(): Promise<void> {
    if (!this.connected) {
      throw new Error('Cannot switch IPs if not connected to tor')
    }

    // TODO(skeswa): implement this using the control port.
    // http://en.linuxreviews.org/HOWTO_use_the_Internet_anonymously_using_Tor_and_Privoxy#Some_tricks
    throw new Error('switchIP() is not implemented yet')
  }

  disconnect(): Promise<void> {
    if (!this.connected) {
      throw new Error('Cannot disconnect from tor if not connected to tor')
    }

    try {
      // Stop logging tor's output before killing it so it doesn't look
      // unexpected.
      this.unsubscribeFromProcessEvents()

      // Before we kill the process, create a promise that resolves when it exits.
      // This promise is resolved by `onTorProcessExit` via
      // `this.disconnectPromiseResolver`.
      const result = new Promise<void>(
        resolve => (this.disconnectPromiseResolver = resolve)
      )

      // Use SIGINT to kill tor nicely.
      this.torProcess.kill('SIGINIT')

      // TODO(skeswa): add a timeout here for backup - we don't want to get
      // caught here forever.

      // Return the promise created above.
      return result
    } catch (err) {
      throw new Error(`Failed to disconnect: ${err}`)
    }
  }

  private async onTorProcessExit(exitCode: number): Promise<void> {
    this.logger.debug(`[tor:stdout] tor exited with code ${exitCode}`)

    try {
      // Use SIGINT to kill tor nicely.
      this.torProcess.kill('SIGINIT')
    } catch (err) {
      this.logger.error(`Failed to kill the tor process: ${err}`)

      // Do not continue since we failed to stop tor.
      return
    }

    // Stop logging tor's output since that is no longer a thing.
    this.unsubscribeFromProcessEvents()

    // Signal that this client is no longer connected.
    this.connected = false

    // Get rid of the tor process instance since it is now useless.
    this.torProcess = null

    // It is now safe to resolve the disconnect promise (if it exists).
    if (this.disconnectPromiseResolver) {
      try {
        // This resolves the disconnect promise, which allows `this.disconnect`
        // to return.
        this.disconnectPromiseResolver()
      } catch (err) {
        this.logger.error(`Failed to resolve the disconnect resolver: ${err}`)
      } finally {
        // This resolver is now useless, so set it to null.
        this.disconnectPromiseResolver = null
      }
    }

    try {
      // It is now time to delete the tor configuration files.
      await deleteTorConfigFile(this.torConfigFileRef)
    } catch (err) {
      this.logger.error(`Failed to delete the tor configuration files: ${err}`)
    } finally {
      // The tor configuration is now useless, so null it.
      this.torConfig = null
      this.torConfigFileRef = null

      // Null the agent too since it depends on the tor configuration.
      this.socksAgent = null
    }

    // Trigger the exit handler if it exists.
    // TODO(skeswa): notify exit event subscribers.
  }

  private onTorProcessStderrData(data: string | Buffer) {
    this.logger.debug(`[tor:stderr] ${data}`)
  }

  private onTorProcessStdoutData(data: string | Buffer) {
    this.logger.debug(`[tor:stdout] ${data}`)
  }

  private subscribeToProcessEvents() {
    // Subscribe to standard out of the tor process.
    this.torProcess.stdout.on('data', this.onTorProcessStdoutData)

    // Subscribe to the standard error of the tor process.
    this.torProcess.stderr.on('data', this.onTorProcessStderrData)

    // Subscribe to the exit event of the tor process.
    this.torProcess.on('exit', this.onTorProcessExit)
  }

  private unsubscribeFromProcessEvents() {
    // Subscribe to standard out of the tor process.
    this.torProcess.stdout.removeListener('data', this.onTorProcessStdoutData)

    // Subscribe to the standard error of the tor process.
    this.torProcess.stderr.removeListener('data', this.onTorProcessStderrData)

    // Subscribe to the exit event of the tor process.
    this.torProcess.removeListener('exit', this.onTorProcessExit)
  }
}
