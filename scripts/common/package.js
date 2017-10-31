const { readFile } = require('fs')
const { join: joinPaths } = require('path')

/**
 * Reads the `package.json` in the specified package path.
 * @param {string} packagePath path to the package.
 * @return parsed JSON version of the `package.json`.
 */
function read(packagePath) {
  return new Promise((resolve, reject) => {
    try {
      readFile(packagePath, { encoding: 'utf8' }, (err, fileContents) => {
        if (err) return reject(err)

        try {
          return resolve(JSON.parse(fileContents))
        } catch (err) {
          reject(err)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { read }
