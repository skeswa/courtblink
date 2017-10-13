import { AppImpl } from './impl'
import { App, AppOptions } from './types'

/**
 * Creates a new courtblink backend app.
 * @param options options used to create the courtblink backend app.
 */
export function createApp(options: AppOptions) {
  return new AppImpl(
    options.endpoints,
    options.inProd,
    options.logger,
    options.port,
    options.torExecutableName
  )
}
