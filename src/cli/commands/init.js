import chalk from 'chalk'

import constants from '../constants'
import emoji from '../emoji'
import { die, exists, footer, header, log, readFile, writeFile } from '../utils'

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
    header()

    const file = cliParams[0] || constants.defaultConfigFile

    exists(file) && die(chalk.bold.magenta(file), 'already exists.')

    const stub = readFile(constants.configStubFile)
      .replace('// let defaultConfig', 'let defaultConfig')
      .replace("require('./plugins/container')", "require('tailwindcss/plugins/container')")

    writeFile(file, stub)

    log()
    log(emoji.yes, 'Created Tailwind config file:', chalk.bold.magenta(file))

    footer()
    resolve()
  })
}
