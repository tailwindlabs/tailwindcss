import autoprefixer from 'autoprefixer'
import bytes from 'bytes'
import chalk from 'chalk'
import postcss from 'postcss'
import prettyHrtime from 'pretty-hrtime'

import commands from '.'
import constants from '../constants'
import emoji from '../emoji'
import tailwind from '../..'
import { error, exists, die, log, readFile, writeFile } from '../utils'

export const usage = 'build <file> [options]'
export const description = 'Compiles Tailwind CSS file.'

export const options = [
  {
    usage: '-c --config <file>',
    description: 'Tailwind config file.',
  },
  {
    usage: '-o --output <file>',
    description: 'Compiled CSS file. Default: ' + chalk.bold.magenta(constants.defaultOutputFile),
  },
]

export const optionMap = {
  config: ['c', 'config'],
  output: ['o', 'output'],
}

/**
 * Runs the command.
 *
 * @param {string[]} cliParams
 * @param {object} cliOptions
 */
export function run(cliParams, cliOptions) {
  const time = process.hrtime()
  const inputFile = cliParams[1]
  const configFile = cliOptions.config && cliOptions.config[0]
  const outputFile = (cliOptions.output && cliOptions.output[0]) || constants.defaultOutputFile

  if (!inputFile) {
    error('CSS file is required.')
    commands.help.forCommand(this)
    die()
  }

  !exists(inputFile) && die(chalk.bold.magenta(inputFile), 'does not exist.')
  configFile && !exists(configFile) && die(chalk.bold.magenta(configFile), 'does not exist.')

  log()
  log(emoji.go, 'Building', chalk.bold.cyan(inputFile))

  const css = readFile(inputFile)
  const plugins = [tailwind(configFile), autoprefixer]

  const result = postcss(plugins).process(css, {
    from: inputFile,
    to: outputFile,
  })

  writeFile(outputFile, result.css)

  const prettyTime = prettyHrtime(process.hrtime(time))

  log()
  log(emoji.yes, 'Finished in', chalk.bold.magenta(prettyTime))
  log(emoji.pack, 'Size:', chalk.bold.magenta(bytes(result.css.length)))
  log(emoji.disk, 'Saved to', chalk.bold.cyan(outputFile))
}
