const path = require('path')

const kubectl = require('./common/kubectl')

/** Releases the latest frontend in production. */
async function releaseFrontend() {
  console.log('Releasing the frontend in production...')

  // Ensure that yarn is installed before we continue.
  const isKubectlInstalled = await kubectl.exists()
  if (!isKubectlInstalled) {
    throw new Error('Kubectl must be installed to continue')
  }

  await kubectl.apply(
    path.join(__dirname, '..', 'infra', 'k8s', 'frontend', 'deployment.yml')
  )

  console.log('Released the frontend in production successfully')
}

releaseFrontend().catch(err => {
  console.error('Failed to release the frontend in production:', err)
  process.exit(1)
})
