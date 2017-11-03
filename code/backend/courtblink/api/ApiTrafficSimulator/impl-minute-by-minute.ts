import bind from 'bind-decorator'

import { yyyymmdd } from 'common/util/date/helpers'

import { ApiService } from '../../../courtblink/api/ApiService'
import { Cancellable, Clock } from '../../../util/Clock'
import { Logger } from '../../../util/Logger'

import { ApiTrafficSimulator } from './types'

// Log tag that identifies this module.
const tag = 'courtblink:api:traffic:simulator'

// One minute in milliseconds.
const minutes = 1 * 60 * 1000

/** Simulates traffic to the API on a minute-by-minute basis. */
export class MinuteByMinuteApiTrafficSimulator implements ApiTrafficSimulator {
  private apiService: ApiService
  private cancellables: Cancellable[] | undefined
  private clock: Clock
  private logger: Logger

  /**
   * Creates a new `ApiTrafficSimulator`.
   * @param apiService API service for which traffic will be created.
   * @param clock time utility.
   * @param logger logging utility.
   */
  constructor(apiService: ApiService, clock: Clock, logger: Logger) {
    this.apiService = apiService
    this.clock = clock
    this.logger = logger
  }

  /** Simulates traffic to the API splash endpoint referencing today. */
  @bind
  async simulateTrafficForTodaysSplash(): Promise<void> {
    this.logger.info(
      tag,
      'Simulating traffic to the API splash endpoint referencing today'
    )

    const today = new Date()

    try {
      await this.apiService.fetchSplashData(yyyymmdd(today))
    } catch (err) {
      this.logger.error(
        tag,
        'Failed to simulate traffic to the API splash endpoint ' +
          'referencing today',
        err
      )
    }
  }

  /** Simulates traffic to the API splash endpoint referencing tomorrow. */
  @bind
  async simulateTrafficForTomorrowsSplash(): Promise<void> {
    this.logger.info(
      tag,
      'Simulating traffic to the API splash endpoint referencing tomorrow'
    )

    const today = new Date()
    const tomorrow = new Date(today)

    // `setDate` supports negative values.
    tomorrow.setDate(today.getDate() + 1)

    try {
      await this.apiService.fetchSplashData(yyyymmdd(tomorrow))
    } catch (err) {
      this.logger.error(
        tag,
        'Failed to simulate traffic to the API splash endpoint ' +
          'referencing tomorrow',
        err
      )
    }
  }

  /** Simulates traffic to the API splash endpoint referencing yesterday. */
  @bind
  async simulateTrafficForYesterdaysSplash(): Promise<void> {
    this.logger.info(
      tag,
      'Simulating traffic to the API splash endpoint referencing yesterday'
    )

    const today = new Date()
    const yesterday = new Date(today)

    // `setDate` supports negative values.
    yesterday.setDate(today.getDate() - 1)

    try {
      await this.apiService.fetchSplashData(yyyymmdd(yesterday))
    } catch (err) {
      this.logger.error(
        tag,
        'Failed to simulate traffic to the API splash endpoint ' +
          'referencing yesterday',
        err
      )
    }
  }

  start(): void {
    if (this.cancellables) {
      throw new Error(
        'Cannot start the traffic simulator if it has already been started'
      )
    }

    this.logger.info(
      tag,
      'Scheduling fake API traffic on a minute-by-minute basis'
    )

    this.cancellables = [
      this.clock
        .repeat(this.simulateTrafficForTodaysSplash)
        .every(1.5 * minutes /* interval */),
      this.clock
        .repeat(this.simulateTrafficForTomorrowsSplash)
        .every(1.5 * minutes /* interval */, 0.5 * minutes /* delay */),
      this.clock
        .repeat(this.simulateTrafficForYesterdaysSplash)
        .every(1.5 * minutes /* interval */, 1 * minutes /* delay */),
    ]
  }

  stop(): void {
    if (!this.cancellables) {
      throw new Error(
        'Cannot stop the traffic simulator if it has not been started'
      )
    }

    this.logger.info(tag, 'Halting scheduled API traffic')

    this.cancellables.forEach(cancellable => cancellable.cancel())
    this.cancellables = undefined
  }
}
