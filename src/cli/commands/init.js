import chalk from 'chalk'

import constants from '../constants'
import emoji from '../emoji'
import { exists, die, log, readFile, writeFile } from '../utils'

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
    const file = cliParams[1] || constants.defaultConfigFile

    exists(file) && die(chalk.bold.magenta(file), 'already exists.')

    let stub = readFile(constants.configStubFile)
    stub = stub.replace('// let defaultConfig', 'let defaultConfig')
    stub = stub.replace(
      "require('./plugins/container')",
      "require('tailwindcss/plugins/container')"
    )

    writeFile(file, stub)

    log()
    log(emoji.yes, 'Created Tailwind config file:', chalk.bold.magenta(file))

    resolve()
  })
}
