import autoprefixer from 'autoprefixer'
import bytes from 'bytes'
import chalk from 'chalk'
import postcss from 'postcss'
import prettyHrtime from 'pretty-hrtime'

import tailwind from '../..'

import commands from '.'
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
 * Compiles CSS file.
 *
 * @param {string} inputFile
 * @param {string} configFile
 * @param {string} outputFile
 * @param {boolean} autoprefix
 * @return {Promise}
 */
function build(inputFile, configFile, outputFile, autoprefix) {
  const css = utils.readFile(inputFile)

  return new Promise((resolve, reject) => {
    postcss([tailwind(configFile)].concat(autoprefix ? [autoprefixer] : []))
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
 * @param {boolean} autoprefix
 * @return {Promise}
 */
function buildToStdout(inputFile, configFile, outputFile, autoprefix) {
  return build(inputFile, configFile, outputFile, autoprefix).then(result =>
    process.stdout.write(result.css)
  )
}

/**
 * Compiles CSS file and writes it to a file.
 *
 * @param {string} inputFile
 * @param {string} configFile
 * @param {string} outputFile
 * @param {boolean} autoprefix
 * @param {int[]} startTime
 * @return {Promise}
 */
function buildToFile(inputFile, configFile, outputFile, autoprefix, startTime) {
  utils.header()
  utils.log()
  utils.log(emoji.go, 'Building...', chalk.bold.cyan(inputFile))

  return build(inputFile, configFile, outputFile, autoprefix).then(result => {
    utils.writeFile(outputFile, result.css)

    const prettyTime = prettyHrtime(process.hrtime(startTime))

    utils.log()
    utils.log(emoji.yes, 'Finished in', chalk.bold.magenta(prettyTime))
    utils.log(emoji.pack, 'Size:', chalk.bold.magenta(bytes(result.css.length)))
    utils.log(emoji.disk, 'Saved to', chalk.bold.cyan(outputFile))
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

    const buildPromise = outputFile
      ? buildToFile(inputFile, configFile, outputFile, autoprefix, startTime)
      : buildToStdout(inputFile, configFile, outputFile, autoprefix)

    buildPromise.then(resolve).catch(reject)
  })
}
