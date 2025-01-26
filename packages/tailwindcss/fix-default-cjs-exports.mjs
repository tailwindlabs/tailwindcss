import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// regex to find export {} in a d.ts file
const regexp = /export\s*\{([^}]*)\}/
// regex to find the default export in previous export {} expression
const defaultExportRegexp = /\s*as\s+default\s*/

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * This function will replace `export { type X, Y, Z as default }` with:
 * ```js
 * export = Z;
 * export { type X, Y }; // <== this line will be only added if there are additional named exports
 * ```
 * @param dtsPath {string}
 * @returns {Promise<void>}
 */
async function fixDefaultCjsExport(dtsPath) {
  const content = await readFile(dtsPath, { encoding: 'utf-8' })
  let match = content.match(regexp)
  if (!match) return
  const fullExport = match[0]
  /**@type {string | undefined}*/
  let defaultExport = undefined
  /**@type {string[]} */
  const namedExports = []
  for (const exp of match[1].split(',').map((e) => e.trim())) {
    match = exp.match(defaultExportRegexp)
    if (match) {
      defaultExport = exp.replace(match[0], '').trim()
    } else {
      namedExports.push(exp)
    }
  }
  if (!defaultExport) return
  const newContent =
    namedExports.length === 0
      ? content.replace(fullExport, `export = ${defaultExport}`)
      : content.replace(
          fullExport,
          `export = ${defaultExport};\nexport { ${namedExports.join(', ')} }`,
        )
  await writeFile(dtsPath, newContent, 'utf-8')
}

/**
 * List all `.d.ts` files in the `dist` directory and fix the default export.
 *
 * @returns {Promise<void>}
 */
async function fixDefaultCjsExports() {
  const files = await readdir(resolve(__dirname, 'dist')).then((f) => {
    return f
      .filter((file) => file.endsWith('.d.ts'))
      .map((file) => resolve(__dirname, 'dist', file))
  })
  await Promise.all(files.map((file) => fixDefaultCjsExport(file)))
}

fixDefaultCjsExports()
