#!/usr/bin/env node

import main from './cli/main'
import { die } from './cli/utils'

main(process.argv.slice(2)).catch(error => die(error.stack))
