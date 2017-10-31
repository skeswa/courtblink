const path = require('path')
const replace = require('replace-in-file')

const gcloud = require('./common/gcloud')

/** Deploys the frontend docker images. */
async function deployFrontendDockerImage() {
  console.log('Deploying the frontend docker image...')

  // Ensure that gcloud is installed before we continue.
  const isGCloudInstalled = await gcloud.exists()
  if (!isGCloudInstalled) {
    throw new Error('gcloud must be installed to continue')
  }

  // Read the frontend version.
  const imageName = 'us.gcr.io/courtblink/frontend'
  const version = require(path.join(
    __dirname,
    '..',
    'code',
    'frontend',
    'package.json'
  )).version
  const image = `${imageName}:${version}`

  console.log(`Uploading ${image}...`)
  await gcloud.docker.upload(image)

  console.log('Updating the k8s configuration...')
  await replace({
    files: path.join(
      __dirname,
      '..',
      'infra',
      'k8s',
      'frontend',
      'deployment.yml'
    ),
    from: new RegExp(`${imageName}:[a-zA-Z0-9\.\-_]+`, 'g'),
    to: image,
  })

  console.log('Frontend docker image deployed successfully')
}

deployFrontendDockerImage().catch(err =>{
  console.error('Failed deploy the frontend docker image:', err)
  process.exit(1)
})
