import chalk from 'chalk'
import { transform } from 'babel-core'

import * as constants from '../constants'
import * as emoji from '../emoji'
import * as utils from '../utils'

export const usage = 'init [file]'
export const description =
  'Creates Tailwind config file. Default: ' + chalk.bold.magenta(constants.defaultConfigFile)

export const options = [
  {
    usage: '--no-comments',
    description: 'Omit comments from the config file.',
  },
]

export const optionMap = {
  noComments: ['no-comments'],
}

const transformSettings = {
  ast: false,
  babelrc: false,
  compact: false,
  shouldPrintComment: comment => !comment.startsWith('*'),
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

    const noComments = cliOptions.noComments
    const file = cliParams[0] || constants.defaultConfigFile

    utils.exists(file) && utils.die(chalk.bold.magenta(file), 'already exists.')

    let stub = utils
      .readFile(constants.configStubFile)
      .replace('// let defaultConfig', 'let defaultConfig')
      .replace("require('./plugins/container')", "require('tailwindcss/plugins/container')")

    noComments && (stub = transform(stub, transformSettings).code.trim())

    utils.writeFile(file, stub)

    utils.log()
    utils.log(emoji.yes, 'Created Tailwind config file:', chalk.bold.magenta(file))

    utils.footer()

    resolve()
  })
}
