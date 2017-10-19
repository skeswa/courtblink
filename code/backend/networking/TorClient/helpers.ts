import {
  ChildProcess,
  exec as execProcess,
  spawn as spawnProcess,
} from 'mz/child_process'
import {
  mkdtemp as makeTempDir,
  rmdir as deleteDir,
  unlink as deleteFile,
  writeFile,
} from 'mz/fs'
import { connect as connectViaTcp } from 'net'
import { tmpdir } from 'os'
import { join as joinPaths } from 'path'
import { find as findPorts } from 'portastic'

import { Clock } from '../../util/Clock'
import { ContextualError } from 'common/util/ContextualError'

import { TorConfig, TorConfigFileRef } from './types'

/** Flag used by tor to identify the config file path. */
const torConfigFilePathFlag = '-f'

/** Flag used by tor to to hash a password. */
const torHashedPasswordFlag = '--hash-password'

/** Valid characters for a generated tor password. */
const torPasswordChars = 'abcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Kicks off the tor process.
 * @param clock time utility.
 * @param torExecutableName name of the tor executable.
 * @param torConfigFileRef reference to the tor configuration file.
 * @return the tor process object.
 */
export async function startTorProcess(
  clock: Clock,
  torExecutableName: string,
  torConfigFileRef: TorConfigFileRef
): Promise<ChildProcess> {
  try {
    // Start the tor process.
    const torProcess = spawnProcess(torExecutableName, [
      /* e.g. "-f" */ torConfigFilePathFlag,
      /* e.g. "/tmp/123/torrc" */ torConfigFileRef.configFilePath,
    ])

    // Temporarily bind to the error event of the process.
    let torProcessError: Error | undefined
    const onError = (err: Error) => {
      torProcessError = err
    }
    torProcess.on('error', onError)

    // Listen for the process failing within the grace period.
    await clock.wait(200 /* 0.2 second grace period */)
    if (torProcessError) {
      throw new ContextualError(
        `The tor process failed within the grace period`,
        torProcessError
      )
    }

    // Unbind from the tor process to prevent a memory leak, and because this
    // function (the factory function) does not care anymore what happens to
    // this process.
    torProcess.removeListener('error', onError)

    return torProcess
  } catch (err) {
    throw new ContextualError('Failed to start the tor process', err)
  }
}

/**
 * Creates a tor configuration file.
 * @param config the tor configuration to write to a file.
 * @return reference to the tor configuration file.
 */
export async function createTorConfigFile(
  config: TorConfig
): Promise<TorConfigFileRef> {
  try {
    const configDirPath = await makeTempDir(
      /* prefix */ joinPaths(tmpdir(), 'courtblink-tor-config'),
      /* encoding */ 'utf8'
    )
    const configFilePath = joinPaths(configDirPath, 'torrc')

    // Create the config file using `config`.
    await writeFile(
      configFilePath,
      `
    SocksPort ${config.socksHost}:${config.socksPort}
    ControlPort ${config.controlPort}
    HashedControlPassword ${config.hashedControlPortPassword}
  `
    )

    return { configDirPath, configFilePath }
  } catch (err) {
    throw new ContextualError('Failed to write the tor config file', err)
  }
}

/**
 * Deletes a tor configuration file.
 * @param torConfigFileRef reference to the tor configuration file.
 */
export async function deleteTorConfigFile(
  torConfigFileRef: TorConfigFileRef
): Promise<void> {
  try {
    // First delete the configuration file.
    await deleteFile(torConfigFileRef.configFilePath)

    // Then delete the enclosing directory.
    await deleteDir(torConfigFileRef.configDirPath)
  } catch (err) {
    throw new ContextualError('Failed to delete the tor config file', err)
  }
}

/**
 * Creates the tor configuration.
 * @param torExecutableName name of the tor executable.
 * @return tor configuration.
 */
export async function createTorConfig(
  torExecutableName: string
): Promise<TorConfig> {
  try {
    // Find a list of ports that we can use to start tor.
    const ports = await findPorts({ min: 5000, max: 10000, retrieve: 2 })

    // Exit if there is an invalid number of available ports.
    if (ports.length < 2) {
      throw new Error(
        'insufficient number of TCP ports are available for the tor ' +
          'monitor to start tor'
      )
    }

    // Create and hash the control port password.
    const controlPortPassword = generatePassword(10)
    const hashedControlPortPassword = await hashPassword(
      controlPortPassword,
      torExecutableName
    )

    // Assume that loopback is the host for the tor proxy.
    const controlPort = ports[0]
    const socksPort = ports[1]
    const socksHost = '127.0.0.1'

    return {
      controlPort,
      controlPortPassword,
      hashedControlPortPassword,
      socksPort,
      socksHost,
    }
  } catch (err) {
    throw new ContextualError('Failed to create tor config', err)
  }
}

/**
 * Generates a random alphanumeric password.
 * @param length how the long the password should be.
 * @return a random alphanumeric password.
 */
export function generatePassword(length: number): string {
  const chars: string[] = []

  // Put a bunch of nradom characters into the `chars` array.
  for (let i = 0; i < length; i++) {
    chars.push(
      torPasswordChars.charAt(
        Math.floor(Math.random() * torPasswordChars.length)
      )
    )
  }

  return chars.join('')
}

/**
 * Hashes the given password using tor's password hashing feature.
 * @param password password to be hashed.
 * @param torExecutableName name of the tor executable.
 * @return the hashed password.
 */
export function hashPassword(
  password: string,
  torExecutableName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    execProcess(
      `${torExecutableName} ${torHashedPasswordFlag} ${password}`,
      (err, stderr, stdout) => {
        if (err) {
          return reject(
            new ContextualError('Failed to hash the tor password', err)
          )
        }

        // Hashed password is output to stderr.
        return resolve(stderr.trim())
      }
    )
  })
}

/**
 * Communicates with tor over its control port.
 * @param commands all the control protocol commands to send.
 * @param torIP the IP address of the tor client.
 * @param torControlPort control port for the tor process.
 * @return all data output from the telnet session.
 */
export function sendDataOverControlPort(
  commands: string[],
  torIP: string,
  torControlPort: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Establish a TCP connection, and then write the commands over TCP.
    const conn = connectViaTcp(
      {
        host: torIP,
        port: torControlPort,
      },
      () => conn.write(commands.join('\n').concat('\n'))
    )

    // Look out for an error. This is should reject the promise.
    conn.on('error', err =>
      reject(
        new ContextualError(
          `Failed to send commands to the command port: ${data.join('')}`,
          err
        )
      )
    )

    // Horde connection related data.
    const data: string[] = []
    conn.on('data', chunk => data.push(chunk.toString()))

    // When the connection terminates, ship all the logged data back over.
    conn.on('end', () => resolve(data.join('')))
  })
}
