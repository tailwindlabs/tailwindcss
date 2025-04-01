import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { type Plugin, type Root } from 'postcss'
import { parseImportParams } from '../../../../tailwindcss/src/at-import'
import { segment } from '../../../../tailwindcss/src/utils/segment'
import * as ValueParser from '../../../../tailwindcss/src/value-parser'

export function migrateImport(): Plugin {
  async function migrate(root: Root) {
    let file = root.source?.input.file
    if (!file) return

    let promises: Promise<void>[] = []
    root.walkAtRules('import', (rule) => {
      try {
        let [firstParam, ...rest] = segment(rule.params, ' ')

        let params = parseImportParams(ValueParser.parse(firstParam))
        if (!params) return

        let isRelative = params.uri[0] === '.'
        let hasCssExtension = params.uri.endsWith('.css')

        if (isRelative && hasCssExtension) {
          return
        }

        let fullPath = resolve(dirname(file), params.uri)
        if (!hasCssExtension) fullPath += '.css'

        promises.push(
          fs.stat(fullPath).then(() => {
            let ext = hasCssExtension ? '' : '.css'
            let path = isRelative ? params.uri : `./${params.uri}`
            rule.params = [`'${path}${ext}'`, ...rest].join(' ')
          }),
        )
      } catch {
        // When an error occurs while parsing the `@import` statement, we skip
        // the import. This will happen in cases where you import an external
        // URL.
      }
    })

    await Promise.allSettled(promises)
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-import',
    OnceExit: migrate,
  }
}
