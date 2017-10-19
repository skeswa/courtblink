const { getOptions } = require('loader-utils')
const { readFile, writeFile } = require('mz/fs')
const { EOL } = require('os')
const path = require('path')
const DtsCreator = require('typed-css-modules')

/**
 * Basically, this loader is a slightly more robust implementation of
 * `github.com/olegstepura/typed-css-modules-loader`.
 * @param {string} cssFileContents the contents of the CSS file being loaded.
 * @param {Object} sourceMap the webpack source maps.
 */
function typedCSSModulesLoader(cssFileContents, sourceMap) {
  if (this.cacheable) {
    // Marks this loader as cacheable.
    this.cacheable(true)
  }

  // The resource that this loader is being applied onto is the CSS source
  // file.
  const cssFilePath = this.resourcePath

  // Tell webpack that this loader now depends on the specified resource path.
  this.addDependency(cssFilePath)

  // Signal that we are waiting for an asynchronous result.
  const finish = this.async()

  // Pass on query parameters as an options object to the DtsCreator. This lets
  // you change the default options of the DtsCreator and e.g. use a different
  // output folder.
  const queryOptions = getOptions(this)

  // Prepare the arguments for `updateCssFileTypings`.
  const creator = new DtsCreator({ ...queryOptions })

  // Update the CSS file typings. When we go to tell webpack that we are done,
  // send back the unchanged CSS file contents so as to say "this loader did
  // not change the contents of the source file".
  updateCssFileTypings({
    context: this.options.context,
    emitFile: this.emitFile,

    creator,
    cssFileContents,
    cssFilePath,
    sourceMap,
  })
    .then(() => finish(null, cssFileContents, sourceMap))
    .catch(err => finish(err, cssFileContents, sourceMap))
}

/**
 * Reads the content if the provided file path, if it exists. Otherwise,
 * returns null.
 * @param {string} filePath path to file to be read.
 */
async function contentsOf(filePath) {
  try {
    return readFile(filePath, 'utf8')
  } catch (err) {
    return null
  }
}

/**
 * Generates the file contents of the type file for the provided CSS file.
 * @param {Object} params the dts creator, CSS file content, and CSS file path.
 * @return {string} contents of the type file for the provided CSS file.
 */
async function generateTypings({ creator, cssFilePath, cssFileContents }) {
  try {
    const { formatted: typings } = await creator.create(
      cssFilePath,
      cssFileContents
    )

    return typings + EOL /* EOL is to keep the output files looking fresh. */
  } catch (err) {
    throw newError(
      `Failed to generate typings for file at path "${cssFilePath}"`,
      err
    )
  }
}

/**
 * Creates a new Error with an optional cause.
 *
 * @param {string} message text describing what failed.
 * @param {Error} cause Error that caused this one.
 * @return {Error} new Error that includes message and cause.
 */
function newError(message, cause) {
  if (!cause) {
    return new Error(message)
  }

  const err = new Error(`${message}: ${cause.message}`)
  err.stack += `

Caused by: ${cause.stack}`
  return err
}

/**
 * Asynchronously updates the typings for the specified CSS file.
 * @param {Object} params the webapck context, dts creator, CSS file content,
 *     and CSS file path.
 */
async function updateCssFileTypings({
  context,
  creator,
  cssFileContents,
  cssFilePath,
  emitFile,
  sourceMap,
}) {
  try {
    // Mandate that the type file is adjacent to the CSS file, and that they
    // are named similarly.
    const typeFilePath = `${cssFilePath}.d.ts`

    // Simultaneously read what have right now, and compile what the creator
    // thinks it should become.
    const [
      originalTypeFileContents,
      updatedTypeFileContents,
    ] = await Promise.all([
      contentsOf(typeFilePath),
      generateTypings({ creator, cssFilePath, cssFileContents }),
    ])

    // If there is a discrepancy, between the old & new contents, then apply an
    // update and then tell webpack about it.
    if (originalTypeFileContents !== updatedTypeFileContents) {
      const relativePathToTypeFile = path.relative(context, typeFilePath)

      // First, tell webpack that something changed.
      emitFile(relativePathToTypeFile, updatedTypeFileContents, sourceMap)

      // Then perform the update to the type file.
      await writeFile(typeFilePath, updatedTypeFileContents, 'utf8')
    }
  } catch (err) {
    throw newError(
      `Failed to update the typings for CSS file at path "${cssFilePath}"`,
      err
    )
  }
}

// Default export the loader.
module.exports = typedCSSModulesLoader
