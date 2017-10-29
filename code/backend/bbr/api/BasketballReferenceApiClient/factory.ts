import { HttpClient } from '../../../networking/HttpClient'
import { Logger } from '../../../util/Logger'

import {
  BasketballReferenceApiClient,
  BasketballReferenceApiClientCreationStrategy,
} from './types'
import { ScrapingBasketballReferenceApiClient } from './impl-scraping'

/**
 * Creates a new Basketball Reference API client.
 * @param strategy the creation strategy to use.
 * @param logger the logging utility to use.
 * @param HttpClient the client used to send HTTP requests.
 * @return the newly created NBA API client.
 */
export function createNbaApiClient(
  strategy: BasketballReferenceApiClientCreationStrategy.UsingScrapedWebPages,
  logger: Logger,
  httpClient: HttpClient
): BasketballReferenceApiClient {
  return new ScrapingBasketballReferenceApiClient(httpClient, logger)
}
