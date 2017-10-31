const { join: joinPaths } = require('path')
const { spawn } = require('child_process')

const { doesCommandExist } = require('./does-command-exist')

module.exports = {
  /** @return {Promise<boolean>} true if gcloud is installed. */
  exists() {
    return doesCommandExist('gcloud')
  },

  docker: {
    /**
     * Uploads the designated docker image to GCR.
     * @param {string} image docker image to be uploaded.
     */
    upload(image) {
      return new Promise((resolve, reject) => {
        const gcloud = spawn('gcloud', ['docker', '--', 'push', image], {
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
              : reject(
                  new Error(
                    `Failed to execute gcloud docker upload for "${image}"`
                  )
                )
        )
      })
    },
  },
}
