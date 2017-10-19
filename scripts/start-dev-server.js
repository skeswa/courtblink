const chalk = require('chalk')
const path = require('path')

const yarn = require('./common/yarn')

/** Starts the development server. */
async function startDevServer() {
  // List of processes to be killed upon exiting.
  const childProcesses = []

  /** Called when the process exits for any reason. */
  function onExit() {
    // Exit early if there are no killable processes.
    if (childProcesses.length < 1) return

    console.log(`Killing ${childProcesses.length} child processes...`)

    // Make sure all of the members of the kill list are killed.
    while (childProcesses.length > 0) {
      childProcesses.pop().kill('SIGINT')
    }

    console.log(`Killed ${childProcesses.length} child processes successfully.`)
  }

  /** Called when the process exits via a signal (like via `ctrl + c`). */
  function onExitBySignal() {
    // Handle the exit by executing the cleanup logic.
    onExit()

    // Make sure that the process dies gracefully.
    process.exit(0)
  }

  /** Registers a child process so that we can properly dispose of it later. */
  function registerChildProcess(childProcess) {
    childProcesses.push(childProcess)
  }

  // Kill the killables when the process exits.
  process.on('exit', onExit)
  process.on('SIGHUP', onExitBySignal)
  process.on('SIGINT', onExitBySignal)
  process.on('SIGTERM', onExitBySignal)

  // Now that we're ready to handle a process exit, run the backend and the
  // frontend at the same time.
  await Promise.all([
    yarn.start(
      path.join(__dirname, '..', 'code', 'backend'),
      'backend',
      chalk.blue,
      registerChildProcess
    ),
    yarn.start(
      path.join(__dirname, '..', 'code', 'frontend'),
      'frontend',
      chalk.green,
      registerChildProcess
    ),
  ])
}

startDevServer().catch(err => {
  console.error('Failed to run the Courtblink dev server:', err)

  // Signal that there was an unclean exit.
  process.exit(1)
})
