import autoprefixer from 'autoprefixer'
import bytes from 'bytes'
import chokidar from 'chokidar'
import prettyHrtime from 'pretty-hrtime'

import tailwind from '../..'
import { defaultConfigFile } from '../../constants'

import compile from '../compile'
import * as colors from '../colors'
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
  {
    usage: '--watch',
    description: 'Watch for the file changes.',
  },
]

export const optionMap = {
  output: ['output', 'o'],
  config: ['config', 'c'],
  noAutoprefixer: ['no-autoprefixer'],
  watch: ['watch'],
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
 * @param {[number, number]} startTime
 * @return {Promise}
 */
function buildToFile(compileOptions, startTime) {
  const inputFileSimplePath = utils.getSimplePath(compileOptions.inputFile)
  const outputFileSimplePath = utils.getSimplePath(compileOptions.outputFile)

  utils.pad(
    emoji.go,
    ...(inputFileSimplePath
      ? ['Building:', [colors.file, inputFileSimplePath]]
      : ['Building from default CSS...', [colors.info, '(No input file provided)']]),
    [colors.info, new Date().toLocaleTimeString()]
  )

  return compile(compileOptions).then(result => {
    utils.writeFile(compileOptions.outputFile, result.css)

    const prettyTime = prettyHrtime(process.hrtime(startTime))

    utils.log()
    utils.log(emoji.yes, 'Finished in', colors.info(prettyTime))
    utils.log(emoji.pack, 'Size:', colors.info(bytes(result.css.length)))
    utils.log(emoji.disk, 'Saved to', colors.file(outputFileSimplePath))
    utils.footer()
  })
}

/**
 * Starts a watcher.
 *
 * @param {string[]} files
 * @param {(startTime: [number, number]) => Promise} build
 * @param {boolean} canLog
 */
function startWatcher(files, build, canLog) {
  if (canLog) {
    utils.log(emoji.eyes, 'Started a watcher. Files being watched:', colors.info(files.join(', ')))
    utils.log()
  }

  build(process.hrtime())

  chokidar.watch(files).on('change', () => {
    utils.clear()
    build(process.hrtime())
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
    const watch = cliOptions.watch
    const inputFileSimplePath = utils.getSimplePath(inputFile)
    const configFileSimplePath = utils.getSimplePath(configFile)

    if (inputFile && !utils.exists(inputFile)) {
      stop(colors.file(inputFileSimplePath), 'does not exist.')
    }

    if (configFile && !utils.exists(configFile)) {
      stop(colors.file(configFileSimplePath), 'does not exist.')
    }

    const compileOptions = {
      inputFile,
      outputFile,
      plugins: [tailwind(configFile)].concat(autoprefix ? [autoprefixer] : []),
    }

    if (outputFile) {
      utils.header()
      utils.log()
    }

    const build = startTimeToReport =>
      outputFile ? buildToFile(compileOptions, startTimeToReport) : buildToStdout(compileOptions)

    if (watch) {
      startWatcher([configFile || defaultConfigFile, inputFile], build, !!outputFile)
    } else {
      build(startTime)
        .then(resolve)
        .catch(reject)
    }
  })
}
