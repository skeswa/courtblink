import { ServerResponse } from 'http'
import { Writer } from 'protobufjs'

import { ServerEndpointRoutes } from './types'

// Encoding for serialized protos.
const protoEncoding = 'binary'

// Headers that indicate arbitrary binary data is travelling over the wire.
const protoHeaders = {
  'Content-Type': 'application/octet-stream',
}

// Constant repsenting the forward slash character.
const slash = '/'

/**
 * Extracts a date from the YYYYMMDD-formatted date in the provided path. This
 * method assumes that the provided path matches the splash route.
 * @param path path from which the date will be extracted.
 * @param endpointRoutes routes to use for each server endpoint.
 * @return the extracted date.
 */
export function extractYYYYMMDDFromSplashRequest(
  path: string,
  endpointRoutes: ServerEndpointRoutes
): string {
  return path.substr(endpointRoutes.splash.length + 1, 8)
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

  // Ensure that the path starts with the splash endpoint route.
  if (!path.startsWith(routePrefix)) return false

  // Ensure that the path is the prefix + a slash + yyyymmdd in length.
  const routePrefixLength = routePrefix.length
  if (path.length < routePrefixLength + 1 + 8) return false

  // Ensure that a slash follows the prefix.
  if (path[routePrefixLength] != slash) return false

  // Ensure that the remaining part of the path is a number
  return !isNaN(parseInt(path.substr(routePrefixLength + 1, 8), 10))
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
