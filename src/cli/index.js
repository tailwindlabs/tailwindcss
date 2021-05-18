#!/usr/bin/env node

import main from './main'
import * as utils from './utils'

main(process.argv.slice(2)).catch((error) => utils.die(error.stack))
