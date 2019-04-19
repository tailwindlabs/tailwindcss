import { copyFileSync, ensureFileSync, existsSync, outputFileSync, readFileSync } from 'fs-extra'
import { findKey, mapValues, startsWith, trimStart } from 'lodash'

import * as colors from './colors'
import * as emoji from './emoji'
import packageJson from '../../package.json'

/**
 * Gets CLI parameters.
 *
 * @param {string[]} cliArgs
 * @return {string[]}
 */
export const parseCliParams = cliArgs => {
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
export const parseCliOptions = (cliArgs, optionMap = {}) => {
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
export const log = (...msgs) => {
  console.log('  ', ...msgs)
}

/**
 * Prints application header to console.
 */
export const header = () => {
  log()
  log(colors.bold(packageJson.name), colors.info(packageJson.version))
}

/**
 * Prints application footer to console.
 */
export const footer = () => {
  log()
}

/**
 * Prints error messages to console.
 *
 * @param {...string} [msgs]
 */
export const error = (...msgs) => {
  log()
  console.error('  ', emoji.no, colors.error(msgs.join(' ')))
}

/**
 * Kills the process. Optionally prints error messages to console.
 *
 * @param {...string} [msgs]
 */
export const die = (...msgs) => {
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
export const exists = path => existsSync(path)

/**
 * Copies file source to destination.
 *
 * @param {string} source
 * @param {string} destination
 */
export const copyFile = (source, destination) => {
  copyFileSync(source, destination)
}

/**
 * Gets file content.
 *
 * @param {string} path
 * @return {string}
 */
export const readFile = path => readFileSync(path, 'utf-8')

/**
 * Writes content to file.
 *
 * @param {string} path
 * @param {string} content
 * @return {string}
 */
export const writeFile = (path, content) => {
  ensureFileSync(path)

  return outputFileSync(path, content)
}

/**
 * Strips leading ./ from path
 *
 * @param {string} path
 * @return {string}
 */
export const getSimplePath = path => (startsWith(path, './') ? path.slice(2) : path)
