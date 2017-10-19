import {
  readEnvFromEnvVars,
  readPortFromEnvVars,
  readTorExecutableNameFromEnvVars,
} from './helpers'
import { Config, ConfigReadingStrategy, Env } from './types'

/** Reads the configuration using the specified strategy. */
export function readConfig(strategy: ConfigReadingStrategy): Config {
  switch (strategy) {
    case ConfigReadingStrategy.FromEnvVars:
      return {
        env: readEnvFromEnvVars(),
        port: readPortFromEnvVars(),
        torExecutableName: readTorExecutableNameFromEnvVars(),
      }

    default:
      throw new Error(
        `Could not read config with unknown strategy "${strategy}"`
      )
  }
}
