import path from 'node:path'
import postcss, { AtRule, type Plugin, Root } from 'postcss'
import { normalizePath } from '../../../@tailwindcss-node/src/normalize-path'
import type { JSConfigMigration } from '../migrate-js-config'
import type { Stylesheet } from '../stylesheet'
import { walk, WalkAction } from '../utils/walk'

const ALREADY_INJECTED = new WeakMap<Stylesheet, string[]>()

export function migrateConfig(
  sheet: Stylesheet,
  {
    configFilePath,
    jsConfigMigration,
  }: { configFilePath: string; jsConfigMigration: JSConfigMigration },
): Plugin {
  function injectInto(sheet: Stylesheet) {
    let alreadyInjected = ALREADY_INJECTED.get(sheet)
    if (alreadyInjected && alreadyInjected.includes(configFilePath)) {
      return
    } else if (alreadyInjected) {
      alreadyInjected.push(configFilePath)
    } else {
      ALREADY_INJECTED.set(sheet, [configFilePath])
    }

    let root = sheet.root

    // We don't have a sheet with a file path
    if (!sheet.file) return

    let cssConfig = new AtRule()

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
      let css = '\n\n'
      for (let source of jsConfigMigration.sources) {
        let absolute = path.resolve(source.base, source.pattern)
        css += `@source '${relativeToStylesheet(sheet, absolute)}';\n`
      }
      if (jsConfigMigration.sources.length > 0) {
        css = css + '\n'
      }

      for (let plugin of jsConfigMigration.plugins) {
        let relative =
          plugin.path[0] === '.'
            ? relativeToStylesheet(sheet, path.resolve(plugin.base, plugin.path))
            : plugin.path

        if (plugin.options === null) {
          css += `@plugin '${relative}';\n`
        } else {
          css += `@plugin '${relative}' {\n`
          for (let [property, value] of Object.entries(plugin.options)) {
            css += `  ${property}: ${
              Array.isArray(value)
                ? value.map((v) => (typeof v === 'string' ? quoteString(v) : '' + v)).join(', ')
                : typeof value === 'string'
                  ? quoteString(value)
                  : '' + value
            };\n`
          }
          css += '}\n'
        }
      }
      if (jsConfigMigration.plugins.length > 0) {
        css = css + '\n'
      }

      cssConfig.append(postcss.parse(css + jsConfigMigration.css))
    }

    // Inject the `@config` directive after the last `@import` or at the
    // top of the file if no `@import` rules are present
    let locationNode = null as AtRule | null

    walk(root, (node) => {
      if (node.type === 'atrule' && node.name === 'import') {
        locationNode = node
      }

      return WalkAction.Skip
    })

    for (let node of cssConfig?.nodes ?? []) {
      node.raws.tailwind_pretty = true
    }

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

    // If a full `@import "tailwindcss"` is present or this is the root
    // stylesheet, we can inject the `@config` directive directly into this
    // file.
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
  // Ensure relative is a POSIX style path since we will merge it with the
  // glob.
  return normalizePath(relative)
}

function quoteString(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}
