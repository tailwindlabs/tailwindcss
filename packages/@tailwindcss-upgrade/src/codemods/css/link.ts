import { normalizePath } from '@tailwindcss/node'
import path from 'node:path'
import postcss from 'postcss'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { Stylesheet } from '../../stylesheet'
import { error, highlight, relative, success } from '../../utils/renderer'
import { detectConfigPath } from '../template/prepare-config'

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
      if (!relative.startsWith('.') && !path.isAbsolute(relative)) {
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
