#!/usr/bin/env node

import main from './cli/main'
import { log, die } from './cli/utils'

/**
 * Runs the CLI application.
 */
function run() {
  main(process.argv.slice(2))
    .then(() => log())
    .catch(error => die(error.stack))
}

run()
