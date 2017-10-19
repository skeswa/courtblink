const { exec } = require('child_process')

/** @return true if the current platform is windows. */
function isRunningInWindows() {
  return process.platform == 'win32'
}

/**
 * @param {string} command the command to be checked.
 * @return {Promise<boolean>} true if the specified command exists.
 */
function doesCommandExist(command) {
  return isRunningInWindows()
    ? doesCommandExistInWindows(command)
    : doesCommandExistInUnix(command)
}

/**
 * @param {string} command the command to be checked.
 * @return {Promise<boolean>} true if the specified command exists in unix.
 */
function doesCommandExistInUnix(command) {
  return new Promise(resolve =>
    exec(
      `command -v ${command} 2>/dev/null && ` +
        `{ echo >&1 '${command} found'; exit 0; }`,
      (err, stdout) => resolve(!!stdout)
    )
  )
}

/**
 * @param {string} command the command to be checked.
 * @return {Promise<boolean>} true if the specified command exists in windows.
 */
function doesCommandExistInWindows(command) {
  return new Promise(resolve =>
    exec(`where ${command}`, err => resolve(err !== null))
  )
}

module.exports = { doesCommandExist }
