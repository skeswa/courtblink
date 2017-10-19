const chalk = require('chalk')
const path = require('path')

const yarn = require('./common/yarn')

/** Starts the development server. */
async function startDevServer() {
  // List of processes to be killed upon exiting.
  const killables = []

  function onExit() {
    // Exit early if there are no killable processes.
    if (killables.length < 1) return

    console.log('Killing', killables.length, 'child processes')

    // Make sure all of the members of the kill list are killed.
    killables.forEach(killable => killable.kill('SIGINT'))
  }

  // Kill the killables when the process exits.
  process.on('exit', onExit)
  process.on('SIGINT', onExit)
  process.on('SIGTERM', onExit)

  try {
    // Run the backend and the frontend at the same time.
    await Promise.all([
      yarn.start(
        path.join(__dirname, '..', 'code', 'backend'),
        'backend',
        chalk.blue,
        killables
      ),
      yarn.start(
        path.join(__dirname, '..', 'code', 'frontend'),
        'frontend',
        chalk.green,
        killables
      ),
    ])
  } catch (err) {
    // Throw the error after all the killables are killed.
    throw err
  }
}

startDevServer().catch(err => {
  console.error('Failed to run the Courtblink dev server:', err)

  // Signal that there was an unclean exit.
  process.exit(1)
})
