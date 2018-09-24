import commands from './commands'
import { parseCliOptions, parseCliParams } from './utils'

/**
 * CLI application entrypoint.
 *
 * @param {string[]} cliArgs
 * @return {Promise}
 */
export default function run(cliArgs) {
  return new Promise((resolve, reject) => {
    const params = parseCliParams(cliArgs)
    const command = commands[params[0]]
    const options = command ? parseCliOptions(cliArgs, command.optionMap) : {}

    const promise = command ? command.run(params.slice(1), options) : commands.help.run(params)

    promise.then(resolve).catch(reject)
  })
}
