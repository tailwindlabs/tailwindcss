import fs from 'node:fs/promises'
import path from 'node:path'
import { pkg } from './utils/packages'
import { info, success, warn } from './utils/renderer'

// Migrates simple PostCSS setups. This is to cover non-dynamic config files
// similar to the ones we have all over our docs:
//
// ```js
// module.exports = {
//  plugins: {
//    tailwindcss: {},
//    autoprefixer: {},
//  }
// }
export async function migratePostCSSConfig(base: string) {
  let configPath = await detectConfigPath(base)
  if (configPath === null) {
    // TODO: We can look for an eventual config inside package.json
    return
  }

  info(`Attempt to upgrade the PostCSS config in file: ${configPath}`)

  let isSimpleConfig = await isSimplePostCSSConfig(base, configPath)
  if (!isSimpleConfig) {
    warn(`The PostCSS config contains dynamic JavaScript and can not be automatically migrated.`)
    return
  }

  let didAddPostcssClient = false
  let didRemoveAutoprefixer = false

  let fullPath = path.resolve(base, configPath)
  let content = await fs.readFile(fullPath, 'utf-8')
  let lines = content.split('\n')
  let newLines: string[] = []
  for (let line of lines) {
    if (line.includes('tailwindcss:')) {
      didAddPostcssClient = true
      newLines.push(line.replace('tailwindcss:', `'@tailwindcss/postcss':`))
    } else if (line.includes('autoprefixer:')) {
      didRemoveAutoprefixer = true
    } else {
      newLines.push(line)
    }
  }
  await fs.writeFile(fullPath, newLines.join('\n'))

  if (didAddPostcssClient) {
    try {
      await pkg('add -D @tailwindcss/postcss@next', base)
    } catch {}
  }
  if (didRemoveAutoprefixer) {
    try {
      await pkg('remove autoprefixer', base)
    } catch {}
  }

  success(`PostCSS config in file ${configPath} has been upgraded.`)
}

const CONFIG_FILE_LOCATIONS = [
  '.postcssrc.js',
  '.postcssrc.mjs',
  '.postcssrc.cjs',
  '.postcssrc.ts',
  '.postcssrc.mts',
  '.postcssrc.cts',
  'postcss.config.js',
  'postcss.config.mjs',
  'postcss.config.cjs',
  'postcss.config.ts',
  'postcss.config.mts',
  'postcss.config.cts',
]
async function detectConfigPath(base: string): Promise<null | string> {
  for (let file of CONFIG_FILE_LOCATIONS) {
    let fullPath = path.resolve(base, file)
    try {
      await fs.access(fullPath)
      return file
    } catch {}
  }
  return null
}

async function isSimplePostCSSConfig(base: string, configPath: string): Promise<boolean> {
  let fullPath = path.resolve(base, configPath)
  let content = await fs.readFile(fullPath, 'utf-8')
  return (
    content.includes('tailwindcss:') && !(content.includes('require') || content.includes('import'))
  )
}
