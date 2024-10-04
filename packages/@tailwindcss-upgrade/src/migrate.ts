import fs from 'node:fs/promises'
import path from 'node:path'
import postcss, { AtRule } from 'postcss'
import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../tailwindcss/src/design-system'
import { segment } from '../../tailwindcss/src/utils/segment'
import { migrateAtApply } from './codemods/migrate-at-apply'
import { migrateAtLayerUtilities } from './codemods/migrate-at-layer-utilities'
import { migrateMissingLayers } from './codemods/migrate-missing-layers'
import { migrateTailwindDirectives } from './codemods/migrate-tailwind-directives'
import { resolveCssId } from './utils/resolve'
import { walk, WalkAction } from './utils/walk'

export interface MigrateOptions {
  newPrefix?: string
  designSystem?: DesignSystem
  userConfig?: Config
}

export interface Stylesheet {
  file?: string
  unlink?: boolean

  rootFile?: string
  rootImport?: postcss.AtRule

  content?: string | null
  root?: postcss.Root | null
  layers?: Set<string>

  parents?: Set<Stylesheet>
  children?: Set<Stylesheet>
  importRules?: Set<AtRule>
  hasUtilities?: boolean

  readonly ancestors?: Set<Stylesheet>
  readonly descendants?: Set<Stylesheet>
}

export async function migrateContents(
  stylesheet: Stylesheet | string,
  options: MigrateOptions = {},
) {
  if (typeof stylesheet === 'string') {
    stylesheet = {
      content: stylesheet,
      root: postcss.parse(stylesheet),
    }
  }

  return postcss()
    .use(migrateAtApply(options))
    .use(migrateAtLayerUtilities(stylesheet))
    .use(migrateMissingLayers())
    .use(migrateTailwindDirectives(options))
    .process(stylesheet.root!, { from: stylesheet.file })
}

export async function migrate(stylesheet: Stylesheet, options: MigrateOptions) {
  if (!stylesheet.file) {
    throw new Error('Cannot migrate a stylesheet without a file path')
  }

  await migrateContents(stylesheet, options)
}

export async function analyze(stylesheets: Stylesheet[]) {
  let stylesheetsByFile = new Map<string, Stylesheet>()
  for (let stylesheet of stylesheets) {
    if (!stylesheet.file) continue
    stylesheetsByFile.set(stylesheet.file, stylesheet)

    stylesheet.layers ??= new Set()
    stylesheet.importRules ??= new Set()
    stylesheet.parents ??= new Set()
    stylesheet.children ??= new Set()

    function* traverse(
      sheet: Stylesheet,
      list: (sheet: Stylesheet) => Iterable<Stylesheet>,
    ): Iterable<Stylesheet> {
      for (let child of list(sheet)) {
        yield child
        yield* traverse(child, list)
      }
    }

    Object.defineProperty(stylesheet, 'ancestors', {
      get: () => new Set(traverse(stylesheet, (sheet) => sheet.parents ?? [])),
    })

    Object.defineProperty(stylesheet, 'descendants', {
      get: () => new Set(traverse(stylesheet, (sheet) => sheet.children ?? [])),
    })
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

          // If it does then this import node get added to that sylesheets `importRules` set
          let parent = stylesheetsByFile.get(node.source?.input.file ?? '')
          if (!parent) return

          // Record the import node for this sheet so it can be modified later
          stylesheet.importRules!.add(node)

          node.raws.sheets ??= new Set()
          // @ts-ignore
          node.raws.sheets!.add(stylesheet)

          // Connect all stylesheets together in a dependency graph
          // The way this works is it uses the knowledge that we have a list of
          // the `@import` nodes that cause a given stylesheet to be imported.
          // That import has a `source` pointing to parent stylesheet's file path
          // which can be used to look it up
          stylesheet.parents!.add(parent)
          parent.children!.add(stylesheet)

          for (let part of segment(node.params, ' ')) {
            if (!part.startsWith('layer(')) continue
            if (!part.endsWith(')')) continue

            stylesheet.layers!.add(part.slice(6, -1).trim())
          }
        },
      },
    },
  ])

  for (let sheet of stylesheets) {
    if (!sheet.file) continue
    if (!sheet.root) continue

    await processor.process(sheet.root, { from: sheet.file })
  }

  // Step 2: Analyze the AST so each stylesheet can know what layers it is inside
  for (let sheet of stylesheets) {
    for (let ancestor of sheet.ancestors ?? []) {
      for (let layer of ancestor.layers ?? []) {
        sheet.layers!.add(layer)
      }
    }
  }
}

export async function prepare(stylesheet: Stylesheet) {
  if (stylesheet.file) {
    stylesheet.file = path.resolve(process.cwd(), stylesheet.file)
    stylesheet.content = await fs.readFile(stylesheet.file, 'utf-8')
  }

  if (stylesheet.content) {
    stylesheet.root = postcss.parse(stylesheet.content, {
      from: stylesheet.file,
    })
  }
}

export async function split(stylesheets: Stylesheet[]) {
  let utilitySheets = new Map<Stylesheet, Stylesheet>()
  let newRules: postcss.AtRule[] = []

  for (let sheet of stylesheets) {
    if (!sheet.root) continue
    if (!sheet.file) continue

    // We only care about stylesheets that were imported into a layer e.g. `layer(utilities)`
    let isLayered = sheet.layers?.has('utilities') || sheet.layers?.has('components')
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
    if (!sheet.root) continue
    if (!sheet.importRules?.size) continue

    // Skip stylesheets that don't have utilities
    // and don't have any children that have utilities
    if (!sheet.hasUtilities) {
      if (!Array.from(sheet.descendants ?? []).some((child) => child.hasUtilities)) {
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

    let utilitySheet: Stylesheet = {
      file: sheet.file!.replace(/\.css$/, '.utilities.css'),
      root: utilities,
      importRules: new Set(),
      parents: new Set(),
      children: new Set(),
      layers: new Set(),
      hasUtilities: true,
    }

    utilitySheets.set(sheet, utilitySheet)
  }

  for (let sheet of stylesheets) {
    if (!sheet.root) continue

    let utilitySheet = utilitySheets.get(sheet)

    let importNodes = new Set<postcss.AtRule>()
    sheet.root.walkAtRules('import', (node) => {
      importNodes.add(node)
    })

    let utilityImports: Set<postcss.AtRule> = new Set()

    for (let node of importNodes) {
      if (!node.raws.sheets) continue

      let id = node.params.match(/['"](.*)['"]/)?.[1]
      if (!id) return

      let normalSheetForImport = Array.from(sheet.children ?? [])?.find((child) => {
        return child.importRules?.has(node)
      })
      let utilitySheetForImport = utilitySheets.get(normalSheetForImport!)

      let newFile = id.replace(/\.css$/, '.utilities.css')
      let newImport = node.clone({
        params: `"${newFile}"`,
        raws: {
          after: '\n\n',
        },
      })

      if (utilitySheet) {
        utilityImports.add(newImport)
        utilitySheetForImport?.importRules?.add(newImport)
      } else {
        node.after(newImport)
      }
    }

    if (utilitySheet && utilityImports.size > 0) {
      utilitySheet.root!.prepend(Array.from(utilityImports))
    }
  }

  // Make sure the utility sheets track parents and import nodes and what not
  for (let [normalSheet, utilitySheet] of utilitySheets) {
    if (!utilitySheet.parents) continue
    if (!utilitySheet.children) continue

    for (let parent of normalSheet.parents ?? []) {
      let utilityParent = utilitySheets.get(parent)
      if (!utilityParent) continue
      utilitySheet.parents.add(utilityParent)
    }

    for (let child of normalSheet.children ?? []) {
      let utilityChild = utilitySheets.get(child)
      if (!utilityChild) continue
      utilitySheet.children.add(utilityChild)
    }
  }

  stylesheets.push(...utilitySheets.values())

  return

  // At this point, we probably created `{name}.utilities.css` files. If the
  // original `{name}.css` is empty, then we can optimize the output a bit more
  // by re-using the original file but just getting rid of the `layer
  // (utilities)` marker.
  // If removing files means that some `@import` at-rules are now unnecessary, we
  // can also remove those.
  {
    // 1. Get rid of empty files (and their imports)
    let repeat = true
    while (repeat) {
      repeat = false
      for (let stylesheet of stylesheets) {
        // Was already marked to be removed, skip
        if (stylesheet.unlink) continue

        // Original content was not empty, but the new content is. Therefore we
        // can mark the file for removal.
        // TODO: Make sure that empty files are not even part of `stylesheets`
        //       in the first place. Then we can get rid of this check.
        if (stylesheet.content?.trim() !== '' && stylesheet?.root?.toString().trim() === '') {
          repeat = true
          stylesheet.unlink = true

          // Cleanup imports that are now unnecessary
          for (let parent of stylesheet.importRules ?? []) {
            parent.remove()
          }
        }
      }
    }

    // 2. Use `{name}.css` instead of `{name}.utilities.css` if the `{name}.css`
    //    was marked for removal.
    for (let [originalSheet, utilitySheet] of utilitySheets) {
      // Original sheet was marked for removal, use the original file instead.
      if (!originalSheet.unlink) continue

      // Fixup the import rule
      for (let parent of originalSheet.importRules ?? []) {
        parent.params = parent.params.replace(/\.utilities\.css(['"])/, '.css$1')
      }

      // Fixup the file path
      // utilitySheet.file = utilitySheet.file?.replace(/\.utilities\.css$/, '.css')
      console.log('Cleanup', utilitySheet.file)
    }
  }
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
