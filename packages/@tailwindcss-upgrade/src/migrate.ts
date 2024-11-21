import { normalizePath } from '@tailwindcss/node'
import { isGitIgnored } from 'globby'
import path from 'node:path'
import postcss, { type Result } from 'postcss'
import type { Config } from '../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../tailwindcss/src/design-system'
import { DefaultMap } from '../../tailwindcss/src/utils/default-map'
import { segment } from '../../tailwindcss/src/utils/segment'
import { migrateAtApply } from './codemods/migrate-at-apply'
import { migrateAtLayerUtilities } from './codemods/migrate-at-layer-utilities'
import { migrateConfig } from './codemods/migrate-config'
import { migrateImport } from './codemods/migrate-import'
import { migrateMediaScreen } from './codemods/migrate-media-screen'
import { migrateMissingLayers } from './codemods/migrate-missing-layers'
import { migratePreflight } from './codemods/migrate-preflight'
import { migrateTailwindDirectives } from './codemods/migrate-tailwind-directives'
import { migrateThemeToVar } from './codemods/migrate-theme-to-var'
import { migrateVariantsDirective } from './codemods/migrate-variants-directive'
import type { JSConfigMigration } from './migrate-js-config'
import { Stylesheet, type StylesheetConnection, type StylesheetId } from './stylesheet'
import { detectConfigPath } from './template/prepare-config'
import { error, highlight, relative, success } from './utils/renderer'
import { resolveCssId } from './utils/resolve'
import { walk, WalkAction } from './utils/walk'

export interface MigrateOptions {
  newPrefix: string | null
  designSystem: DesignSystem
  userConfig: Config
  configFilePath: string
  jsConfigMigration: JSConfigMigration
}

export async function migrateContents(
  stylesheet: Stylesheet | string,
  options: MigrateOptions,
  file?: string,
) {
  if (typeof stylesheet === 'string') {
    stylesheet = await Stylesheet.fromString(stylesheet)
    stylesheet.file = file ?? null
  }

  return postcss()
    .use(migrateImport())
    .use(migrateAtApply(options))
    .use(migrateMediaScreen(options))
    .use(migrateVariantsDirective())
    .use(migrateAtLayerUtilities(stylesheet))
    .use(migrateMissingLayers())
    .use(migrateTailwindDirectives(options))
    .use(migrateConfig(stylesheet, options))
    .use(migratePreflight(options))
    .use(migrateThemeToVar(options))
    .process(stylesheet.root, { from: stylesheet.file ?? undefined })
}

export async function migrate(stylesheet: Stylesheet, options: MigrateOptions) {
  if (!stylesheet.file) {
    throw new Error('Cannot migrate a stylesheet without a file path')
  }

  if (!stylesheet.canMigrate) return

  await migrateContents(stylesheet, options)
}

export async function analyze(stylesheets: Stylesheet[]) {
  let isIgnored = await isGitIgnored()
  let processingQueue: (() => Promise<Result>)[] = []
  let stylesheetsByFile = new DefaultMap<string, Stylesheet | null>((file) => {
    // We don't want to process ignored files (like node_modules)
    if (isIgnored(file)) {
      return null
    }

    try {
      let sheet = Stylesheet.loadSync(file)

      // Mutate incoming stylesheets to include the newly discovered sheet
      stylesheets.push(sheet)

      // Queue up the processing of this stylesheet
      processingQueue.push(() => processor.process(sheet.root, { from: sheet.file! }))

      return sheet
    } catch {
      return null
    }
  })

  // Step 1: Record which `@import` rules point to which stylesheets
  // and which stylesheets are parents/children of each other
  let processor = postcss([
    {
      postcssPlugin: 'mark-import-nodes',
      AtRule: {
        import(node) {
          // Find what the import points to
          let id = node.params.match(/['"](.*)['"]/)?.[1]
          if (!id) return

          let basePath = node.source?.input.file
            ? path.dirname(node.source.input.file)
            : process.cwd()

          // Resolve the import to a file path
          let resolvedPath: string | false = false
          try {
            // We first try to resolve the file as relative to the current file
            // to mimic the behavior of `postcss-import` since that's what was
            // used to resolve imports in Tailwind CSS v3.
            if (id[0] !== '.') {
              try {
                resolvedPath = resolveCssId(`./${id}`, basePath)
              } catch {}
            }

            if (!resolvedPath) {
              resolvedPath = resolveCssId(id, basePath)
            }
          } catch (err) {
            // Import is a URL, we don't want to process these, but also don't
            // want to show an error message for them.
            if (id.startsWith('http://') || id.startsWith('https://') || id.startsWith('//')) {
              return
            }

            // Something went wrong, we can't resolve the import.
            error(
              `Failed to resolve import: ${highlight(id)} in ${highlight(relative(node.source?.input.file!, basePath))}. Skipping.`,
              { prefix: '↳ ' },
            )
            return
          }

          if (!resolvedPath) return

          // Find the stylesheet pointing to the resolved path
          let stylesheet = stylesheetsByFile.get(resolvedPath)

          // If it _does not_ exist in stylesheets we don't care and skip it
          // this is likely because its in node_modules or a workspace package
          // that we don't want to modify
          if (!stylesheet) return

          // Mark the import node with the ID of the stylesheet it points to
          // We will use these later to build lookup tables and modify the AST
          node.raws.tailwind_destination_sheet_id = stylesheet.id

          let parent = node.source?.input.file
            ? stylesheetsByFile.get(node.source.input.file)
            : undefined

          let layers: string[] = []

          for (let part of segment(node.params, ' ')) {
            if (!part.startsWith('layer(')) continue
            if (!part.endsWith(')')) continue

            layers.push(part.slice(6, -1).trim())
          }

          // Connect sheets together in a dependency graph
          if (parent) {
            let meta = { layers }
            stylesheet.parents.add({ item: parent, meta })
            parent.children.add({ item: stylesheet, meta })
          }
        },
      },
    },
  ])

  // Seed the map with all the known stylesheets, and queue up the processing of
  // each incoming stylesheet.
  for (let sheet of stylesheets) {
    if (sheet.file) {
      stylesheetsByFile.set(sheet.file, sheet)
      processingQueue.push(() => processor.process(sheet.root, { from: sheet.file ?? undefined }))
    }
  }

  // Process all the stylesheets from step 1
  while (processingQueue.length > 0) {
    let task = processingQueue.shift()!
    await task()
  }

  // ---

  let commonPath = process.cwd()

  function pathToString(path: StylesheetConnection[]) {
    let parts: string[] = []

    for (let connection of path) {
      if (!connection.item.file) continue

      let filePath = connection.item.file.replace(commonPath, '')
      let layers = connection.meta.layers.join(', ')

      if (layers.length > 0) {
        parts.push(`${filePath} (layers: ${layers})`)
      } else {
        parts.push(filePath)
      }
    }

    return parts.join(' <- ')
  }

  let lines: string[] = []

  for (let sheet of stylesheets) {
    if (!sheet.file) continue

    let { convertiblePaths, nonConvertiblePaths } = sheet.analyzeImportPaths()
    let isAmbiguous = convertiblePaths.length > 0 && nonConvertiblePaths.length > 0

    if (!isAmbiguous) continue

    sheet.canMigrate = false

    let filePath = sheet.file.replace(commonPath, '')

    for (let path of convertiblePaths) {
      lines.push(`- ${filePath} <- ${pathToString(path)}`)
    }

    for (let path of nonConvertiblePaths) {
      lines.push(`- ${filePath} <- ${pathToString(path)}`)
    }
  }

  if (lines.length === 0) {
    let tailwindRootLeafs = new Set<Stylesheet>()

    for (let sheet of stylesheets) {
      // If the current file already contains `@config`, then we can assume it's
      // a Tailwind CSS root file.
      sheet.root.walkAtRules('config', () => {
        sheet.isTailwindRoot = true
        return false
      })
      if (sheet.isTailwindRoot) continue

      // If an `@tailwind` at-rule, or `@import "tailwindcss"` is present,
      // then we can assume it's a file where Tailwind CSS might be configured.
      //
      // However, if 2 or more stylesheets exist with these rules that share a
      // common parent, then we want to mark the common parent as the root
      // stylesheet instead.
      sheet.root.walkAtRules((node) => {
        if (
          node.name === 'tailwind' ||
          (node.name === 'import' && node.params.match(/^["']tailwindcss["']/)) ||
          (node.name === 'import' && node.params.match(/^["']tailwindcss\/.*?["']$/))
        ) {
          sheet.isTailwindRoot = true
          tailwindRootLeafs.add(sheet)
        }
      })
    }

    // Only a single Tailwind CSS root file exists, no need to do anything else.
    if (tailwindRootLeafs.size <= 1) {
      return
    }

    // Mark the common parent as the root file
    {
      // Group each sheet from tailwindRootLeafs by their common parent
      let commonParents = new DefaultMap<Stylesheet, Set<Stylesheet>>(() => new Set<Stylesheet>())

      // Seed common parents with leafs
      for (let sheet of tailwindRootLeafs) {
        commonParents.get(sheet).add(sheet)
      }

      // If any 2 common parents come from the same tree, then all children of
      // parent A and parent B will be moved to the parent of parent A and
      // parent B. Parent A and parent B will be removed.
      let repeat = true
      repeat: while (repeat) {
        repeat = false

        for (let [sheetA, childrenA] of commonParents) {
          for (let [sheetB, childrenB] of commonParents) {
            if (sheetA === sheetB) continue

            // Ancestors from self to root. Reversed order so we find the
            // nearest common parent first
            //
            // Including self because if you compare a sheet with its parent,
            // then the parent is still the common sheet between the two. In
            // this case, the parent is the root file.
            let ancestorsA = [sheetA].concat(Array.from(sheetA.ancestors()).reverse())
            let ancestorsB = [sheetB].concat(Array.from(sheetB.ancestors()).reverse())

            for (let parentA of ancestorsA) {
              for (let parentB of ancestorsB) {
                if (parentA !== parentB) continue

                // Found the parent
                let parent = parentA

                commonParents.delete(sheetA)
                commonParents.delete(sheetB)

                for (let child of childrenA) {
                  commonParents.get(parent).add(child)
                }

                for (let child of childrenB) {
                  commonParents.get(parent).add(child)
                }

                // Found a common parent between sheet A and sheet B. We can
                // stop looking for more common parents between A and B, and
                // continue with the next sheet.
                repeat = true
                continue repeat
              }
            }
          }
        }
      }

      // Mark the common parent as the Tailwind CSS root file, and remove the
      // flag from each leaf.
      for (let [parent, children] of commonParents) {
        parent.isTailwindRoot = true

        for (let child of children) {
          if (parent === child) continue

          child.isTailwindRoot = false
        }
      }
      return
    }
  }

  {
    let error = `You have one or more stylesheets that are imported into a utility layer and non-utility layer.\n`
    error += `We cannot convert stylesheets under these conditions. Please look at the following stylesheets:\n`

    throw new Error(error + lines.join('\n'))
  }
}

export async function linkConfigs(
  stylesheets: Stylesheet[],
  { configPath, base }: { configPath: string | null; base: string },
) {
  let rootStylesheets = stylesheets.filter((sheet) => sheet.isTailwindRoot)
  if (rootStylesheets.length === 0) {
    throw new Error(
      `Cannot find any CSS files that reference Tailwind CSS.\nBefore your project can be upgraded you need to create a CSS file that imports Tailwind CSS or uses ${highlight('@tailwind')}.`,
    )
  }
  let withoutAtConfig = rootStylesheets.filter((sheet) => {
    let hasConfig = false
    sheet.root.walkAtRules('config', (node) => {
      let configPath = path.resolve(path.dirname(sheet.file!), node.params.slice(1, -1))
      sheet.linkedConfigPath = configPath
      hasConfig = true
      return false
    })
    return !hasConfig
  })

  // All stylesheets have a `@config` directives
  if (withoutAtConfig.length === 0) return

  // Find the config file path for each stylesheet
  let configPathBySheet = new Map<Stylesheet, string>()
  let sheetByConfigPath = new DefaultMap<string, Set<Stylesheet>>(() => new Set())
  for (let sheet of withoutAtConfig) {
    if (!sheet.file) continue

    let localConfigPath = configPath as string
    if (configPath === null) {
      localConfigPath = await detectConfigPath(path.dirname(sheet.file), base)
    } else if (!path.isAbsolute(localConfigPath)) {
      localConfigPath = path.resolve(base, localConfigPath)
    }

    configPathBySheet.set(sheet, localConfigPath)
    sheetByConfigPath.get(localConfigPath).add(sheet)
  }

  let problematicStylesheets = new Set<Stylesheet>()
  for (let sheets of sheetByConfigPath.values()) {
    if (sheets.size > 1) {
      for (let sheet of sheets) {
        problematicStylesheets.add(sheet)
      }
    }
  }

  // There are multiple "root" files without `@config` directives. Manual
  // intervention is needed to link to the correct Tailwind config files.
  if (problematicStylesheets.size > 1) {
    for (let sheet of problematicStylesheets) {
      error(
        `Could not determine configuration file for: ${highlight(relative(sheet.file!, base))}\nUpdate your stylesheet to use ${highlight('@config')} to specify the correct configuration file explicitly and then run the upgrade tool again.`,
        { prefix: '↳ ' },
      )
    }

    process.exit(1)
  }

  let relativePath = relative
  for (let [sheet, configPath] of configPathBySheet) {
    try {
      if (!sheet || !sheet.file) return
      success(
        `Linked ${highlight(relativePath(configPath, base))} to ${highlight(relativePath(sheet.file, base))}`,
        { prefix: '↳ ' },
      )

      // Link the `@config` directive to the root stylesheets

      // Track the config file path on the stylesheet itself for easy access
      // without traversing the CSS ast and finding the corresponding
      // `@config` later.
      sheet.linkedConfigPath = configPath

      // Create a relative path from the current file to the config file.
      let relative = path.relative(path.dirname(sheet.file), configPath)

      // If the path points to a file in the same directory, `path.relative` will
      // remove the leading `./` and we need to add it back in order to still
      // consider the path relative
      if (!relative.startsWith('.')) {
        relative = './' + relative
      }

      relative = normalizePath(relative)

      // Add the `@config` directive to the root stylesheet.
      {
        let target = sheet.root as postcss.Root | postcss.AtRule
        let atConfig = postcss.atRule({ name: 'config', params: `'${relative}'` })

        sheet.root.walkAtRules((node) => {
          if (node.name === 'tailwind' || node.name === 'import') {
            target = node
          }
        })

        if (target.type === 'root') {
          sheet.root.prepend(atConfig)
        } else if (target.type === 'atrule') {
          target.after(atConfig)
        }
      }
    } catch (e: any) {
      error('Could not load the configuration file: ' + e.message, { prefix: '↳ ' })
      process.exit(1)
    }
  }
}

export async function split(stylesheets: Stylesheet[]) {
  let stylesheetsById = new Map<StylesheetId, Stylesheet>()
  let stylesheetsByFile = new Map<string, Stylesheet>()

  for (let sheet of stylesheets) {
    stylesheetsById.set(sheet.id, sheet)

    if (sheet.file) {
      stylesheetsByFile.set(sheet.file, sheet)
    }
  }

  // Keep track of sheets that contain `@utility` rules
  let requiresSplit = new Set<Stylesheet>()

  for (let sheet of stylesheets) {
    // Root files don't need to be split
    if (sheet.isTailwindRoot) continue

    let containsUtility = false
    let containsUnsafe = sheet.layers().size > 0

    walk(sheet.root, (node) => {
      if (node.type === 'atrule' && node.name === 'utility') {
        containsUtility = true
      }

      // Safe to keep without splitting
      else if (
        // An `@import "…" layer(…)` is safe
        (node.type === 'atrule' && node.name === 'import' && node.params.includes('layer(')) ||
        // @layer blocks are safe
        (node.type === 'atrule' && node.name === 'layer') ||
        // Comments are safe
        node.type === 'comment'
      ) {
        return WalkAction.Skip
      }

      // Everything else is not safe, and requires a split
      else {
        containsUnsafe = true
      }

      // We already know we need to split this sheet
      if (containsUtility && containsUnsafe) {
        return WalkAction.Stop
      }

      return WalkAction.Skip
    })

    if (containsUtility && containsUnsafe) {
      requiresSplit.add(sheet)
    }
  }

  // Split every imported stylesheet into two parts
  let utilitySheets = new Map<Stylesheet, Stylesheet>()

  for (let sheet of stylesheets) {
    // Ignore stylesheets that were not imported
    if (!sheet.file) continue
    if (sheet.parents.size === 0) continue

    // Skip stylesheets that don't have utilities
    // and don't have any children that have utilities
    if (!requiresSplit.has(sheet)) {
      if (!Array.from(sheet.descendants()).some((child) => requiresSplit.has(child))) {
        continue
      }
    }

    let utilities = postcss.root()

    walk(sheet.root, (node) => {
      if (node.type !== 'atrule') return
      if (node.name !== 'utility') return

      // `append` will move this node from the original sheet
      // to the new utilities sheet
      utilities.append(node)

      return WalkAction.Skip
    })

    let newFileName = sheet.file.replace(/\.css$/, '.utilities.css')

    let counter = 0

    // If we already have a utility sheet with this name, we need to rename it
    while (stylesheetsByFile.has(newFileName)) {
      counter += 1
      newFileName = sheet.file.replace(/\.css$/, `.utilities.${counter}.css`)
    }

    let utilitySheet = await Stylesheet.fromRoot(utilities, newFileName)

    utilitySheet.extension = counter > 0 ? `.utilities.${counter}.css` : `.utilities.css`

    utilitySheets.set(sheet, utilitySheet)
    stylesheetsById.set(utilitySheet.id, utilitySheet)
  }

  // Make sure the utility sheets are linked to one another
  for (let [normalSheet, utilitySheet] of utilitySheets) {
    for (let parent of normalSheet.parents) {
      let utilityParent = utilitySheets.get(parent.item)
      if (!utilityParent) continue
      utilitySheet.parents.add({
        item: utilityParent,
        meta: parent.meta,
      })
    }

    for (let child of normalSheet.children) {
      let utilityChild = utilitySheets.get(child.item)
      if (!utilityChild) continue
      utilitySheet.children.add({
        item: utilityChild,
        meta: child.meta,
      })
    }
  }

  for (let sheet of stylesheets) {
    let utilitySheet = utilitySheets.get(sheet)
    let utilityImports: Set<postcss.AtRule> = new Set()

    for (let node of sheet.importRules) {
      let sheetId = node.raws.tailwind_destination_sheet_id as StylesheetId | undefined

      // This import rule does not point to a stylesheet
      // which likely means it points to `node_modules`
      if (!sheetId) continue

      let originalDestination = stylesheetsById.get(sheetId)

      // This import points to a stylesheet that no longer exists which likely
      // means it was removed by the optimizer this will be cleaned up later
      if (!originalDestination) continue

      let utilityDestination = utilitySheets.get(originalDestination)

      // A utility sheet doesn't exist for this import so it doesn't need
      // to be processed
      if (!utilityDestination) continue

      let match = node.params.match(/(['"])(.*)\1/)
      if (!match) return

      let quote = match[1]
      let id = match[2]

      let newFile = id.replace(/\.css$/, utilityDestination.extension!)

      // The import will just point to the new file without any media queries,
      // layers, or other conditions because `@utility` MUST be top-level.
      let newImport = node.clone({
        params: `${quote}${newFile}${quote}`,
        raws: {
          tailwind_injected_layer: node.raws.tailwind_injected_layer,
          tailwind_original_params: `${quote}${id}${quote}`,
          tailwind_destination_sheet_id: utilityDestination.id,
        },
      })

      if (utilitySheet) {
        // If this import is intended to go into the utility sheet
        // we'll collect it into a list to add later. If we don't'
        // we'll end up adding them in reverse order.
        utilityImports.add(newImport)
      } else {
        // This import will go immediately after the original import
        node.after(newImport)
      }
    }

    // Add imports to the top of the utility sheet if necessary
    if (utilitySheet && utilityImports.size > 0) {
      utilitySheet.root.prepend(Array.from(utilityImports))
    }
  }

  // Tracks the at rules that import a given stylesheet
  let importNodes = new DefaultMap<Stylesheet, Set<postcss.AtRule>>(() => new Set())

  for (let sheet of stylesheetsById.values()) {
    for (let node of sheet.importRules) {
      let sheetId = node.raws.tailwind_destination_sheet_id as StylesheetId | undefined

      // This import rule does not point to a stylesheet
      if (!sheetId) continue

      let destination = stylesheetsById.get(sheetId)

      // This import rule does not point to a stylesheet that exists
      // We'll remove it later
      if (!destination) continue

      importNodes.get(destination).add(node)
    }
  }

  // At this point we've created many `{name}.utilities.css` files.
  // If the original file _becomes_ empty after splitting that means that
  // dedicated utility file is not required and we can move the utilities
  // back to the original file.
  //
  // This could be done in one step but separating them makes it easier to
  // reason about since the stylesheets are in a consistent state before we
  // perform any cleanup tasks.
  let list: Stylesheet[] = []

  for (let sheet of stylesheets.slice()) {
    for (let child of sheet.descendants()) {
      list.push(child)
    }

    list.push(sheet)
  }

  for (let sheet of list) {
    let utilitySheet = utilitySheets.get(sheet)

    // This sheet was not split so there's nothing to do
    if (!utilitySheet) continue

    // This sheet did not become empty
    if (!sheet.isEmpty) continue

    // We have a sheet that became empty after splitting
    // 1. Replace the sheet with it's utility sheet content
    sheet.root = utilitySheet.root

    // 2. Rewrite imports in parent sheets to point to the original sheet
    // Ideally this wouldn't need to be _undone_ but instead only done once at the end
    for (let node of importNodes.get(utilitySheet)) {
      node.params = node.raws.tailwind_original_params as any
    }

    // 3. Remove the original import from the non-utility sheet
    for (let node of importNodes.get(sheet)) {
      node.remove()
    }

    // 3. Mark the utility sheet for removal
    utilitySheets.delete(sheet)
  }

  stylesheets.push(...utilitySheets.values())
}
