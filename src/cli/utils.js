import chalk from 'chalk'
import { ensureFileSync, existsSync, outputFileSync, readFileSync } from 'fs-extra'
import { findKey, mapValues, trimStart } from 'lodash'

import emoji from './emoji'

/**
 * Gets CLI parameters.
 *
 * @param {string[]} args CLI arguments
 * @return {string[]}
 */
export function parseCliParams(args) {
  const firstOptionIndex = args.findIndex(arg => arg.startsWith('-'))

  return firstOptionIndex > -1 ? args.slice(0, firstOptionIndex) : args
}

/**
 * Gets mapped CLI options.
 *
 * @param {string[]} args CLI arguments
 * @param {object} [optionMap]
 * @return {object}
 */
export function parseCliOptions(args, optionMap = {}) {
  let options = {}
  let currentOption = []

  args.forEach(arg => {
    const option = arg.startsWith('-') && trimStart(arg, '-').toLowerCase()
    const resolvedOption = findKey(optionMap, aliases => aliases.includes(option))

    if (resolvedOption) {
      currentOption = options[resolvedOption] || (options[resolvedOption] = [])
    } else if (option) {
      currentOption = []
    } else {
      currentOption.push(arg)
    }
  })

  return { ...mapValues(optionMap, () => undefined), ...options }
}

/**
 * Prints messages to console.
 *
 * @param {...string} msgs
 */
export function log(...msgs) {
  console.log('  ', ...msgs)
}

/**
 * Prints error messages to console.
 *
 * @param {...string} msgs
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
  log()
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
