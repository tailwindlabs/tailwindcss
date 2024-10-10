#!/usr/bin/env node

import { globby } from 'globby'
import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import { formatNodes } from './codemods/format-nodes'
import { help } from './commands/help'
import {
  analyze as analyzeStylesheets,
  migrate as migrateStylesheet,
  split as splitStylesheets,
} from './migrate'
import { migrateJsConfig } from './migrate-js-config'
import { migratePostCSSConfig } from './migrate-postcss'
import { Stylesheet } from './stylesheet'
import { migrate as migrateTemplate } from './template/migrate'
import { prepareConfig } from './template/prepare-config'
import { args, type Arg } from './utils/args'
import { isRepoDirty } from './utils/git'
import { pkg } from './utils/packages'
import { eprintln, error, header, highlight, info, success } from './utils/renderer'

const options = {
  '--config': { type: 'string', description: 'Path to the configuration file', alias: '-c' },
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
  let base = process.cwd()

  eprintln(header())
  eprintln()

  if (!flags['--force']) {
    if (isRepoDirty()) {
      error('Git directory is not clean. Please stash or commit your changes before migrating.')
      info(
        `You may use the ${highlight('--force')} flag to silence this warning and perform the migration.`,
      )
      process.exit(1)
    }
  }

  let config = await prepareConfig(flags['--config'], { base })

  {
    // Template migrations

    info('Migrating templates using the provided configuration file.')

    let set = new Set<string>()
    for (let { pattern, base } of config.globs) {
      let files = await globby([pattern], {
        absolute: true,
        gitignore: true,
        cwd: base,
      })

      for (let file of files) {
        set.add(file)
      }
    }

    let files = Array.from(set)
    files.sort()

    // Migrate each file
    await Promise.allSettled(
      files.map((file) => migrateTemplate(config.designSystem, config.userConfig, file)),
    )

    success('Template migration complete.')
  }

  // Migrate JS config

  info('Migrating JavaScript configuration files using the provided configuration file.')
  let jsConfigMigration = await migrateJsConfig(config.configFilePath, base)

  {
    // Stylesheet migrations

    // Use provided files
    let files = flags._.map((file) => path.resolve(base, file))

    // Discover CSS files in case no files were provided
    if (files.length === 0) {
      info(
        'No input stylesheets provided. Searching for CSS files in the current directory and its subdirectories…',
      )

      files = await globby(['**/*.css'], {
        absolute: true,
        gitignore: true,
      })
    }

    // Ensure we are only dealing with CSS files
    files = files.filter((file) => file.endsWith('.css'))

    // Analyze the stylesheets
    let loadResults = await Promise.allSettled(files.map((filepath) => Stylesheet.load(filepath)))

    // Load and parse all stylesheets
    for (let result of loadResults) {
      if (result.status === 'rejected') {
        error(`${result.reason}`)
      }
    }

    let stylesheets = loadResults
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)

    // Analyze the stylesheets
    try {
      await analyzeStylesheets(stylesheets)
    } catch (e: unknown) {
      error(`${e}`)
    }

    // Migrate each file
    let migrateResults = await Promise.allSettled(
      stylesheets.map((sheet) => migrateStylesheet(sheet, { ...config, jsConfigMigration })),
    )

    for (let result of migrateResults) {
      if (result.status === 'rejected') {
        error(`${result.reason}`)
      }
    }

    // Split up stylesheets (as needed)
    try {
      await splitStylesheets(stylesheets)
    } catch (e: unknown) {
      error(`${e}`)
    }

    // Format nodes
    for (let sheet of stylesheets) {
      await postcss([formatNodes()]).process(sheet.root!, { from: sheet.file! })
    }

    // Write all files to disk
    for (let sheet of stylesheets) {
      if (!sheet.file) continue

      await fs.writeFile(sheet.file, sheet.root.toString())
    }

    success('Stylesheet migration complete.')
  }

  {
    // PostCSS config migration
    await migratePostCSSConfig(base)
  }

  try {
    // Upgrade Tailwind CSS
    await pkg('add tailwindcss@next', base)
  } catch {}

  // Remove the JS config if it was fully migrated
  if (jsConfigMigration !== null) {
    await fs.rm(config.configFilePath)
  }

  // Figure out if we made any changes
  if (isRepoDirty()) {
    success('Verify the changes and commit them to your repository.')
  } else {
    success('No changes were made to your repository.')
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
