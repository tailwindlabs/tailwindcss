import chalk from 'chalk'
import { ensureFileSync, existsSync, outputFileSync, readFileSync } from 'fs-extra'
import { findKey, mapValues, trimStart } from 'lodash'

import * as emoji from './emoji'
import packageJson from '../../package.json'

/**
 * Gets CLI parameters.
 *
 * @param {string[]} cliArgs
 * @return {string[]}
 */
export function parseCliParams(cliArgs) {
  const firstOptionIndex = cliArgs.findIndex(cliArg => cliArg.startsWith('-'))

  return firstOptionIndex > -1 ? cliArgs.slice(0, firstOptionIndex) : cliArgs
}

/**
 * Gets mapped CLI options.
 *
 * @param {string[]} cliArgs
 * @param {object} [optionMap]
 * @return {object}
 */
export function parseCliOptions(cliArgs, optionMap = {}) {
  let options = {}
  let currentOption = []

  cliArgs.forEach(cliArg => {
    const option = cliArg.startsWith('-') && trimStart(cliArg, '-').toLowerCase()
    const resolvedOption = findKey(optionMap, aliases => aliases.includes(option))

    if (resolvedOption) {
      currentOption = options[resolvedOption] || (options[resolvedOption] = [])
    } else if (option) {
      currentOption = []
    } else {
      currentOption.push(cliArg)
    }
  })

  return { ...mapValues(optionMap, () => undefined), ...options }
}

/**
 * Prints messages to console.
 *
 * @param {...string} [msgs]
 */
export function log(...msgs) {
  console.log('  ', ...msgs)
}

/**
 * Prints application header to console.
 */
export function header() {
  log()
  log(chalk.bold(packageJson.name), chalk.bold.cyan(packageJson.version))
}

/**
 * Prints application footer to console.
 */
export function footer() {
  log()
}

/**
 * Prints error messages to console.
 *
 * @param {...string} [msgs]
 */
export function error(...msgs) {
  log()
  console.error('  ', emoji.no, chalk.bold.red(msgs.join(' ')))
}

/**
 * Kills the process. Optionally prints error messages to console.
 *
 * @param {...string} [msgs]
 */
export function die(...msgs) {
  msgs.length && error(...msgs)
  footer()
  process.exit(1) // eslint-disable-line
}

/**
 * Checks if path exists.
 *
 * @param {string} path
 * @return {boolean}
 */
export function exists(path) {
  return existsSync(path)
}

/**
 * Gets file content.
 *
 * @param {string} path
 * @return {string}
 */
export function readFile(path) {
  return readFileSync(path, 'utf-8')
}

/**
 * Writes content to file.
 *
 * @param {string} path
 * @param {string} content
 * @return {string}
 */
export function writeFile(path, content) {
  ensureFileSync(path)

  return outputFileSync(path, content)
}
