import { Agent } from 'http'
import { ChildProcess } from 'mz/child_process'
import * as Socks from 'socks'

import { ContextualError } from '../../util/ContextualError'
import { Logger } from '../../util/Logger'

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
  private logger: Logger
  private socksAgent: Agent
  private torConfig: TorConfig
  private torConfigFileRef: TorConfigFileRef
  private torExecutableName: string
  private torProcess: ChildProcess

  constructor(logger: Logger, torExecutableName: string) {
    this.connected = false
    this.logger = logger
    this.torExecutableName = torExecutableName
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
      this.torProcess = torProcess

      // Subscribe to events not that a connection has been established.
      this.subscribeToProcessEvents()
    } catch (err) {
      throw new ContextualError('Failed to connect', err)
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

  disconnect(): void {
    if (!this.connected) {
      throw new Error('Cannot disconnect from tor if not connected to tor')
    }

    try {
      // Stop logging tor's output before killing it so it doesn't look
      // unexpected.
      this.unsubscribeFromProcessEvents()

      // Use SIGINT to kill tor nicely.
      this.torProcess.kill('SIGINT')
    } catch (err) {
      throw new ContextualError('Failed to disconnect', err)
    }
  }

  private async onTorProcessExit(exitCode: number): Promise<void> {
    this.logger.debug('tor:stdout', `tor exited with code ${exitCode}`)

    try {
      // Use SIGINT to kill tor nicely.
      this.torProcess.kill('SIGINIT')
    } catch (err) {
      this.logger.error('tor:procmon', `Failed to kill the tor process: ${err}`)

      // Do not continue since we failed to stop tor.
      return
    }

    // Stop logging tor's output since that is no longer a thing.
    this.unsubscribeFromProcessEvents()

    // Signal that this client is no longer connected.
    this.connected = false

    // Get rid of the tor process instance since it is now useless.
    this.torProcess = null

    try {
      // It is now time to delete the tor configuration files.
      await deleteTorConfigFile(this.torConfigFileRef)
    } catch (err) {
      this.logger.error(
        'tor:procmon',
        `Failed to delete the tor configuration files: ${err}`
      )
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
    this.logger.debug('tor:stderr', data.toString())
  }

  private onTorProcessStdoutData(data: string | Buffer) {
    this.logger.debug('tor:stdout', data.toString())
  }

  private subscribeToProcessEvents() {
    // Subscribe to standard out of the tor process.
    this.torProcess.stdout.on('data', data => this.onTorProcessStdoutData(data))

    // Subscribe to the standard error of the tor process.
    this.torProcess.stderr.on('data', data => this.onTorProcessStderrData(data))

    // Subscribe to the exit event of the tor process.
    this.torProcess.on('exit', exitCode => this.onTorProcessExit(exitCode))
  }

  private unsubscribeFromProcessEvents() {
    this.torProcess.stdout.removeAllListeners()
    this.torProcess.stderr.removeAllListeners()
    this.torProcess.removeAllListeners()
  }
}
