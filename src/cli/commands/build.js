import autoprefixer from 'autoprefixer'
import bytes from 'bytes'
import chalk from 'chalk'
import prettyHrtime from 'pretty-hrtime'

import tailwind from '../..'

import commands from '.'
import compile from '../compile'
import * as emoji from '../emoji'
import * as utils from '../utils'

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
  {
    usage: '--no-autoprefixer',
    description: "Don't add vendor prefixes using autoprefixer.",
  },
]

export const optionMap = {
  output: ['output', 'o'],
  config: ['config', 'c'],
  noAutoprefixer: ['no-autoprefixer'],
}

/**
 * Prints the error message and stops the process.
 *
 * @param {...string} [msgs]
 */
function stop(...msgs) {
  utils.header()
  utils.error(...msgs)
  utils.die()
}

/**
 * Prints the error message and help for this command, then stops the process.
 *
 * @param {...string} [msgs]
 */
function stopWithHelp(...msgs) {
  utils.header()
  utils.error(...msgs)
  commands.help.forCommand(commands.build)
  utils.die()
}

/**
 * Compiles CSS file and writes it to stdout.
 *
 * @param {CompileOptions} compileOptions
 * @return {Promise}
 */
function buildToStdout(compileOptions) {
  return compile(compileOptions).then(result => process.stdout.write(result.css))
}

/**
 * Compiles CSS file and writes it to a file.
 *
 * @param {CompileOptions} compileOptions
 * @param {int[]} startTime
 * @return {Promise}
 */
function buildToFile(compileOptions, startTime) {
  utils.header()
  utils.log()
  utils.log(emoji.go, 'Building...', chalk.bold.cyan(compileOptions.inputFile))

  return compile(compileOptions).then(result => {
    utils.writeFile(compileOptions.outputFile, result.css)

    const prettyTime = prettyHrtime(process.hrtime(startTime))

    utils.log()
    utils.log(emoji.yes, 'Finished in', chalk.bold.magenta(prettyTime))
    utils.log(emoji.pack, 'Size:', chalk.bold.magenta(bytes(result.css.length)))
    utils.log(emoji.disk, 'Saved to', chalk.bold.cyan(compileOptions.outputFile))
    utils.footer()
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
    const autoprefix = !cliOptions.noAutoprefixer

    !inputFile && stopWithHelp('CSS file is required.')
    !utils.exists(inputFile) && stop(chalk.bold.magenta(inputFile), 'does not exist.')

    configFile &&
      !utils.exists(configFile) &&
      stop(chalk.bold.magenta(configFile), 'does not exist.')

    const compileOptions = {
      inputFile,
      outputFile,
      plugins: [tailwind(configFile)].concat(autoprefix ? [autoprefixer] : []),
    }

    const buildPromise = outputFile
      ? buildToFile(compileOptions, startTime)
      : buildToStdout(compileOptions)

    buildPromise.then(resolve).catch(reject)
  })
}
