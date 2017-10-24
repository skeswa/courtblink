import { ApiClientImpl } from './impl'
import { ApiClient } from './types'

/**
 * Creates a new `ApiClient`.
 * @return a new instance of `ApiClient`.
 */
export function createApiClient(): ApiClient {
  return new ApiClientImpl()
}
