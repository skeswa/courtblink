import * as debug from 'debug'

import { ISplashData, SplashData } from 'common/api/schema/generated'
import { ContextualError } from 'common/util/ContextualError'
import { yyyymmdd } from 'common/util/date/helpers'

import { ApiClient } from './types'

/** Default implementation for the courtblink API client. */
export class ApiClientImpl implements ApiClient {
  private log: debug.IDebugger = debug('api:client')

  async fetchSplashData(date: Date): Promise<ISplashData> {
    const dateStr = yyyymmdd(date)

    this.log(`Fetching splash data for "${dateStr}"`)

    try {
      const response = await fetch(`/api/splash/${dateStr}`)
      const responseData = await response.arrayBuffer()
      const responseDataBuffer = new Uint8Array(responseData)
      const splashData = SplashData.decode(responseDataBuffer)
      return splashData
    } catch (err) {
      throw new ContextualError(
        `Failed to fetch splash data for date "${dateStr}"`,
        err
      )
    }
  }
}
