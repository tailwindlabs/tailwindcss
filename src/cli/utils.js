import { copyFileSync, ensureFileSync, existsSync, outputFileSync, readFileSync } from 'fs-extra'
import { findKey, mapValues, startsWith, trimStart, isArray, initial, last, sum } from 'lodash'

import * as colors from './colors'
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
  console.log(...msgs)
}

/**
 * Prints application header to console.
 */
export function header() {
  log()
  log(colors.bold(packageJson.name), colors.info(packageJson.version))
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
  console.error('  ', emoji.no, colors.error(msgs.join(' ')))
}

/**
 * Clears the console.
 */
export function clear() {
  console.clear()
}

/**
 * Logs to the console with the last item pulled to the right edge of the terminal window.
 *
 * @param {...(string | [string, string])} [items] - When an item is a tuple of two strings, the first value is a
 * modifier (e.g. color) that does not take any vertical space on the screen (i.e. its characters are not occupying
 * available columns). The second value is a string that is visible to the user and does take vertical space.
 */
export function pad(...items) {
  const paddingWidth =
    process.stdout.columns -
    // all strings
    sum(items.map(item => (isArray(item) ? item[1] : item).length)) -
    // all spaces between strings
    (items.length - 1) -
    // additional space character from the padding section
    1

  const padding = Array(paddingWidth || 0)
    .fill(' ')
    .join('')

  log(
    ...initial(items).map(item => (isArray(item) ? item[0](item[1]) : item)),
    padding,
    (item => (isArray(item) ? item[0](item[1]) : item))(last(items))
  )
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
 * Copies file source to destination.
 *
 * @param {string} source
 * @param {string} destination
 */
export function copyFile(source, destination) {
  copyFileSync(source, destination)
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

/**
 * Strips leading ./ from path
 *
 * @param {string} path
 * @return {string}
 */
export function getSimplePath(path) {
  return startsWith(path, './') ? path.slice(2) : path
}
