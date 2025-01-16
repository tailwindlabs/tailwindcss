#!/usr/bin/env node

import { args, type Arg } from './utils/args'

import * as build from './commands/build'
import { help } from './commands/help'

const sharedOptions = {
  '--help': { type: 'boolean', description: 'Display usage information', alias: '-h' },
} satisfies Arg

const flags = args({
  ...build.options(),
  ...sharedOptions,
})
const command = flags._[0]

// Right now we don't support any sub-commands. Let's show the help message
// instead.
if (command) {
  help({
    invalid: command,
    usage: ['tailwindcss [options]'],
    options: { ...build.options(), ...sharedOptions },
  })
  process.exit(1)
}

// Display main help message if no command is being used.
//
// E.g.:
//
//   - `tailwindcss`                // should show the help message
//
// E.g.: implicit `build` command
//
//   - `tailwindcss -o output.css`  // should run the build command, not show the help message
//   - `tailwindcss > output.css`   // should run the build command, not show the help message
if ((process.stdout.isTTY && process.argv[2] === undefined) || flags['--help']) {
  help({
    usage: ['tailwindcss [--input input.css] [--output output.css] [--watch] [options…]'],
    options: { ...build.options(), ...sharedOptions },
  })
  process.exit(0)
}

// Handle the build command
build.handle(flags)
