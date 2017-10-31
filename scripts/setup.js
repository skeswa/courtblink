const path = require('path')

const yarn = require('./common/yarn')

/** Installs dependencies for the courtblink codebase. */
async function setup() {
  console.log('Installing Courtblink dependencies...')

  // Ensure that yarn is installed before we continue.
  const isYarnInstalled = await yarn.exists()
  if (!isYarnInstalled) {
    throw new Error('Yarn must be installed to continue')
  }

  console.log('Installing scripts dependencies...')
  await yarn.install(__dirname)

  console.log('Installing common dependencies...')
  await yarn.install(path.join(__dirname, '..', 'code', 'common'))

  // Make sure that the generated stuff gets generated.
  console.log('Generating common generated files...')
  await yarn.run(path.join(__dirname, '..', 'code', 'common'), 'generate')

  console.log('Installing backend dependencies...')
  await yarn.install(path.join(__dirname, '..', 'code', 'backend'))

  console.log('Installing frontend dependencies...')
  await yarn.install(path.join(__dirname, '..', 'code', 'frontend'))

  console.log('Courtblink dependencies installed successfully')
}

setup().catch(err =>{
  console.error('Failed to install Courtblink dependencies:', err)
  process.exit(1)
})
