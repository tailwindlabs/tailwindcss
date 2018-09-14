import main from './cli/main'
import { log, die } from './cli/utils'

/**
 * Runs the CLI application.
 */
function run() {
  try {
    main(process.argv.slice(2))
    log()
  } catch (e) {
    die(e.stack)
  }
}

run()
