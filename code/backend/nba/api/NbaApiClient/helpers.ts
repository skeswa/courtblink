import { parseString } from 'xml2js'

/** Outlines the structure of an NBA RSS feed after it is parsed. */
export type NbaRssFeed = {
  rss?: {
    channel?: {
      item?: {
        title?: string[]
        link?: string[]
        description?: string[]
        author?: string[]
        enclosure?: {
          $: {
            url: string
            type: string
          }
        }[]
      }[]
    }[]
  }
}

/**
 * @param the array for which the first element will be returned.
 * @return the first element of the given array.
 */
export function first<T>(arr: T[] | undefined): T | undefined {
  return !arr || arr.length < 1 ? undefined : arr[0]
}

/**
 * Parses XML into the structure of an NBA RSS feed.
 * @param xml xml string to be parsed.
 * @return object representation of `xml`.
 */
export function parseNbaRssFeed(xml: string): Promise<NbaRssFeed> {
  return new Promise((resolve, reject) => {
    try {
      parseString(xml, (err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    } catch (err) {
      reject(err)
    }
  })
}
