import * as constants from '../../constants'
import * as colors from '../colors'
import * as emoji from '../emoji'
import * as utils from '../utils'

export const usage = 'init [file]'
export const description =
  'Creates Tailwind config file. Default: ' +
  colors.file(utils.getSimplePath(constants.defaultConfigFile))

export const options = [
  {
    usage: '--full',
    description: 'Generate complete configuration file.',
  },
]

export const optionMap = {
  full: ['full'],
}

/**
 * Runs the command.
 *
 * @param {string[]} cliParams
 * @param {object} cliOptions
 * @return {Promise}
 */
export function run(cliParams, cliOptions) {
  return new Promise(resolve => {
    utils.header()

    const full = cliOptions.full
    const file = cliParams[0] || constants.defaultConfigFile
    const simplePath = utils.getSimplePath(file)

    utils.exists(file) && utils.die(colors.file(simplePath), 'already exists.')

    const stubFile = full ? constants.defaultConfigStubFile : constants.simpleConfigStubFile

    utils.copyFile(stubFile, file)

    utils.log()
    utils.log(emoji.yes, 'Created Tailwind config file:', colors.file(simplePath))

    utils.footer()

    resolve()
  })
}
