const path = require('path')

const docker = require('./common/docker')
const yarn = require('./common/yarn')

/** Runs the frontend docker images. */
async function runFrontendDockerImage() {
  console.log('Running the frontend docker container...')

  // Ensure that docker is installed before we continue.
  const isDockerInstalled = await docker.exists()
  if (!isDockerInstalled) {
    throw new Error('Docker must be installed to continue')
  }

  // Get details about the image.
  const imageUrl = 'us.gcr.io/courtblink/frontend'
  const imageVersion = require(path.join(
    __dirname,
    '..',
    'code',
    'frontend',
    'package.json'
  )).version

  await docker.run(`${imageUrl}:${imageVersion}`)
}

runFrontendDockerImage().catch(err => {
  console.error('Failed run the frontend docker container:', err)
  process.exit(1)
})
