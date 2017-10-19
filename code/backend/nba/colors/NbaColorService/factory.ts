import { ApiService } from '../../../courtblink/api/ApiService'
import { HttpClient } from '../../../networking/HttpClient'
import { Logger } from '../../../util/Logger'

import { StaticallyDefinedNbaColorService } from './impl-static'
import { NbaColorService, NbaColorServiceCreationStrategy } from './types'

/**
 * Creates a new NBA color service.
 * @param strategy the creation strategy to use.
 * @param logger the logging utility to use.
 * @return the newly created NBA color service.
 */
export function createNbaColorService(
  strategy: NbaColorServiceCreationStrategy.UsingStaticColors,
  logger: Logger
): NbaColorService {
  return new StaticallyDefinedNbaColorService(logger)
}
