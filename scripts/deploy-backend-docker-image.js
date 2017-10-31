const path = require('path')
const replace = require('replace-in-file')

const gcloud = require('./common/gcloud')

/** Deploys the backend docker images. */
async function deployBackendDockerImage() {
  console.log('Deploying the backend docker image...')

  // Ensure that gcloud is installed before we continue.
  const isGCloudInstalled = await gcloud.exists()
  if (!isGCloudInstalled) {
    throw new Error('gcloud must be installed to continue')
  }

  // Read the backend version.
  const imageName = 'us.gcr.io/courtblink/backend'
  const version = require(path.join(
    __dirname,
    '..',
    'code',
    'backend',
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
      'backend',
      'deployment.yml'
    ),
    from: new RegExp(`${imageName}:[a-zA-Z0-9\.\-_]+`, 'g'),
    to: image,
  })

  console.log('Backend docker image deployed successfully')
}

deployBackendDockerImage().catch(err =>{
  console.error('Failed deploy the backend docker image:', err)
  process.exit(1)
})
