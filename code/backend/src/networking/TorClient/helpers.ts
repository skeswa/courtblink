import { ChildProcess, spawn as spawnProcess } from 'mz/child_process'
import {
  mkdtemp as makeTempDir,
  rmdir as deleteDir,
  unlink as deleteFile,
  writeFile,
} from 'mz/fs'
import { tmpdir } from 'os'
import { join as joinPaths } from 'path'
import { find as findPorts } from 'portastic'

import { ContextualError } from '../../util/ContextualError'

import { TorConfig, TorConfigFileRef } from './types'

/** Flag used by tor to identify the config file path. */
const torConfigFilePathFlag = '-f'

export async function startTorProcess(
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
    let torProcessError: Error
    const onError = (err: Error) => {
      torProcessError = err
    }
    torProcess.on('error', onError)

    // Listen for the process failing within the grace period.
    await pause(200 /* 0.2 second grace period */)
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
  `
    )

    return { configDirPath, configFilePath }
  } catch (err) {
    throw new ContextualError('Failed to write the tor config file', err)
  }
}

export async function deleteTorConfigFile(
  ref: TorConfigFileRef
): Promise<void> {
  try {
    // First delete the configuration file.
    await deleteFile(ref.configFilePath)

    // Then delete the enclosing directory.
    await deleteDir(ref.configDirPath)
  } catch (err) {
    throw new ContextualError('Failed to delete the tor config file', err)
  }
}

export async function createTorConfig(): Promise<TorConfig> {
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

    // Assume that loopback is the host for the tor proxy.
    const controlPort = ports[0]
    const socksPort = ports[1]
    const socksHost = '127.0.0.1'

    return { controlPort, socksPort, socksHost }
  } catch (err) {
    throw new ContextualError('Failed to create tor config', err)
  }
}

function pause(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
