const path = require('path')

const docker = require('./common/docker')
const package = require('./common/package')
const yarn = require('./common/yarn')

/** Builds the frontend docker images. */
async function buildFrontendDockerImage() {
  console.log('Building the frontend docker image...')

  // Ensure that docker is installed before we continue.
  const isDockerInstalled = await docker.exists()
  if (!isDockerInstalled) {
    throw new Error('Docker must be installed to continue')
  }

  console.log('Updating frontend version...')
  await yarn.version(path.join(__dirname, '..', 'code', 'frontend'))

  // Read the new package version.
  const newVersion = (await package.read(
    path.join(__dirname, '..', 'code', 'frontend', 'package.json')
  )).version

  console.log('Compiling the latest frontend assets...')
  await yarn.run(path.join(__dirname, '..', 'code', 'frontend'), 'build')

  console.log(`Executing docker build for version ${newVersion}...`)
  await docker.build(
    path.join(__dirname, '..', 'infra', 'docker', 'frontend', 'Dockerfile'),
    'us.gcr.io/courtblink/frontend',
    newVersion
  )

  console.log('Frontend docker image built successfully')
}

buildFrontendDockerImage().catch(err => {
  console.error('Failed build the frontend docker image:', err)
  process.exit(1)
})
