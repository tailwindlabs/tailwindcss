import chalk from 'chalk'

import * as constants from '../constants'
import * as emoji from '../emoji'
import * as utils from '../utils'

export const usage = 'init [file]'
export const description =
  'Creates Tailwind config file. Default: ' + chalk.bold.magenta(constants.defaultConfigFile)

/**
 * Runs the command.
 *
 * @param {string[]} cliParams
 * @return {Promise}
 */
export function run(cliParams) {
  return new Promise(resolve => {
    utils.header()

    const file = cliParams[0] || constants.defaultConfigFile

    utils.exists(file) && utils.die(chalk.bold.magenta(file), 'already exists.')

    const stub = utils
      .readFile(constants.configStubFile)
      .replace('// let defaultConfig', 'let defaultConfig')
      .replace("require('./plugins/container')", "require('tailwindcss/plugins/container')")

    utils.writeFile(file, stub)

    utils.log()
    utils.log(emoji.yes, 'Created Tailwind config file:', chalk.bold.magenta(file))

    utils.footer()

    resolve()
  })
}
