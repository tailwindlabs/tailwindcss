#!/usr/bin/env node

import { globby } from 'globby'
import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../tailwindcss/src/design-system'
import { formatNodes } from './codemods/format-nodes'
import { help } from './commands/help'
import {
  analyze as analyzeStylesheets,
  migrate as migrateStylesheet,
  prepare as prepareStylesheet,
  split as splitStylesheets,
  type MigrateOptions,
  type Stylesheet,
} from './migrate'
import { migrate as migrateTemplate } from './template/migrate'
import { parseConfig } from './template/parseConfig'
import { args, type Arg } from './utils/args'
import { isRepoDirty } from './utils/git'
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

  let parsedConfig: {
    designSystem: DesignSystem
    globs: { pattern: string; base: string }[]
    userConfig: Config
    newPrefix: string | null
  } | null = null
  if (flags['--config']) {
    try {
      parsedConfig = await parseConfig(flags['--config'], { base: process.cwd() })
    } catch (e: any) {
      error(`Failed to parse the configuration file: ${e.message}`)
      process.exit(1)
    }
  }

  if (parsedConfig) {
    // Template migrations

    info('Migrating templates using the provided configuration file.')

    let set = new Set<string>()
    for (let { pattern, base } of parsedConfig.globs) {
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
      files.map((file) =>
        migrateTemplate(parsedConfig.designSystem, parsedConfig.userConfig, file),
      ),
    )

    success('Template migration complete.')
  }

  {
    // Stylesheet migrations

    // Use provided files
    let files = flags._.map((file) => path.resolve(process.cwd(), file))

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
    let stylesheets: Stylesheet[] = files.map((file) => ({ file }))

    // Load and parse all stylesheets
    let prepareResults = await Promise.allSettled(
      stylesheets.map((sheet) => prepareStylesheet(sheet)),
    )

    for (let result of prepareResults) {
      if (result.status === 'rejected') {
        error(`${result.reason}`)
      }
    }

    // Analyze the stylesheets
    try {
      await analyzeStylesheets(stylesheets)
    } catch (e: unknown) {
      error(`${e}`)
    }

    // Migrate each file
    let options: MigrateOptions = {
      newPrefix: parsedConfig?.newPrefix ?? undefined,
      designSystem: parsedConfig?.designSystem,
      userConfig: parsedConfig?.userConfig,
    }

    let migrateResults = await Promise.allSettled(
      stylesheets.map((sheet) => migrateStylesheet(sheet, options)),
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
    // 1. Unlink all files that are no longer needed go first
    // 2. Write them all sequentially
    for (let sheet of stylesheets.sort((a, z) => {
      if (a.unlink && !z.unlink) return -1
      if (!a.unlink && z.unlink) return 1
      return 0
    })) {
      if (sheet.unlink) {
        await fs.unlink(sheet.file!)
      } else {
        await fs.writeFile(sheet.file!, sheet.root!.toString())
      }
    }

    success('Stylesheet migration complete.')
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
