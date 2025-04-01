#!/usr/bin/env node

import { globby } from 'globby'
import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import { migrateJsConfig } from './codemods/config/migrate-js-config'
import { migratePostCSSConfig } from './codemods/config/migrate-postcss'
import { migratePrettierPlugin } from './codemods/config/migrate-prettier'
import { analyze as analyzeStylesheets } from './codemods/css/analyze'
import { formatNodes } from './codemods/css/format-nodes'
import { linkConfigs as linkConfigsToStylesheets } from './codemods/css/link'
import { migrate as migrateStylesheet } from './codemods/css/migrate'
import { sortBuckets } from './codemods/css/sort-buckets'
import { split as splitStylesheets } from './codemods/css/split'
import { migrate as migrateTemplate } from './codemods/template/migrate'
import { prepareConfig } from './codemods/template/prepare-config'
import { help } from './commands/help'
import { Stylesheet } from './stylesheet'
import { args, type Arg } from './utils/args'
import { isRepoDirty } from './utils/git'
import { hoistStaticGlobParts } from './utils/hoist-static-glob-parts'
import { getPackageVersion } from './utils/package-version'
import { pkg } from './utils/packages'
import { eprintln, error, header, highlight, info, relative, success } from './utils/renderer'

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
    // Require a clean git directory
    if (isRepoDirty()) {
      error('Git directory is not clean. Please stash or commit your changes before migrating.')
      info(
        `You may use the ${highlight('--force')} flag to silence this warning and perform the migration.`,
      )
      process.exit(1)
    }
  }

  // Require an installed `tailwindcss` version < 4
  let tailwindVersion = await getPackageVersion('tailwindcss', base)
  if (tailwindVersion && Number(tailwindVersion.split('.')[0]) !== 3) {
    error(
      `Tailwind CSS v${tailwindVersion} found. The migration tool can only be run on v3 projects.`,
    )
    process.exit(1)
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

    // Analyze the stylesheets
    let loadResults = await Promise.allSettled(files.map((filepath) => Stylesheet.load(filepath)))

    // Load and parse all stylesheets
    for (let result of loadResults) {
      if (result.status === 'rejected') {
        error(`${result.reason?.message ?? result.reason}`, { prefix: '↳ ' })
      }
    }

    let stylesheets = loadResults
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)

    // Analyze the stylesheets
    try {
      await analyzeStylesheets(stylesheets)
    } catch (e: any) {
      error(`${e?.message ?? e}`, { prefix: '↳ ' })
    }

    // Ensure stylesheets are linked to configs
    try {
      await linkConfigsToStylesheets(stylesheets, {
        configPath: flags['--config'],
        base,
      })
    } catch (e: any) {
      error(`${e?.message ?? e}`, { prefix: '↳ ' })
    }

    // Migrate js config files, linked to stylesheets
    if (stylesheets.some((sheet) => sheet.isTailwindRoot)) {
      info('Migrating JavaScript configuration files…')
    }
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

      if (jsConfigMigration !== null) {
        success(
          `Migrated configuration file: ${highlight(relative(config.configFilePath, base))}`,
          { prefix: '↳ ' },
        )
      }
    }

    // Migrate source files, linked to config files
    if (configBySheet.size > 0) {
      info('Migrating templates…')
    }
    {
      // Template migrations
      for (let config of configBySheet.values()) {
        let set = new Set<string>()
        for (let globEntry of config.sources.flatMap((entry) => hoistStaticGlobParts(entry))) {
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

        success(
          `Migrated templates for configuration file: ${highlight(relative(config.configFilePath, base))}`,
          { prefix: '↳ ' },
        )
      }
    }

    // Migrate each CSS file
    if (stylesheets.length > 0) {
      info('Migrating stylesheets…')
    }
    await Promise.all(
      stylesheets.map(async (sheet) => {
        try {
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

          await migrateStylesheet(sheet, { ...config, jsConfigMigration })
        } catch (e: any) {
          error(`${e?.message ?? e} in ${highlight(relative(sheet.file!, base))}`, { prefix: '↳ ' })
        }
      }),
    )

    // Split up stylesheets (as needed)
    try {
      await splitStylesheets(stylesheets)
    } catch (e: any) {
      error(`${e?.message ?? e}`, { prefix: '↳ ' })
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

      if (sheet.isTailwindRoot) {
        success(`Migrated stylesheet: ${highlight(relative(sheet.file, base))}`, { prefix: '↳ ' })
      }
    }
  }

  {
    // PostCSS config migration
    await migratePostCSSConfig(base)
  }

  info('Updating dependencies…')
  {
    // Migrate the prettier plugin to the latest version
    await migratePrettierPlugin(base)
  }

  try {
    // Upgrade Tailwind CSS
    await pkg(base).add(['tailwindcss@latest'])
    success(`Updated package: ${highlight('tailwindcss')}`, { prefix: '↳ ' })
  } catch {}

  // Run all cleanup functions because we completed the migration
  await Promise.allSettled(cleanup.map((fn) => fn()))

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
