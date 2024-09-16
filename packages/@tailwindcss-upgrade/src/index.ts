#!/usr/bin/env node

import fastGlob from 'fast-glob'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { help } from './commands/help'
import { migrate } from './migrate'
import { args, type Arg } from './utils/args'
import { eprintln, error, header, highlight, info, success } from './utils/renderer'

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

async function run() {
  eprintln(header())
  eprintln()

  if (!flags['--force']) {
    let stdout = execSync('git status --porcelain', { encoding: 'utf-8' })
    if (stdout.trim()) {
      error('Git directory is not clean. Please stash or commit your changes before migrating.')
      info(`You may use the ${highlight('--force')} flag to override this safety check.`)
      process.exit(1)
    }
  }

  // Use provided files
  let files = flags._.map((file) => path.resolve(process.cwd(), file))

  // Discover CSS files in case no files were provided
  if (files.length === 0) {
    info(
      'No files provided. Searching for CSS files in the current directory and its subdirectories…',
    )

    files = await fastGlob(['**/*.css'], {
      absolute: true,
      ignore: ['**/node_modules', '**/vendor'],
    })
  }

  // Ensure we are only dealing with CSS files
  files = files.filter((file) => file.endsWith('.css'))

  // Migrate each file
  await Promise.allSettled(files.map((file) => migrate(file)))

  // Figure out if we made any changes
  let stdout = execSync('git status --porcelain', { encoding: 'utf-8' })
  if (stdout.trim()) {
    success('Migration complete. Verify the changes and commit them to your repository.')
  } else {
    success('Migration complete. No changes were made to your repository.')
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
