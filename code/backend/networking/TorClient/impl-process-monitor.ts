import { Agent } from 'http'
import { ChildProcess } from 'mz/child_process'
import * as Socks from 'socks'

import { Clock } from '../../util/Clock'
import { Logger } from '../../util/Logger'
import { ContextualError } from 'common/util/ContextualError'

import {
  createTorConfig,
  createTorConfigFile,
  deleteTorConfigFile,
  sendDataOverControlPort,
  startTorProcess,
} from './helpers'
import { TorClient, TorConfig, TorConfigFileRef } from './types'

// Log tags identify log messages from this module.
const tag = 'tor:procmon'
const torStdoutTag = `${tag}:stdout`
const torStderrTag = `${tag}:stderr`

// Message that gets logged to stdout by the tor process when tor is ready.
const successMessage = 'Tor has successfully opened a circuit'

/** Manages and monitors a tor process. */
export class TorProcessMonitor implements TorClient {
  private clock: Clock
  private connected: boolean
  private declareTorConnected: (() => void) | null
  private logger: Logger
  private socksAgent: Agent | null
  private torConfig: TorConfig | null
  private torConfigFileRef: TorConfigFileRef | null
  private torExecutableName: string
  private torProcess: ChildProcess | null

  constructor(clock: Clock, logger: Logger, torExecutableName: string) {
    this.clock = clock
    this.connected = false
    this.declareTorConnected = null
    this.logger = logger
    this.torConfig = null
    this.torConfigFileRef = null
    this.torExecutableName = torExecutableName
  }

  async connect(): Promise<void> {
    if (this.connected) {
      throw new Error('Cannot connect to tor if already connected')
    }

    this.logger.info(tag, 'Connecting to tor')

    try {
      // Create the tor configuration before starting tor.
      this.torConfig = await createTorConfig(this.torExecutableName)
      this.torConfigFileRef = await createTorConfigFile(this.torConfig)

      // Start the tor process.
      const torProcess = await startTorProcess(
        this.clock,
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

      this.logger.info(
        tag,
        'Waiting for tor to form a circuit with the tor network'
      )

      // Wait until tor connects to declare this client connected.
      await this.waitForTorToBeReady()
    } catch (err) {
      throw new ContextualError('Failed to connect', err)
    }
  }

  /** @return true if this client is connected. */
  isConnected(): boolean {
    return this.connected
  }

  /** @return a tor-connected HTTP agent for use with HTTP clients. */
  agent(): Agent | undefined {
    if (!this.connected) {
      throw new Error('Cannot create an agent if not connected to tor')
    }

    return this.socksAgent ? this.socksAgent : undefined
  }

  async switchIP(): Promise<void> {
    if (!this.connected || !this.torConfig) {
      throw new Error('Cannot switch IPs if not connected to tor')
    }

    this.logger.info(tag, 'Requesting a new IP from tor via telnet')

    try {
      await sendDataOverControlPort(
        [
          // Grants this connection access to the control protocol.
          `AUTHENTICATE "${this.torConfig.controlPortPassword}"`,
          // Request session renewal from tor.
          'SIGNAL NEWNYM',
          // Closes the connection.
          'QUIT',
        ],
        /* torIP */ '127.0.0.1',
        this.torConfig.controlPort
      )

      this.logger.debug(
        tag,
        `Requested a new IP address with the tor control protocol ` +
          `successfully - will now give tor 2 seconds to catch its breath`
      )
    } catch (err) {
      throw new ContextualError(
        'Failed to request a new IP address from tor',
        err
      )
    }

    // Let tor catch its breath - we requested a completely clean circuit.
    await this.clock.wait(2000)
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      throw new Error('Cannot disconnect from tor if not connected to tor')
    }

    this.logger.info(tag, 'Disconnecting from tor')

    try {
      // Stop logging tor's output before killingß it so it doesn't look
      // unexpected.
      this.unsubscribeFromProcessEvents()

      // Use SIGINT to kill tor nicely.
      if (this.torProcess) {
        try {
          this.torProcess.kill('SIGINT')
        } catch (err) {
          this.logger.error(tag, 'Failed to kill the tor process', err)
        }
      }

      // Handle the exit.
      await this.onTorProcessExit(
        -1 /* Use this code to meam that we killed it */
      )
    } catch (err) {
      throw new ContextualError('Failed to disconnect', err)
    }
  }

  /** Called when the tor process exits. */
  private async onTorProcessExit(exitCode: number): Promise<void> {
    this.logger.debug('tor:stdout', `tor exited with code ${exitCode}`)

    // Stop logging tor's output since that is no longer a thing.
    this.unsubscribeFromProcessEvents()

    // Signal that this client is no longer connected.
    this.connected = false

    // Get rid of the tor process instance since it is now useless.
    this.torProcess = null

    try {
      // It is now time to delete the tor configuration files.
      if (this.torConfigFileRef) {
        await deleteTorConfigFile(this.torConfigFileRef)
      }
    } catch (err) {
      this.logger.error(
        tag,
        'Failed to delete the tor configuration files',
        err
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

  /** Called when there is a new stderr message from the tor process. */
  private onTorProcessStderrData(data: string | Buffer) {
    this.logger.debug(torStderrTag, data.toString())
  }

  /** Called when there is a new stdout message from the tor process. */
  private onTorProcessStdoutData(data: string | Buffer) {
    const message = data.toString()

    // Check to see if the log message from tor has indicated that tor is ready.
    if (this.declareTorConnected && message.indexOf(successMessage) !== -1) {
      this.declareTorConnected()
    }

    this.logger.debug(torStdoutTag, data.toString())
  }

  /** Creates and binds all of the tor process event handlers. */
  private subscribeToProcessEvents() {
    // Exit early if there is no tor process.
    if (!this.torProcess) return

    // Subscribe to standard out of the tor process.
    this.torProcess.stdout.on('data', data => this.onTorProcessStdoutData(data))

    // Subscribe to the standard error of the tor process.
    this.torProcess.stderr.on('data', data => this.onTorProcessStderrData(data))

    // Subscribe to the exit event of the tor process.
    this.torProcess.on('exit', exitCode => this.onTorProcessExit(exitCode))
  }

  /** Removes all of the tor process event handlers. */
  private unsubscribeFromProcessEvents() {
    // Exit early if there is no tor process.
    if (!this.torProcess) return

    this.torProcess.stdout.removeAllListeners()
    this.torProcess.stderr.removeAllListeners()
    this.torProcess.removeAllListeners()
  }

  // TODO(skeswa): add a reasonable timeout.
  /** Function that waits until `declareTorConnected` resolves. */
  private waitForTorToBeReady(): Promise<void> {
    if (this.declareTorConnected) {
      return Promise.reject(
        '`declareTorConnected` was already set; could not create a new promise'
      )
    }

    // Creates a promise around the `declareTorConnected` function.
    return new Promise(
      resolve =>
        (this.declareTorConnected = () => {
          // `declareTorConnected` needs to clean itself up and then resolve
          // this promise.
          this.declareTorConnected = null

          resolve()

          // Log that the tor client is now ready to accept connections.
          this.logger.info(
            tag,
            'Tor is now ready to accept incoming connections'
          )
        })
    )
  }
}
