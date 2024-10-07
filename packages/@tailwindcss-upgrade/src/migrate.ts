import path from 'node:path'
import postcss from 'postcss'
import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../tailwindcss/src/design-system'
import { segment } from '../../tailwindcss/src/utils/segment'
import { migrateAtApply } from './codemods/migrate-at-apply'
import { migrateAtLayerUtilities } from './codemods/migrate-at-layer-utilities'
import { migrateMediaScreen } from './codemods/migrate-media-screen'
import { migrateMissingLayers } from './codemods/migrate-missing-layers'
import { migrateTailwindDirectives } from './codemods/migrate-tailwind-directives'
import { Stylesheet } from './stylesheet'
import { resolveCssId } from './utils/resolve'

export interface MigrateOptions {
  newPrefix: string | null
  designSystem: DesignSystem
  userConfig: Config
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
}
