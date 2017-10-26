const path = require('path')

const docker = require('./common/docker')
const yarn = require('./common/yarn')

/** Builds the backend docker images. */
async function buildBackendDockerImage() {
  console.log('Building the backend docker image...')

  // Ensure that docker is installed before we continue.
  const isDockerInstalled = await docker.exists()
  if (!isDockerInstalled) {
    throw new Error('Docker must be installed to continue')
  }

  await docker.build(
    path.join(__dirname, '..', 'infra', 'docker', 'backend', 'Dockerfile'),
    'us.gcr.io/courtblink/backend',
    require(path.join(__dirname, '..', 'code', 'backend', 'package.json'))
      .version
  )

  console.log('Backend docker image built successfully')
}

buildBackendDockerImage().catch(err =>
  console.error('Failed build the backend docker image:', err)
)
