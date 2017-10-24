const { spawn } = require('child_process')
const { join: joinPaths } = require('path')

const { doesCommandExist } = require('./does-command-exist')

module.exports = {
  /** @return {Promise<boolean>} true if docker is installed. */
  exists() {
    return doesCommandExist('docker')
  },

  /**
   * Builds a new container image with `docker`.
   * @param {string} dockerfilePath path to the dockerfile.
   * @param {string} name name of the docker image.
   * @param {string} version version of the docker image.
   */
  build(dockerfilePath, name, version) {
    return new Promise((resolve, reject) => {
      const docker = spawn(
        'docker',
        [
          'build',
          '-f',
          dockerfilePath,
          '--rm',
          '-t',
          `${name}:${version}`,
          '-t',
          `${name}:latest`,
        ],
        { cwd: joinPaths(__dirname, '..', '..') }
      )
      docker.stdout.on('data', data => console.log('-> ', data.toString()))
      docker.stderr.on('data', data => console.log('-> ', data.toString()))
      docker.on(
        'close',
        code =>
          code === 0
            ? resolve()
            : reject(
                new Error(
                  `Failed to execute docker install in "${packagePath}"`
                )
              )
      )
    })
  },
}
