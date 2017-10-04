import { ContextualError } from 'util/ContextualError'

import { DevLogger } from './impl-dev'
import { ProdLogger } from './impl-prod'
import { Logger, LoggerCreationStrategy } from './types'

/**
 * Creates a new logger.
 * @param strategy the creation strategy to use.
 * @return the newly created logger.
 */
export function createLogger(strategy: LoggerCreationStrategy): Logger {
  switch (strategy) {
    case LoggerCreationStrategy.ForDev:
      return new DevLogger()

    case LoggerCreationStrategy.ForProd:
      return new ProdLogger()

    default:
      throw new ContextualError(
        `Could not create a logger with unknown strategy ${strategy}`
      )
  }
}
