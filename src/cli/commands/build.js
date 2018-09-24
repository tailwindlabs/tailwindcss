import autoprefixer from 'autoprefixer'
import bytes from 'bytes'
import chalk from 'chalk'
import postcss from 'postcss'
import prettyHrtime from 'pretty-hrtime'

import commands from '.'
import emoji from '../emoji'
import tailwind from '../..'
import { die, error, exists, footer, header, log, readFile, writeFile } from '../utils'

export const usage = 'build <file> [options]'
export const description = 'Compiles Tailwind CSS file.'

export const options = [
  {
    usage: '-o, --output <file>',
    description: 'Output file.',
  },
  {
    usage: '-c, --config <file>',
    description: 'Tailwind config file.',
  },
]

export const optionMap = {
  output: ['output', 'o'],
  config: ['config', 'c'],
}

/**
 * Prints the error message and stops the process.
 *
 * @param {...string} [msgs]
 */
function stop(...msgs) {
  header()
  error(...msgs)
  die()
}

/**
 * Prints the error message and help for this command, then stops the process.
 *
 * @param {...string} [msgs]
 */
function stopWithHelp(...msgs) {
  header()
  error(...msgs)
  commands.help.forCommand(commands.build)
  die()
}

/**
 * Compiles CSS file.
 *
 * @param {string} inputFile
 * @param {string} configFile
 * @param {string} outputFile
 * @return {Promise}
 */
function build(inputFile, configFile, outputFile) {
  const css = readFile(inputFile)

  return new Promise((resolve, reject) => {
    postcss([tailwind(configFile), autoprefixer])
      .process(css, {
        from: inputFile,
        to: outputFile,
      })
      .then(resolve)
      .catch(reject)
  })
}

/**
 * Compiles CSS file and writes it to stdout.
 *
 * @param {string} inputFile
 * @param {string} configFile
 * @param {string} outputFile
 * @return {Promise}
 */
function buildToStdout(inputFile, configFile, outputFile) {
  return build(inputFile, configFile, outputFile).then(result => process.stdout.write(result.css))
}

/**
 * Compiles CSS file and writes it to a file.
 *
 * @param {string} inputFile
 * @param {string} configFile
 * @param {string} outputFile
 * @param {int[]} startTime
 * @return {Promise}
 */
function buildToFile(inputFile, configFile, outputFile, startTime) {
  header()
  log()
  log(emoji.go, 'Building...', chalk.bold.cyan(inputFile))

  return build(inputFile, configFile, outputFile).then(result => {
    writeFile(outputFile, result.css)

    const prettyTime = prettyHrtime(process.hrtime(startTime))

    log()
    log(emoji.yes, 'Finished in', chalk.bold.magenta(prettyTime))
    log(emoji.pack, 'Size:', chalk.bold.magenta(bytes(result.css.length)))
    log(emoji.disk, 'Saved to', chalk.bold.cyan(outputFile))
    footer()
  })
}

/**
 * Runs the command.
 *
 * @param {string[]} cliParams
 * @param {object} cliOptions
 * @return {Promise}
 */
export function run(cliParams, cliOptions) {
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime()
    const inputFile = cliParams[0]
    const configFile = cliOptions.config && cliOptions.config[0]
    const outputFile = cliOptions.output && cliOptions.output[0]

    !inputFile && stopWithHelp('CSS file is required.')
    !exists(inputFile) && stop(chalk.bold.magenta(inputFile), 'does not exist.')
    configFile && !exists(configFile) && stop(chalk.bold.magenta(configFile), 'does not exist.')

    const promise = outputFile
      ? buildToFile(inputFile, configFile, outputFile, startTime)
      : buildToStdout(inputFile, configFile, outputFile)

    promise.then(resolve).catch(reject)
  })
}
