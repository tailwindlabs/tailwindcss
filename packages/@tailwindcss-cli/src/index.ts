#!/usr/bin/env node

import { args, type Arg } from './utils/args'

import * as build from './commands/build'
import * as canonicalize from './commands/canonicalize'
import { help } from './commands/help'

const sharedOptions = {
  '--help': { type: 'boolean', description: 'Display usage information', alias: '-h' },
} satisfies Arg

function buildUsage(command = 'tailwindcss') {
  return `${command} [--input input.css] [--output output.css] [--watch] [options…]`
}

function rootHelp({ invalid }: { invalid?: string } = {}) {
  help({
    invalid,
    usage: [buildUsage('tailwindcss'), buildUsage('tailwindcss build'), canonicalize.usage()],
    commands: {
      build: 'Build your CSS',
      canonicalize: 'Canonicalize candidate lists',
    },
    options: { ...build.options(), ...sharedOptions },
  })
}

async function run() {
  let argv = process.argv.slice(2)
  let command = argv[0]
  let rootFlags = args({ ...build.options(), ...sharedOptions }, argv)

  if (command === 'build') {
    let flags = args({ ...build.options(), ...sharedOptions }, argv.slice(1))

    if ((process.stdout.isTTY && argv.length === 1) || flags['--help']) {
      help({
        usage: [buildUsage('tailwindcss build')],
        options: { ...build.options(), ...sharedOptions },
      })
      process.exit(0)
    }

    await build.handle(flags)
    return
  }

  if (command === 'canonicalize') {
    let result = await canonicalize.runCommandLine({ argv: argv.slice(1) })

    if (result.stdout.length > 0) {
      process.stdout.write(`${result.stdout}\n`)
    }

    if (result.stderr.length > 0) {
      process.stderr.write(`${result.stderr}\n`)
    }

    process.exitCode = result.exitCode
    return
  }

  if ((process.stdout.isTTY && command === undefined) || rootFlags['--help']) {
    rootHelp()
    process.exit(0)
  }

  if (command && !command.startsWith('-')) {
    rootHelp({ invalid: command })
    process.exit(1)
  }

  let flags = args({
    ...build.options(),
    ...sharedOptions,
  })

  await build.handle(flags)
}

await run()
