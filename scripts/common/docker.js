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
          '.',
        ],
        { cwd: joinPaths(__dirname, '..', '..') }
      )
      docker.stdout.on('data', data =>
        process.stdout.write('-> ' + data.toString())
      )
      docker.stderr.on('data', data =>
        process.stdout.write('-> ' + data.toString())
      )
      docker.on(
        'close',
        code =>
          code === 0
            ? resolve()
            : reject(
                new Error(
                  `Failed to execute docker build on "${name}:${version}"`
                )
              )
      )
    })
  },

  /**
   * Runs a docker container.
   * @param {string} dockerImage the name of the image to run.
   */
  run(dockerImage) {
    return new Promise((resolve, reject) => {
      const docker = spawn('docker', ['run', '-P', '-i', dockerImage], {
        cwd: joinPaths(__dirname, '..', '..'),
      })
      docker.stdout.on('data', data =>
        process.stdout.write('-> ' + data.toString())
      )
      docker.stderr.on('data', data =>
        process.stdout.write('-> ' + data.toString())
      )
      docker.on(
        'close',
        code =>
          code === 0
            ? resolve()
            : reject(
                new Error(`Failed to execute docker run on "${dockerImage}"`)
              )
      )
      process.on('exit', () => docker.kill('SIGINT'))
      process.on('SIGINT', () => {
        console.log('Received SIGINT')
        process.exit()
      })
      process.on('SIGTERM', () => {
        console.log('Received SIGTERM')
        process.exit()
      })
    })
  },
}
