#!/usr/bin/env node

import { execSync } from 'node:child_process'
import path from 'node:path'
import pc from 'picocolors'
import { help } from './commands/help'
import { migrate } from './migrate'
import { args, type Arg } from './utils/args'
import { eprintln, header, highlight, wordWrap } from './utils/renderer'

const options = {
  '--help': { type: 'boolean', description: 'Display usage information', alias: '-h' },
  '--force': { type: 'boolean', description: 'Force the migration', alias: '-f' },
  '--version': { type: 'boolean', description: 'Display the version number', alias: '-v' },
} satisfies Arg
const flags = args(options)

if (flags['--help']) {
  help({
    usage: ['npx @tailwindcss/upgrade'],
    options,
  })
  process.exit(0)
}

const file = flags._[0]

async function run() {
  eprintln(header())
  eprintln()

  if (!flags['--force']) {
    let stdout = execSync('git status --porcelain', { encoding: 'utf-8' })
    if (stdout.trim()) {
      wordWrap(
        'Git directory is not clean. Please stash or commit your changes before migrating.',
        process.stderr.columns - 5 - 4,
      ).map((line) => eprintln(`${pc.red('\u2502')} ${line}`))
      wordWrap(
        `You may use the ${highlight('--force')} flag to silence this warning and perform the migration.`,
        process.stderr.columns - 2 - 4,
      ).map((line) => eprintln(`${pc.red('\u2502')} ${line}`))
      eprintln()
      process.exit(1)
    }
  }

  await migrate(path.resolve(process.cwd(), file))
}

run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
