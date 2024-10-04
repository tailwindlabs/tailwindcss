import path from 'node:path'
import postcss from 'postcss'
import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../tailwindcss/src/design-system'
import { segment } from '../../tailwindcss/src/utils/segment'
import { migrateAtApply } from './codemods/migrate-at-apply'
import { migrateAtLayerUtilities } from './codemods/migrate-at-layer-utilities'
import { migrateMissingLayers } from './codemods/migrate-missing-layers'
import { migrateTailwindDirectives } from './codemods/migrate-tailwind-directives'
import { Stylesheet } from './stylesheet'
import { resolveCssId } from './utils/resolve'
import { walk, WalkAction } from './utils/walk'

export interface MigrateOptions {
  newPrefix?: string
  designSystem?: DesignSystem
  userConfig?: Config
}

export async function migrateContents(
  stylesheet: Stylesheet | string,
  options: MigrateOptions = {},
) {
  if (typeof stylesheet === 'string') {
    stylesheet = await Stylesheet.fromString(stylesheet)
  }

  return postcss()
    .use(migrateAtApply(options))
    .use(migrateAtLayerUtilities(stylesheet))
    .use(migrateMissingLayers())
    .use(migrateTailwindDirectives(options))
    .process(stylesheet.root, { from: stylesheet.file ?? undefined })
}

export async function migrate(stylesheet: Stylesheet, options: MigrateOptions) {
  if (!stylesheet.file) {
    throw new Error('Cannot migrate a stylesheet without a file path')
  }

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

          // If it does then this import node get added to that sylesheets `importsFromParents` set
          let parent = stylesheetsByFile.get(node.source?.input.file ?? '')
          if (!parent) return

          // Record the import node for this sheet so it can be modified later
          stylesheet.importsFromParents.add(node)
          parent.importsInSelf.add(node)

          // Connect all stylesheets together in a dependency graph
          // The way this works is it uses the knowledge that we have a list of
          // the `@import` nodes that cause a given stylesheet to be imported.
          // That import has a `source` pointing to parent stylesheet's file path
          // which can be used to look it up
          stylesheet.parents.add(parent)
          parent.children.add(stylesheet)

          for (let part of segment(node.params, ' ')) {
            if (!part.startsWith('layer(')) continue
            if (!part.endsWith(')')) continue

            stylesheet.layers.add(part.slice(6, -1).trim())
          }
        },
      },
    },
  ])

  for (let sheet of stylesheets) {
    if (!sheet.file) continue

    await processor.process(sheet.root, { from: sheet.file })
  }

  // Step 2: Analyze the AST so each stylesheet can know what layers it is inside
  for (let sheet of stylesheets) {
    for (let ancestor of sheet.ancestors) {
      for (let layer of ancestor.layers) {
        sheet.layers.add(layer)
      }
    }
  }
}

export async function split(stylesheets: Stylesheet[]) {
  let utilitySheets = new Map<Stylesheet, Stylesheet>()

  for (let sheet of stylesheets) {
    if (!sheet.file) continue

    // We only care about stylesheets that were imported into a layer e.g. `layer(utilities)`
    let isLayered = sheet.layers.has('utilities') || sheet.layers.has('components')
    if (!isLayered) continue

    // We only care about stylesheets that contain an `@utility`
    let hasUtilities = false

    walk(sheet.root, (node) => {
      if (node.type !== 'atrule') return
      if (node.name !== 'utility') return

      hasUtilities = true

      return WalkAction.Stop
    })

    sheet.hasUtilities = hasUtilities
  }

  for (let sheet of stylesheets) {
    if (!sheet.importsFromParents.size) continue

    // Skip stylesheets that don't have utilities
    // and don't have any children that have utilities
    if (!sheet.hasUtilities) {
      if (!Array.from(sheet.descendants).some((child) => child.hasUtilities)) {
        continue
      }
    }

    // Split the stylesheet into two parts: one with the utilities and one without
    let utilities = postcss.root({
      raws: {
        tailwind_pretty: true,
      },
    })

    walk(sheet.root, (node) => {
      if (node.type !== 'atrule') return
      if (node.name !== 'utility') return

      utilities.append(node)

      return WalkAction.Skip
    })

    let utilitySheet = await Stylesheet.fromRoot(
      utilities,
      sheet.file!.replace(/\.css$/, '.utilities.css'),
    )

    utilitySheets.set(sheet, utilitySheet)
  }

  for (let sheet of stylesheets) {
    let utilitySheet = utilitySheets.get(sheet)
    let utilityImports: Set<postcss.AtRule> = new Set()

    console.log(`---- ${sheet.file} ----`)
    console.log(Array.from(sheet.importsInSelf).map((node) => node.toString()))

    for (let node of sheet.importsInSelf) {
      let id = node.params.match(/['"](.*)['"]/)?.[1]
      if (!id) return

      let newFile = id.replace(/\.css$/, '.utilities.css')
      let newImport = node.clone({
        params: `"${newFile}"`,
        raws: {
          after: '\n\n',
        },
      })

      if (utilitySheet) {
        utilityImports.add(newImport)
        utilitySheet.importsInSelf.add(newImport)

        for (let child of sheet.children) {
          if (child.importsFromParents.has(node)) {
            utilitySheets.get(child)!.importsFromParents.add(newImport)
          }
        }
      } else {
        node.after(newImport)
      }
    }

    if (utilitySheet && utilityImports.size > 0) {
      utilitySheet.root.prepend(Array.from(utilityImports))
    }
  }

  // Make sure the utility sheets track parents and import nodes and what not
  for (let [normalSheet, utilitySheet] of utilitySheets) {
    for (let parent of normalSheet.parents) {
      let utilityParent = utilitySheets.get(parent)
      if (!utilityParent) continue
      utilitySheet.parents.add(utilityParent)
    }

    for (let child of normalSheet.children) {
      let utilityChild = utilitySheets.get(child)
      if (!utilityChild) continue
      utilitySheet.children.add(utilityChild)
    }
  }

  // At this point, we probably created `{name}.utilities.css` files. If the
  // original `{name}.css` is empty, then we can optimize the output a bit more
  // by re-using the original file but just getting rid of the `layer
  // (utilities)` marker.
  // If removing files means that some `@import` at-rules are now unnecessary, we
  // can also remove those.
  for (let sheet of stylesheets) {
    continue
    let utilitySheet = utilitySheets.get(sheet)
    if (!utilitySheet) continue

    if (sheet.root.toString().trim() !== '') continue

    // We have a sheet that became empty after splitting
    // 1. Replace the sheet with it's utility sheet content
    sheet.root = utilitySheet.root

    // 2. Point the imports back to the original file since we don't need the utility file anymore
    for (let node of utilitySheet.importsFromParents) {
      node.params = node.params.replace(/\.utilities\.css['"]/, '.css')
    }

    // 3. Remove the original import from the non-utility sheet
    // TODO: This does not work because we're cloning trees during the migration
    // we *cannot* rely on reference semantics at all for any postcss nodes
    for (let node of sheet.importsFromParents) {
      node.remove()
    }

    // 3. Mark the utility sheet for removal
    utilitySheets.delete(sheet)
  }

  stylesheets.push(...utilitySheets.values())
}

// @import './a.css' layer(utilities) ;
//   -> @utility { … }

// @import './a.css' layer(utilities);
//  -> @import './b.css';
//    -> @import './c.css';
//       -> .utility-class
//       -> #main
//    -> other stuff
//  -> other stuff

// @import './a.css' layer(utilities);
//  -> @import './b.css'; (layers: utilities)
//    -> @import './c.css';
//      -> @import './d.css';
//         -> #main
//    -> other stuff
