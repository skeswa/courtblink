const path = require('path')

const yarn = require('./common/yarn')

/** Updates the `common` package of the courtblink codebase. */
async function updateCommon() {
  console.log('Updating common...')

  // Ensure that yarn is installed before we continue.
  const isYarnInstalled = await yarn.exists()
  if (!isYarnInstalled) {
    throw new Error('Yarn must be installed to continue')
  }

  console.log('Upgrading common in the backend...')
  await yarn.upgrade(path.join(__dirname, '..', 'code', 'backend'), 'common')

  console.log('Upgrading common in the frontend...')
  await yarn.upgrade(path.join(__dirname, '..', 'code', 'backend'))

  console.log('Updated common successfully')
}

updateCommon().catch(err =>
  console.error('Failed to update common:', err)
)