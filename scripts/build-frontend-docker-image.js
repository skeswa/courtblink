const path = require('path')

const docker = require('./common/docker')
const yarn = require('./common/yarn')

/** Builds the frontend docker images. */
async function buildFrontendDockerImage() {
  console.log('Building the frontend docker image...')

  // Ensure that docker is installed before we continue.
  const isDockerInstalled = await docker.exists()
  if (!isDockerInstalled) {
    throw new Error('Docker must be installed to continue')
  }

  console.log('Compiling the latest frontend assets...')
  await yarn.run(path.join(__dirname, '..', 'code', 'frontend'), 'build')

  console.log('Executing docker build...')
  await docker.build(
    path.join(__dirname, '..', 'infra', 'docker', 'frontend', 'Dockerfile'),
    'us.gcr.io/courtblink/frontend',
    require(path.join(__dirname, '..', 'code', 'frontend', 'package.json'))
      .version
  )

  console.log('Frontend docker image built successfully')
}

buildFrontendDockerImage().catch(err =>
  console.error('Failed build the frontend docker image:', err)
)

