import fetch from 'node-fetch'

import { TorClient } from '../TorClient'
import { HttpClient } from './types'

export class ProxiedHttpClient implements HttpClient {
  private torClient: TorClient;

  constructor(torClient: TorClient) {
    this.torClient = torClient
  }

  async get(url: string): Promise<any> {
    const response = await fetch(url, {
      method: 'GET',
      follow: 2 /* Follow at most 2 redirects - fail fast. */,
      timeout: 3000 /* No request should take longer than 3s - fail fast */,
      agent: this.torClient.agent(),
    })
    const body = await response.json()
    return body
  }
}
