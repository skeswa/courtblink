import { defaultEnv, defaultPort, defaultTorExecutableName } from './defaults'
import { Env } from './types'

/**
 * Reads `Config#env` from environment variables.
 * @return the value for `Config#env`.
 */
export function readEnvFromEnvVars(): Env {
  if (
    process.env.NODE_ENV === 'prod' ||
    process.env.NODE_ENV === 'production'
  ) {
    return Env.Prod
  }

  if (
    process.env.NODE_ENV === 'dev' ||
    process.env.NODE_ENV === 'development'
  ) {
    return Env.Dev
  }

  return defaultEnv
}

/**
 * Reads `Config#port` from environment variables.
 * @return the value for `Config#port`.
 */
export function readPortFromEnvVars(): number {
  if (process.env.PORT && parseInt(process.env.PORT || '')) {
    return parseInt(process.env.PORT || '')
  }

  return defaultPort
}

/**
 * Reads `Config#torExecutableName` from environment variables.
 * @return the value for `Config#torExecutableName`.
 */
export function readTorExecutableNameFromEnvVars(): string {
  return process.env.TOR_EXE || defaultTorExecutableName
}
