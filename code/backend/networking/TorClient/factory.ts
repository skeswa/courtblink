import { LoggerInstance } from 'winston'

import { TorProcessMonitor } from './impl-process-monitor'
import {
  TorClient,
  TorClientCreationStrategy,
  TorProcessMonitorOptions,
} from './types'

/**
 * Creates a new tor client.
 * @param strategy the creation strategy to use.
 * @param logger the logging utility to use.
 * @param torExecutableName the name of the tor executable within this system.
 * @return the newly created tor client.
 */
export function createTorClient(
  strategy: TorClientCreationStrategy.WithATorProcess,
  logger: LoggerInstance,
  torExecutableName: string = 'tor'
): TorClient {
  return new TorProcessMonitor(logger, torExecutableName)
}
