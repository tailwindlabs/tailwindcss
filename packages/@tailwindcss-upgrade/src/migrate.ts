import path from 'node:path'
import postcss from 'postcss'
import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../tailwindcss/src/design-system'
import { DefaultMap } from '../../tailwindcss/src/utils/default-map'
import { segment } from '../../tailwindcss/src/utils/segment'
import { migrateAtApply } from './codemods/migrate-at-apply'
import { migrateAtLayerUtilities } from './codemods/migrate-at-layer-utilities'
import { migrateConfig } from './codemods/migrate-config'
import { migrateMediaScreen } from './codemods/migrate-media-screen'
import { migrateMissingLayers } from './codemods/migrate-missing-layers'
import { migrateTailwindDirectives } from './codemods/migrate-tailwind-directives'
import type { JSConfigMigration } from './migrate-js-config'
import { Stylesheet, type StylesheetConnection, type StylesheetId } from './stylesheet'
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
    .use(migrateAtApply(options))
    .use(migrateMediaScreen(options))
    .use(migrateAtLayerUtilities(stylesheet))
    .use(migrateMissingLayers())
    .use(migrateTailwindDirectives(options))
    .use(migrateConfig(stylesheet, options))
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
  let stylesheetsByFile = new Map<string, Stylesheet>()

  for (let sheet of stylesheets) {
    if (sheet.file) {
      stylesheetsByFile.set(sheet.file, sheet)
    }
  }

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
          let resolvedPath: string | false
          try {
            resolvedPath = resolveCssId(id, basePath)
          } catch (err) {
            console.warn(`Failed to resolve import: ${id}. Skipping.`)
            console.error(err)
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

  for (let sheet of stylesheets) {
    if (!sheet.file) continue

    await processor.process(sheet.root, { from: sheet.file })
  }

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

    let { convertablePaths, nonConvertablePaths } = sheet.analyzeImportPaths()
    let isAmbiguous = convertablePaths.length > 0 && nonConvertablePaths.length > 0

    if (!isAmbiguous) continue

    sheet.canMigrate = false

    let filePath = sheet.file.replace(commonPath, '')

    for (let path of convertablePaths) {
      lines.push(`- ${filePath} <- ${pathToString(path)}`)
    }

    for (let path of nonConvertablePaths) {
      lines.push(`- ${filePath} <- ${pathToString(path)}`)
    }
  }

  if (lines.length === 0) return

  let error = `You have one or more stylesheets that are imported into a utility layer and non-utility layer.\n`
  error += `We cannot convert stylesheets under these conditions. Please look at the following stylesheets:\n`

  throw new Error(error + lines.join('\n'))
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

  // Keep track of sheets that contain `@utillity` rules
  let containsUtilities = new Set<Stylesheet>()

  for (let sheet of stylesheets) {
    let layers = sheet.layers()
    let isLayered = layers.has('utilities') || layers.has('components')
    if (!isLayered) continue

    walk(sheet.root, (node) => {
      if (node.type !== 'atrule') return
      if (node.name !== 'utility') return

      containsUtilities.add(sheet)

      return WalkAction.Stop
    })
  }

  // Split every imported stylesheet into two parts
  let utilitySheets = new Map<Stylesheet, Stylesheet>()

  for (let sheet of stylesheets) {
    // Ignore stylesheets that were not imported
    if (!sheet.file) continue
    if (sheet.parents.size === 0) continue

    // Skip stylesheets that don't have utilities
    // and don't have any children that have utilities
    if (!containsUtilities.has(sheet)) {
      if (!Array.from(sheet.descendants()).some((child) => containsUtilities.has(child))) {
        continue
      }
    }

    let utilities = postcss.root({
      raws: {
        tailwind_pretty: true,
      },
    })

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
          after: '\n\n',
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
