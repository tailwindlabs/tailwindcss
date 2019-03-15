import chalk from 'chalk'

import * as constants from '../../constants'
import * as emoji from '../emoji'
import * as utils from '../utils'

export const usage = 'init [file]'
export const description =
  'Creates Tailwind config file. Default: ' + chalk.bold.magenta(constants.defaultConfigFile)

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

    utils.exists(file) && utils.die(chalk.bold.magenta(file), 'already exists.')

    const stubFile = full ? constants.defaultConfigStubFile : constants.simpleConfigStubFile
    const stub = utils.readFile(stubFile)

    utils.writeFile(file, stub)

    utils.log()
    utils.log(emoji.yes, 'Created Tailwind config file:', chalk.bold.magenta(file))

    utils.footer()

    resolve()
  })
}
