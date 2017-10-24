const path = require('path')

const docker = require('./common/docker')
const yarn = require('./common/yarn')

/** Builds the courtblink docker images. */
async function buildDockerImages() {
  console.log('Building Courtblink docker images...')

  // Ensure that docker is installed before we continue.
  const isDockerInstalled = await docker.exists()
  if (!isDockerInstalled) {
    throw new Error('Docker must be installed to continue')
  }

  console.log('Compiling the latest frontend assets...')
  await yarn.run(path.join(__dirname, '..', 'code', 'frontend'), 'build')

  console.log('Building the frontend...')
  await docker.build(
    path.join(__dirname, '..', 'infra', 'frontend', 'Dockerfile'),
    'courtblink-frontend',
    require(path.join(__dirname, '..', 'code', 'frontend', 'package.json'))
      .version
  )

  console.log('Building the backend...')
  await docker.build(
    path.join(__dirname, '..', 'infra', 'backend', 'Dockerfile'),
    'courtblink-backend',
    require(path.join(__dirname, '..', 'code', 'backend', 'package.json'))
      .version
  )

  console.log('Courtblink docker images built successfully')
}

buildDockerImages().catch(err =>
  console.error('Failed build Courtblink docker images:', err)
)
