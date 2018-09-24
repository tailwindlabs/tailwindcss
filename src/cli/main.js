import commands from './commands'
import * as utils from './utils'

/**
 * CLI application entrypoint.
 *
 * @param {string[]} cliArgs
 * @return {Promise}
 */
export default function run(cliArgs) {
  return new Promise((resolve, reject) => {
    const params = utils.parseCliParams(cliArgs)
    const command = commands[params[0]]
    const options = command ? utils.parseCliOptions(cliArgs, command.optionMap) : {}

    const commandPromise = command
      ? command.run(params.slice(1), options)
      : commands.help.run(params)

    commandPromise.then(resolve).catch(reject)
  })
}
