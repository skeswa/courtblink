const { join: joinPaths } = require('path')
const { spawn } = require('child_process')

const { doesCommandExist } = require('./does-command-exist')

module.exports = {
  /** @return {Promise<boolean>} true if gcloud is installed. */
  exists() {
    return doesCommandExist('kubectl')
  },

  /**
   * Applys the specified k8s config file.
   * @param {string} configFilePath path to k8s config file.
   */
  apply(configFilePath) {
    return new Promise((resolve, reject) => {
      const gcloud = spawn('kubectl', ['apply', '-f', configFilePath], {
        cwd: joinPaths(__dirname, '..', '..'),
        env: process.env,
        stdio: 'inherit',
        shell: true,
      })
      gcloud.on(
        'close',
        code =>
          code === 0
            ? resolve()
            : reject(new Error(`Failed to apply "${configFilePath}" in k8s`))
      )
    })
  },
}
