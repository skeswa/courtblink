const { spawn } = require('child_process')

const { doesCommandExist } = require('./does-command-exist')

module.exports = {
  /** @return {Promise<boolean>} true if yarn is installed. */
  exists() {
    return doesCommandExist('yarn')
  },

  /**
   * Executes `yarn` in the designated directory.
   * @param {string} packagePath the directory in which `yarn` should be
   *     executed.
   */
  install(packagePath) {
    return new Promise((resolve, reject) => {
      const yarn = spawn('yarn', { cwd: packagePath })
      yarn.stdout.on('data', data => console.log('-> ', data.toString()))
      yarn.stderr.on('data', data => console.log('-> ', data.toString()))
      yarn.on(
        'close',
        code =>
          code === 0
            ? resolve()
            : reject(
                new Error(`Failed to execute yarn install in "${packagePath}"`)
              )
      )
    })
  },

  /**
   * Executes an npm script in the designated directory.
   * @param {string} packagePath the directory in which `yarn` should be
   *     executed.
   * @param {string} script npm script to execute.
   */
  run(packagePath, script) {
    return new Promise((resolve, reject) => {
      const yarn = spawn('yarn', ['run', script], { cwd: packagePath })
      yarn.stdout.on('data', data => console.log('-> ', data.toString()))
      yarn.stderr.on('data', data => console.log('-> ', data.toString()))
      yarn.on(
        'close',
        code =>
          code === 0
            ? resolve()
            : reject(new Error(`Failed to run "${script}" in "${packagePath}"`))
      )
    })
  },

  /**
   * Executes an npm script in the designated directory.
   * @param {string} packagePath the directory in which `yarn` should be
   *     executed.
   * @param {string} tag tag for the output of this script.
   * @param {Function} color function that wraps arguments in a color.
   * @param {Function} registerChildProcess registers a child process for later
   *     disposal.
   */
  start(packagePath, tag, color, registerChildProcess) {
    return new Promise((resolve, reject) => {
      try {
        const yarn = spawn('yarn', ['start'], { cwd: packagePath })
        yarn.stdout.on('data', data =>
          process.stdout.write(color(`[${tag}:stdout]`, data.toString()))
        )
        yarn.stderr.on('data', data =>
          process.stdout.write(color(`[${tag}:stderr]`, data.toString()))
        )
        yarn.on('error', err => reject(err))
        yarn.on('close', code => {
          console.log(`Process tagged "${tag}" exited successfully`)

          // Resolve the process promise.
          !code
            ? resolve()
            : reject(
                new Error(`Failed to run "start" in "${packagePath}" (${code})`)
              )
        })

        // Register the process as killable.
        registerChildProcess(yarn)
      } catch (err) {
        reject(err)
      }
    })
  },

  /**
   * Upgrades a dependency in the designated directory.
   * @param {string} packagePath the directory in which `yarn` should be
   *     executed.
   * @param {string} dependency the dependency to upgrade.
   */
  upgrade(packagePath, dependency) {
    return new Promise((resolve, reject) => {
      const yarn = spawn('yarn', ['upgrade', dependency], { cwd: packagePath })
      yarn.stdout.on('data', data => console.log('-> ', data.toString()))
      yarn.stderr.on('data', data => console.log('-> ', data.toString()))
      yarn.on(
        'close',
        code =>
          code === 0
            ? resolve()
            : reject(
                new Error(
                  `Failed to upgrade "${dependency}" in "${packagePath}"`
                )
              )
      )
    })
  },
}
