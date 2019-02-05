import postcss from 'postcss'

import * as utils from './utils'

/**
 * Compiler options
 *
 * @typedef {Object} CompileOptions
 * @property {string} inputFile
 * @property {string} outputFile
 * @property {array} plugins
 */

const defaultOptions = {
  inputFile: null,
  outputFile: null,
  plugins: [],
}

/**
 * Compiles CSS file.
 *
 * @param {CompileOptions} options
 * @return {Promise}
 */
export default function compile(options = {}) {
  const config = { ...defaultOptions, ...options }
  const css = utils.readFile(config.inputFile)

  return new Promise((resolve, reject) => {
    postcss(config.plugins)
      .process(css, {
        from: config.inputFile,
        to: config.outputFile,
      })
      .then(resolve)
      .catch(reject)
  })
}
