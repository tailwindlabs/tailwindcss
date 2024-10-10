import path from 'node:path'
import { AtRule, type Plugin, type Root } from 'postcss'
import { normalizePath } from '../../../@tailwindcss-node/src/normalize-path'
import type { Stylesheet } from '../stylesheet'
import { walk, WalkAction } from '../utils/walk'

export function migrateAtConfig(
  sheet: Stylesheet,
  { configFilePath }: { configFilePath: string },
): Plugin {
  function injectInto(sheet: Stylesheet) {
    let root = sheet.root

    // We don't have a sheet with a file path
    if (!sheet.file) return

    // Skip if there is already a `@config` directive
    {
      let hasConfig = false
      root.walkAtRules('config', () => {
        hasConfig = true
        return false
      })
      if (hasConfig) return
    }

    // Figure out the path to the config file
    let sheetPath = sheet.file
    let configPath = configFilePath

    let relative = path.relative(path.dirname(sheetPath), configPath)
    if (relative[0] !== '.') {
      relative = `./${relative}`
    }
    // Ensure relative is a posix style path since we will merge it with the
    // glob.
    relative = normalizePath(relative)

    // Inject the `@config` in a sensible place
    // 1. Above the first `@theme`
    // 2. Below the last `@import`
    // 3. At the top of the file
    let locationNode = null as AtRule | null
    let firstThemeNode = null as AtRule | null

    walk(root, (node) => {
      if (node.type === 'atrule' && node.name === 'theme' && firstThemeNode === null) {
        firstThemeNode = node
        locationNode = node
        return WalkAction.Skip
      } else if (node.type === 'atrule' && node.name === 'import') {
        locationNode = node
      }

      return WalkAction.Skip
    })

    let configNode = new AtRule({ name: 'config', params: `"${relative}"` })

    if (!locationNode) {
      root.prepend(configNode)
    } else if (locationNode.name === 'import') {
      locationNode.after(configNode)
    } else if (locationNode.name === 'theme') {
      locationNode.before(configNode)
    }
  }

  function migrate(root: Root) {
    // We can only migrate if there is an `@import "tailwindcss"` (or sub-import)
    let hasTailwindImport = false
    root.walkAtRules('import', (node) => {
      if (node.params.match(/['"]tailwindcss\/?(.*?)['"]/)) {
        hasTailwindImport = true
        return false
      }
    })

    if (!hasTailwindImport) return

    // If we are not the root file, we need to inject the `@config` into the
    // root file.
    if (sheet.parents.size > 0) {
      for (let parent of sheet.ancestors()) {
        if (parent.parents.size === 0) {
          injectInto(parent)
        }
      }
    }

    // If it is the root file, we have to inject the `@config` into the current
    // file.
    else {
      injectInto(sheet)
    }
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-at-config',
    OnceExit: migrate,
  }
}
