import path from 'node:path'
import { AtRule, type Plugin, Root } from 'postcss'
import { normalizePath } from '../../../@tailwindcss-node/src/normalize-path'
import type { JSConfigMigration } from '../migrate-js-config'
import type { Stylesheet } from '../stylesheet'
import { walk, WalkAction } from '../utils/walk'

export function migrateConfig(
  sheet: Stylesheet,
  {
    configFilePath,
    jsConfigMigration,
  }: { configFilePath: string; jsConfigMigration: JSConfigMigration },
): Plugin {
  function injectInto(sheet: Stylesheet) {
    let root = sheet.root

    // We don't have a sheet with a file path
    if (!sheet.file) return

    let cssConfig = new AtRule()
    cssConfig.raws.tailwind_pretty = true

    if (jsConfigMigration === null) {
      // Skip if there is already a `@config` directive
      {
        let hasConfig = false
        root.walkAtRules('config', () => {
          hasConfig = true
          return false
        })
        if (hasConfig) return
      }

      cssConfig.append(
        new AtRule({
          name: 'config',
          params: `'${relativeToStylesheet(sheet, configFilePath)}'`,
        }),
      )
    } else {
      for (let source of jsConfigMigration.sources) {
        let absolute = path.resolve(source.base, source.pattern)
        cssConfig.append(
          new AtRule({
            name: 'source',
            params: `'${relativeToStylesheet(sheet, absolute)}'`,
          }),
        )
      }

      if (jsConfigMigration.css.nodes.length > 0 && jsConfigMigration.sources.length > 0) {
        jsConfigMigration.css.nodes[0].raws.before = '\n\n'
      }

      cssConfig.append(jsConfigMigration.css.nodes)
    }

    // Inject the `@config` in a sensible place
    // 1. Below the last `@import`
    // 2. At the top of the file
    let locationNode = null as AtRule | null

    walk(root, (node) => {
      if (node.type === 'atrule' && node.name === 'import') {
        locationNode = node
      }

      return WalkAction.Skip
    })

    if (!locationNode) {
      root.prepend(cssConfig.nodes)
    } else if (locationNode.name === 'import') {
      locationNode.after(cssConfig.nodes)
    }
  }

  function migrate(root: Root) {
    // We can only migrate if there is an `@import "tailwindcss"` (or sub-import)
    let hasTailwindImport = false
    let hasFullTailwindImport = false
    root.walkAtRules('import', (node) => {
      if (node.params.match(/['"]tailwindcss['"]/)) {
        hasTailwindImport = true
        hasFullTailwindImport = true
        return false
      } else if (node.params.match(/['"]tailwindcss\/.*?['"]/)) {
        hasTailwindImport = true
      }
    })

    if (!hasTailwindImport) return

    // - If a full `@import "tailwindcss"` is present, we can inject the
    //   `@config` directive directly into this stylesheet.
    // - If we are the root file (no parents), then we can inject the `@config`
    //   directive directly into this file as well.
    if (hasFullTailwindImport || sheet.parents.size <= 0) {
      injectInto(sheet)
      return
    }

    // Otherwise, if we are not the root file, we need to inject the `@config`
    // into the root file.
    if (sheet.parents.size > 0) {
      for (let parent of sheet.ancestors()) {
        if (parent.parents.size === 0) {
          injectInto(parent)
        }
      }
    }
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-config',
    OnceExit: migrate,
  }
}

function relativeToStylesheet(sheet: Stylesheet, absolute: string) {
  if (!sheet.file) throw new Error('Can not find a path for the stylesheet')

  let sheetPath = sheet.file

  let relative = path.relative(path.dirname(sheetPath), absolute)
  if (relative[0] !== '.') {
    relative = `./${relative}`
  }
  // Ensure relative is a posix style path since we will merge it with the
  // glob.
  return normalizePath(relative)
}
