#!/usr/bin/env node

import { globby, isGitIgnored } from 'globby'
import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import atImport from 'postcss-import'
import { formatNodes } from './codemods/format-nodes'
import { sortBuckets } from './codemods/sort-buckets'
import { help } from './commands/help'
import {
  analyze as analyzeStylesheets,
  linkConfigs as linkConfigsToStylesheets,
  migrate as migrateStylesheet,
  split as splitStylesheets,
} from './migrate'
import { migrateJsConfig } from './migrate-js-config'
import { migratePostCSSConfig } from './migrate-postcss'
import { migratePrettierPlugin } from './migrate-prettier'
import { Stylesheet } from './stylesheet'
import { migrate as migrateTemplate } from './template/migrate'
import { prepareConfig } from './template/prepare-config'
import { args, type Arg } from './utils/args'
import { isRepoDirty } from './utils/git'
import { hoistStaticGlobParts } from './utils/hoist-static-glob-parts'
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

  let cleanup: (() => void)[] = []

  if (!flags['--force']) {
    if (isRepoDirty()) {
      error('Git directory is not clean. Please stash or commit your changes before migrating.')
      info(
        `You may use the ${highlight('--force')} flag to silence this warning and perform the migration.`,
      )
      process.exit(1)
    }
  }

  {
    // Stylesheet migrations

    // Use provided files
    let files = flags._.map((file) => path.resolve(base, file))

    // Discover CSS files in case no files were provided
    if (files.length === 0) {
      info('Searching for CSS files in the current directory and its subdirectories…')

      files = await globby(['**/*.css'], {
        absolute: true,
        gitignore: true,
      })
    }

    // Ensure we are only dealing with CSS files
    files = files.filter((file) => file.endsWith('.css'))

    // Load the stylesheets and their imports
    let sheetsByFile = new Map<string, Stylesheet>()
    let isIgnored = await isGitIgnored()
    let queue = files.slice()
    while (queue.length > 0) {
      let file = queue.shift()!

      // Already handled
      if (sheetsByFile.has(file)) continue

      // We don't want to process ignored files (like node_modules)
      if (isIgnored(file)) continue

      let sheet = await Stylesheet.load(file).catch((e) => {
        error(`${e}`)
        return null
      })
      if (!sheet) continue

      // Track the sheet by its file
      sheetsByFile.set(file, sheet)

      // We process the stylesheet which will also process its imports and
      // inline everything. We still want to handle the imports separately, so
      // we just use the postcss-import messages to find the imported files.
      //
      // We can't use the `sheet.root` directly because this will mutate the
      // `sheet.root`
      let processed = await postcss().use(atImport()).process(sheet.root.toString(), { from: file })

      for (let msg of processed.messages) {
        if (msg.type === 'dependency' && msg.plugin === 'postcss-import') {
          queue.push(msg.file)
        }
      }
    }

    let stylesheets = Array.from(sheetsByFile.values())

    // Analyze the stylesheets
    try {
      await analyzeStylesheets(stylesheets)
    } catch (e: unknown) {
      error(`${e}`)
    }

    // Ensure stylesheets are linked to configs
    try {
      await linkConfigsToStylesheets(stylesheets, {
        configPath: flags['--config'],
        base,
      })
    } catch (e: unknown) {
      error(`${e}`)
    }

    // Migrate js config files, linked to stylesheets
    info('Migrating JavaScript configuration files using the provided configuration file.')
    let configBySheet = new Map<Stylesheet, Awaited<ReturnType<typeof prepareConfig>>>()
    let jsConfigMigrationBySheet = new Map<
      Stylesheet,
      Awaited<ReturnType<typeof migrateJsConfig>>
    >()
    for (let sheet of stylesheets) {
      if (!sheet.isTailwindRoot) continue

      let config = await prepareConfig(sheet.linkedConfigPath, { base })
      configBySheet.set(sheet, config)

      let jsConfigMigration = await migrateJsConfig(
        config.designSystem,
        config.configFilePath,
        base,
      )
      jsConfigMigrationBySheet.set(sheet, jsConfigMigration)

      if (jsConfigMigration !== null) {
        // Remove the JS config if it was fully migrated
        cleanup.push(() => fs.rm(config.configFilePath))
      }
    }

    // Migrate source files, linked to config files
    {
      // Template migrations

      info('Migrating templates using the provided configuration file.')
      for (let config of configBySheet.values()) {
        let set = new Set<string>()
        for (let globEntry of config.globs.flatMap((entry) => hoistStaticGlobParts(entry))) {
          let files = await globby([globEntry.pattern], {
            absolute: true,
            gitignore: true,
            cwd: globEntry.base,
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
      }

      success('Template migration complete.')
    }

    // Migrate each CSS file
    let migrateResults = await Promise.allSettled(
      stylesheets.map((sheet) => {
        let config = configBySheet.get(sheet)!
        let jsConfigMigration = jsConfigMigrationBySheet.get(sheet)!

        if (!config) {
          for (let parent of sheet.ancestors()) {
            if (parent.isTailwindRoot) {
              config ??= configBySheet.get(parent)!
              jsConfigMigration ??= jsConfigMigrationBySheet.get(parent)!
              break
            }
          }
        }

        return migrateStylesheet(sheet, { ...config, jsConfigMigration })
      }),
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

    // Cleanup `@import "…" layer(utilities)`
    for (let sheet of stylesheets) {
      for (let importRule of sheet.importRules) {
        if (!importRule.raws.tailwind_injected_layer) continue
        let importedSheet = stylesheets.find(
          (sheet) => sheet.id === importRule.raws.tailwind_destination_sheet_id,
        )
        if (!importedSheet) continue

        // Only remove the `layer(…)` next to the import if any of the children
        // contain `@utility`. Otherwise `@utility` will not be top-level.
        if (
          !importedSheet.containsRule((node) => node.type === 'atrule' && node.name === 'utility')
        ) {
          continue
        }

        // Make sure to remove the `layer(…)` from the `@import` at-rule
        importRule.params = importRule.params.replace(/ layer\([^)]+\)/, '').trim()
      }
    }

    // Format nodes
    for (let sheet of stylesheets) {
      await postcss([sortBuckets(), formatNodes()]).process(sheet.root!, { from: sheet.file! })
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

  {
    // Migrate the prettier plugin to the latest version
    await migratePrettierPlugin(base)
  }

  // Run all cleanup functions because we completed the migration
  await Promise.allSettled(cleanup.map((fn) => fn()))

  try {
    // Upgrade Tailwind CSS
    await pkg(base).add(['tailwindcss@next'])
  } catch {}

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
