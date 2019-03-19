import module from 'module'
import nodePath from 'path'

import transform from './update/transform'
import * as validator from './update/validator'
import * as constants from '../../constants'
import * as colors from '../colors'
import * as emoji from '../emoji'
import * as utils from '../utils'
import oldDefaultConfig from '../../../stubs/oldDefaultConfig.stub.js'

export const usage = 'update [source] [target]'
export const description =
  'Updates Tailwind configuration file. Default: ' + colors.file(constants.defaultConfigFile)

/**
 * Prints error messages and information about getting support to console
 *
 * @param {...string} msgs
 */
function dieWithSupport(...msgs) {
  utils.error(...msgs)
  utils.log()
  utils.log(colors.bold('We were unable to automatically upgrade your configuration file.'))
  utils.log(colors.bold('This could be the result of a non-standard format.'))
  utils.log(colors.bold('We would love to learn more so we can improve this tool.'))
  utils.log()
  utils.log(colors.bold('Please open a ticket here:'))
  utils.log(colors.info('https://github.com/tailwindcss/tailwindcss/issues/new'))
  utils.die()
}

/**
 * Loads old configuration file by replacing expected dependencies with standins
 *
 * @param {string} file
 * @return {object}
 */
function loadOldConfig(file) {
  const originalRequire = module.prototype.require

  module.prototype.require = function(moduleName) {
    switch (moduleName) {
      case 'tailwindcss/defaultConfig':
        return () => oldDefaultConfig
      case 'tailwindcss/plugins/container':
        return options => ({ plugin: 'container', options })
      default:
        return originalRequire.apply(this, arguments)
    }
  }

  const ret = require(file)

  module.prototype.require = originalRequire

  return ret
}

/**
 * Formats the configuration object as importable Javascript
 *
 * @param {object} obj
 * @return {string}
 */
function format(obj) {
  return `module.exports = ${JSON.stringify(obj, null, 2)}`
}

/**
 * Runs the command.
 *
 * @param {string[]} cliParams
 * @param {object} cliOptions
 * @return {Promise}
 */
export function run(cliParams) {
  return new Promise(resolve => {
    utils.header()

    const inputFile = cliParams[0] || constants.oldDefaultConfigFile
    const outputFile = cliParams[1] || constants.defaultConfigFile
    const inputFileSimplePath = utils.getSimplePath(inputFile)
    const outputFileSimplePath = utils.getSimplePath(outputFile)

    !utils.exists(inputFile) && utils.die(colors.file(inputFileSimplePath), 'does not exist.')
    utils.exists(outputFile) && utils.die(colors.file(outputFileSimplePath), 'already exists.')

    let oldConfig = {}
    let newConfig = {}

    try {
      oldConfig = loadOldConfig(nodePath.resolve(inputFile))
    } catch (e) {
      dieWithSupport('Unable to load:', colors.file(inputFileSimplePath))
    }

    const missingProperties = validator.getMissingRequiredProperties(oldConfig)

    if (missingProperties.length) {
      utils.error(colors.file(inputFile), 'is missing these properties:')
      missingProperties.forEach(property => utils.log(colors.info(`- ${property}`)))
      utils.die()
    }

    try {
      newConfig = transform(oldConfig)
    } catch (e) {
      dieWithSupport('Unable to update:', colors.file(inputFileSimplePath))
    }

    utils.writeFile(outputFile, format(newConfig))

    utils.log()
    utils.log(emoji.yes, 'Created Tailwind config file:', colors.file(outputFileSimplePath))

    utils.footer()

    resolve()
  })
}
