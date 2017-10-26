import { ApiService } from '../../../courtblink/api/ApiService'
import { Clock } from '../../../util/Clock'
import { Logger } from '../../../util/Logger'

import { MinuteByMinuteApiTrafficSimulator } from './impl-minute-by-minute'
import {
  ApiTrafficSimulator,
  ApiTrafficSimulatorCreationStrategy,
} from './types'

/**
 * Creates a new API traffic simulator.
 * @param apiService API service for which traffic will be created.
 * @param clock time utility.
 * @param logger logging utility.
 */
export function createApiTrafficSimulator(
  strategy: ApiTrafficSimulatorCreationStrategy,
  apiService: ApiService,
  clock: Clock,
  logger: Logger
): ApiTrafficSimulator {
  return new MinuteByMinuteApiTrafficSimulator(apiService, clock, logger)
}
