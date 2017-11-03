import { ServerResponse } from 'http'
import { Writer } from 'protobufjs'

import { ServerEndpointRoutes } from './types'

// Encoding for serialized protos.
const protoEncoding = 'binary'

// Headers that indicate arbitrary binary data is travelling over the wire.
const protoHeaders = {
  'Content-Type': 'application/octet-stream',
}

// Regular expression for the suffix of the game news path.
const gameNewsPathSuffixRegex = /\/([0-9]{10})@([0-9]{10})/

// Regular expression for the suffix of the splash path.
const splashPathSuffixRegex = /\/([0-9]{8})/

/** Tuple of game team url names. */
export type TeamIds = {
  awayTeamId: string
  homeTeamId: string
}

/**
 * Extracts the team ids from the provided path. This method assumes that the
 * provided path matches the game news route.
 * @param path path from which the date will be extracted.
 * @param endpointRoutes routes to use for each server endpoint.
 * @return the extracted date.
 */
export function extractTeamIdsFromGameNewsRequestPath(
  path: string,
  endpointRoutes: ServerEndpointRoutes
): TeamIds {
  const pathSuffix = gameNewsPathSuffixRegex.exec(
    path.substr(endpointRoutes.gameNews.length)
  )

  // Exit early if the regular expression couldn't parse `path`.
  if (!pathSuffix) throw new Error(`Failed to parse path "${path}"`)

  return { awayTeamId: pathSuffix[1], homeTeamId: pathSuffix[2] }
}

/**
 * Extracts a date from the YYYYMMDD-formatted date in the provided path. This
 * method assumes that the provided path matches the splash route.
 * @param path path from which the date will be extracted.
 * @param endpointRoutes routes to use for each server endpoint.
 * @return the extracted date.
 */
export function extractYYYYMMDDFromSplashRequestPath(
  path: string,
  endpointRoutes: ServerEndpointRoutes
): string {
  const pathSuffix = splashPathSuffixRegex.exec(
    path.substr(endpointRoutes.splash.length)
  )

  // Exit early if the regular expression couldn't parse `path`.
  if (!pathSuffix) throw new Error(`Failed to parse path "${path}"`)

  return pathSuffix[1]
}

/**
 * Returns true if the provided path refers to the game news route.
 * @param path path to test.
 * @param endpointRoutes routes to use for each server endpoint.
 * @return true if the provided path refers to the splash route.
 */
export function isGameNewsRoute(
  path: string,
  endpointRoutes: ServerEndpointRoutes
): boolean {
  const routePrefix = endpointRoutes.gameNews

  // Ensure that the path starts with the right endpoint.
  if (!path.startsWith(routePrefix)) return false

  return gameNewsPathSuffixRegex.test(path.substr(routePrefix.length))
}

/**
 * Returns true if the provided path refers to the splash route.
 * @param path path to test.
 * @param endpointRoutes routes to use for each server endpoint.
 * @return true if the provided path refers to the splash route.
 */
export function isSplashRoute(
  path: string,
  endpointRoutes: ServerEndpointRoutes
): boolean {
  const routePrefix = endpointRoutes.splash

  // Ensure that the path starts with the right endpoint.
  if (!path.startsWith(routePrefix)) return false

  return splashPathSuffixRegex.test(path.substr(routePrefix.length))
}

/**
 * Responds to an HTTP request with a serialized proto.
 * @param proto the proto to repond with.
 * @param encode the function that serializes the concerned proto.
 * @param response represents the HTTP response.
 */
export function respondWithProto<T>(
  proto: T,
  encode: (message: T, writer?: Writer) => Writer,
  response: ServerResponse
): void {
  response.writeHead(200, protoHeaders)
  response.end(encode(proto).finish(), protoEncoding)
}
