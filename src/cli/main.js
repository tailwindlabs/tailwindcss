import chalk from 'chalk'

import commands from './commands'
import packageJson from '../../package.json'
import { log, parseCliOptions, parseCliParams } from './utils'

/**
 * CLI application entrypoint.
 */
export default function run(args) {
  log()
  log(chalk.bold(packageJson.name), chalk.bold.cyan(packageJson.version))

  const params = parseCliParams(args)
  const commandName = params[0] || 'help'

  !commands[commandName] && commands.help.invalidCommand(commandName)

  const options = parseCliOptions(args, commands[commandName].optionMap)

  return commands[commandName].run(params, options)
}
