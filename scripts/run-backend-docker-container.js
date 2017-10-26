const path = require('path')

const docker = require('./common/docker')
const yarn = require('./common/yarn')

/** Runs the backend docker images. */
async function runBackendDockerImage() {
  console.log('Running the backend docker container...')

  // Ensure that docker is installed before we continue.
  const isDockerInstalled = await docker.exists()
  if (!isDockerInstalled) {
    throw new Error('Docker must be installed to continue')
  }

  // Get details about the image.
  const imageUrl = 'us.gcr.io/courtblink/backend'
  const imageVersion = require(path.join(
    __dirname,
    '..',
    'code',
    'backend',
    'package.json'
  )).version

  await docker.run(`${imageUrl}:${imageVersion}`)
}

runBackendDockerImage().catch(err =>
  console.error('Failed run the backend docker container:', err)
)
