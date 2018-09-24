#!/usr/bin/env node

import main from './cli/main'
import * as utils from './cli/utils'

main(process.argv.slice(2)).catch(error => utils.die(error.stack))
