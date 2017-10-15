import { Env } from './types'

/**
 * Default to dev because the environment variable not being set is more likely
 * while in a development setting.
 */
export const defaultEnv = Env.Dev

/** Default to 3001 since in development webpack occupies port 3000. */
export const defaultPort = 3001

/** Tor is usually installed as "tor" - so that is the default. */
export const defaultTorExecutableName = 'tor'
