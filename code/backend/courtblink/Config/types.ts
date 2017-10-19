/**
 * Represents the externally customizable settings for the courtblink backend.
 */
export type Config = {
  /** Execution environment for the backend. */
  env: Env

  /** Port over which the backend will respond to HTTP requests. */
  port: number

  /** Name of the tor executable in the host OS. */
  torExecutableName: string
}

/** Strategy to use when reading the courtblink configuration. */
export enum ConfigReadingStrategy {
  /** Reads the configuration from environment variables. */
  FromEnvVars = 'FromEnvVars',
}

/** Different settings in which the backend will run. */
export enum Env {
  /**
   * Describes an environment where debuggability is key and fault tolerance is
   * minimal.
   */
  Dev,

  /**
   * Describes an environment where fault tolerance and speed are prioritized.
   */
  Prod,
}
