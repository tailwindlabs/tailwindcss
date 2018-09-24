import chalk from 'chalk'
import { forEach, map, padEnd } from 'lodash'

import commands from '.'
import constants from '../constants'
import { die, error, footer, header, log } from '../utils'

export const usage = 'help [command]'
export const description = 'More information about the command.'

/**
 * Prints general help.
 */
export function forApp() {
  const pad = Math.max(...map(commands, 'usage.length')) + 3

  log()
  log('Usage:')
  log('  ', chalk.bold(constants.cli + ' <command> [options]'))
  log()
  log('Commands:')
  forEach(commands, command => {
    log('  ', chalk.bold(padEnd(command.usage, pad)), command.description)
  })
}

/**
 * Prints help for a command.
 *
 * @param {object} command
 */
export function forCommand(command) {
  log()
  log('Usage:')
  log('  ', chalk.bold(constants.cli, command.usage))
  log()
  log('Description:')
  log('  ', chalk.bold(command.description))

  if (command.options) {
    const pad = Math.max(...map(command.options, 'usage.length')) + 3

    log()
    log('Options:')
    forEach(command.options, option => {
      log('  ', chalk.bold(padEnd(option.usage, pad)), option.description)
    })
  }
}

/**
 * Prints invalid command error and general help. Kills the process.
 *
 * @param {string} commandName
 */
export function invalidCommand(commandName) {
  error('Invalid command:', chalk.bold.magenta(commandName))
  forApp()
  die()
}

/**
 * Runs the command.
 *
 * @param {string[]} cliParams
 * @return {Promise}
 */
export function run(cliParams) {
  return new Promise(resolve => {
    header()

    const commandName = cliParams[0]
    const command = commands[commandName]

    !commandName && forApp()
    commandName && command && forCommand(command)
    commandName && !command && invalidCommand(commandName)

    footer()
    resolve()
  })
}
