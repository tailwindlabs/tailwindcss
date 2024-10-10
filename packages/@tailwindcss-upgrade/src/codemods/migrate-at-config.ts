import path from 'node:path'
import { AtRule, type Plugin, type Root } from 'postcss'
import type { Stylesheet } from '../stylesheet'
import { walk, WalkAction } from '../utils/walk'

export function migrateAtConfig(
  sheet: Stylesheet,
  { configFilePath }: { configFilePath: string },
): Plugin {
  function migrate(root: Root) {
    let hasConfig = false
    root.walkAtRules('config', () => {
      hasConfig = true
      return false
    })

    // We already have a `@config`
    if (hasConfig) return

    // We don't have a sheet with a file path
    if (!sheet.file) return

    // Should this sheet have an `@config`?
    // 1. It should be a root CSS file
    if (sheet.parents.size > 0) return

    // 2. It should include an `@import "tailwindcss"`
    let hasTailwindImport = false
    root.walkAtRules('import', (node) => {
      if (node.params.match(/['"]tailwindcss\/?(.*?)['"]/)) {
        hasTailwindImport = true
        return false
      }
    })
    if (!hasTailwindImport) return

    // Figure out the path to the config file
    let sheetPath = sheet.file
    let configPath = configFilePath

    let relativePath = path.relative(path.dirname(sheetPath), configPath).replaceAll('\\', '/')
    if (relativePath[0] !== '.') {
      relativePath = `./${relativePath}`
    }

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

    let configNode = new AtRule({ name: 'config', params: `"${relativePath}"` })

    if (!locationNode) {
      root.prepend(configNode)
    } else if (locationNode.name === 'import') {
      locationNode.after(configNode)
    } else if (locationNode.name === 'theme') {
      locationNode.before(configNode)
    }
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-at-config',
    OnceExit: migrate,
  }
}
