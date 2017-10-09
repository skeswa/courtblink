import fetch from 'node-fetch'

import { HttpClient } from './types'

export class NormalHttpClient implements HttpClient {
  async get(url: string): Promise<any> {
    const response = await fetch(url, {
      method: 'GET',
      follow: 2 /* Follow at most 2 redirects - fail fast. */,
      timeout: 3000 /* No request should take longer than 3s - fail fast */,
    })
    const body = await response.json()
    return body
  }
}
