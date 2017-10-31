const path = require('path')

const kubectl = require('./common/kubectl')

/** Releases the latest backend in production. */
async function releaseBackend() {
  console.log('Releasing the backend in production...')

  // Ensure that yarn is installed before we continue.
  const isKubectlInstalled = await kubectl.exists()
  if (!isKubectlInstalled) {
    throw new Error('Kubectl must be installed to continue')
  }

  await kubectl.apply(
    path.join(__dirname, '..', 'infra', 'k8s', 'backend', 'deployment.yml')
  )

  console.log('Released the backend in production successfully')
}

releaseBackend().catch(err => {
  console.error('Failed to release the backend in production:', err)
  process.exit(1)
})
