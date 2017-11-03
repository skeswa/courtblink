import * as onExit from 'node-cleanup'

import { createApp } from './courtblink/App'
import { ConfigReadingStrategy, Env, readConfig } from './courtblink/Config'
import { createLogger, LoggerCreationStrategy } from './util/Logger'
import { ContextualError } from './../common/util/ContextualError'

// Read the courtblink backend configuration before setting anything up. This is
// because config affects how we instantiate things.
const config = readConfig(ConfigReadingStrategy.FromEnvVars)

// Adapt the logger to whatever environment that backend is currently running
// in.
const logger = createLogger(
  config.env === Env.Dev
    ? LoggerCreationStrategy.ForDev
    : LoggerCreationStrategy.ForProd
)

// Instantiate the app; this app encapsulates all courtblink backend
// functionality.
const app = createApp({
  logger,

  endpoints: { gameNews: '/api/news', splash: '/api/splash' },
  inProd: config.env === Env.Prod,
  port: config.port,
  torExecutableName: config.torExecutableName,
})

// Perform all necessary cleanup when the process exits.
onExit((exitCode: number, signal: string) => {
  // Broadcast which signal was received.
  if (signal) {
    logger.info('handler:exit', `Received signal "${signal}"`)
  }

  // Broadcast which exit code was received.
  if (exitCode) {
    logger.info('handler:exit', `Now exiting in error with code ${exitCode}`)
  }

  // Exit here if there was no signal, since that means no wind down is
  // necessary.
  if (!signal) return true

  logger.info('handler:exit', 'Winding down internal services')

  // Since there is a signal, teat everything down before exiting.
  try {
    // Wait for the app to exit asynchronously. Then kill the
    // process once it is done.
    app
      .stop()
      .then(() => {
        logger.info('handler:exit', 'Exited successfully')
        process.kill(process.pid, signal)
      })
      .catch(err => {
        logger.error('handler:exit', 'Did not exit successfully', err)
        process.kill(process.pid, signal)
      })
  } catch (err) {
    // Something went wrong while winding things down. Make sure the cause
    // of this issue gets logged properly.
    logger.error('handler:exit', 'Did not exit successfully', err)
  } finally {
    // This is so that we don't come back to this exit handler.
    onExit.uninstall()
  }

  // Exit false because the process should not exit yet.
  return false
})

// Start the courtblink backend.
app.start().catch(err => console.error('Backend exited with an error:', err))
