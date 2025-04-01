import fs from 'node:fs/promises'
import path from 'node:path'
import { pkg } from '../../utils/packages'
import { highlight, info, relative, success, warn } from '../../utils/renderer'

// Migrates simple PostCSS setups. This is to cover non-dynamic config files
// similar to the ones we have all over our docs:
//
// ```js
// module.exports = {
//   plugins: {
//     'postcss-import': {},
//     'tailwindcss/nesting': 'postcss-nesting',
//     tailwindcss: {},
//     autoprefixer: {},
//   }
// }
export async function migratePostCSSConfig(base: string) {
  let ranMigration = false
  let didMigrate = false
  let didAddPostcssClient = false
  let didRemoveAutoprefixer = false
  let didRemovePostCSSImport = false

  let packageJsonPath = path.resolve(base, 'package.json')
  let packageJson
  try {
    packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
  } catch {}

  // Priority 1: Handle JS config files
  let jsConfigPath = await detectJSConfigPath(base)
  if (jsConfigPath) {
    let result = await migratePostCSSJSConfig(jsConfigPath)
    ranMigration = true

    if (result) {
      didMigrate = true
      didAddPostcssClient = result.didAddPostcssClient
      didRemoveAutoprefixer = result.didRemoveAutoprefixer
      didRemovePostCSSImport = result.didRemovePostCSSImport
    }
  }

  // Priority 2: Handle package.json config
  if (!ranMigration) {
    if (packageJson && 'postcss' in packageJson) {
      let result = await migratePostCSSJsonConfig(packageJson.postcss)
      ranMigration = true

      if (result) {
        await fs.writeFile(
          packageJsonPath,
          JSON.stringify({ ...packageJson, postcss: result?.json }, null, 2),
        )

        didMigrate = true
        didAddPostcssClient = result.didAddPostcssClient
        didRemoveAutoprefixer = result.didRemoveAutoprefixer
        didRemovePostCSSImport = result.didRemovePostCSSImport
      }
    }
  }

  // Priority 3: JSON based postcss config files
  if (!ranMigration) {
    let jsonConfigPath = await detectJSONConfigPath(base)
    let jsonConfig: null | any = null
    if (jsonConfigPath) {
      try {
        jsonConfig = JSON.parse(await fs.readFile(jsonConfigPath, 'utf-8'))
      } catch {}
      if (jsonConfig) {
        let result = await migratePostCSSJsonConfig(jsonConfig)
        ranMigration = true

        if (result) {
          await fs.writeFile(jsonConfigPath, JSON.stringify(result.json, null, 2))

          didMigrate = true
          didAddPostcssClient = result.didAddPostcssClient
          didRemoveAutoprefixer = result.didRemoveAutoprefixer
          didRemovePostCSSImport = result.didRemovePostCSSImport
        }
      }
    }
  }

  if (!ranMigration) {
    info('No PostCSS config found, skipping migration.', {
      prefix: '↳ ',
    })
    return
  }

  if (didAddPostcssClient) {
    let location = Object.hasOwn(packageJson?.dependencies ?? {}, 'tailwindcss')
      ? ('dependencies' as const)
      : Object.hasOwn(packageJson?.devDependencies ?? {}, 'tailwindcss')
        ? ('devDependencies' as const)
        : null

    if (location !== null) {
      try {
        await pkg(base).add(['@tailwindcss/postcss@latest'], location)
        success(`Installed package: ${highlight('@tailwindcss/postcss')}`, { prefix: '↳ ' })
      } catch {}
    }
  }

  if (didRemoveAutoprefixer) {
    try {
      await pkg(base).remove(['autoprefixer'])
      success(`Removed package: ${highlight('autoprefixer')}`, { prefix: '↳ ' })
    } catch {}
  }

  if (didRemovePostCSSImport) {
    try {
      await pkg(base).remove(['postcss-import'])
      success(`Removed package: ${highlight('postcss-import')}`, { prefix: '↳ ' })
    } catch {}
  }

  if (didMigrate && jsConfigPath) {
    success(`Migrated PostCSS configuration: ${highlight(relative(jsConfigPath, base))}`, {
      prefix: '↳ ',
    })
  }
}

async function migratePostCSSJSConfig(configPath: string): Promise<{
  didAddPostcssClient: boolean
  didRemoveAutoprefixer: boolean
  didRemovePostCSSImport: boolean
} | null> {
  function isTailwindCSSPlugin(line: string) {
    return /['"]?tailwindcss['"]?\: ?\{\}/.test(line)
  }
  function isPostCSSImportPlugin(line: string) {
    return /['"]?postcss-import['"]?\: ?\{\}/.test(line)
  }
  function isAutoprefixerPlugin(line: string) {
    return /['"]?autoprefixer['"]?\: ?\{\}/.test(line)
  }
  function isTailwindCSSNestingPlugin(line: string) {
    return /['"]tailwindcss\/nesting['"]\: ?(\{\}|['"]postcss-nesting['"])/.test(line)
  }

  info('Migrating PostCSS configuration…')

  let isSimpleConfig = await isSimplePostCSSConfig(configPath)
  if (!isSimpleConfig) {
    warn('The PostCSS config contains dynamic JavaScript and can not be automatically migrated.', {
      prefix: '↳ ',
    })
    return null
  }

  let didAddPostcssClient = false
  let didRemoveAutoprefixer = false
  let didRemovePostCSSImport = false

  let content = await fs.readFile(configPath, 'utf-8')
  let lines = content.split('\n')
  let newLines: string[] = []
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    if (isTailwindCSSPlugin(line)) {
      didAddPostcssClient = true
      newLines.push(line.replace('tailwindcss:', `'@tailwindcss/postcss':`))
    } else if (isAutoprefixerPlugin(line)) {
      didRemoveAutoprefixer = true
    } else if (isPostCSSImportPlugin(line)) {
      // Check that there are no unknown plugins before the tailwindcss plugin
      let hasUnknownPluginsBeforeTailwindCSS = false
      for (let j = i + 1; j < lines.length; j++) {
        let nextLine = lines[j]
        if (isTailwindCSSPlugin(nextLine)) {
          break
        }
        if (isTailwindCSSNestingPlugin(nextLine)) {
          continue
        }
        hasUnknownPluginsBeforeTailwindCSS = true
        break
      }

      if (!hasUnknownPluginsBeforeTailwindCSS) {
        didRemovePostCSSImport = true
      } else {
        newLines.push(line)
      }
    } else if (isTailwindCSSNestingPlugin(line)) {
      // Check if the following rule is the tailwindcss plugin
      let nextLine = lines[i + 1]
      if (isTailwindCSSPlugin(nextLine)) {
        // Since this plugin is bundled with `tailwindcss`, we don't need to
        // clean up a package when deleting this line.
      } else {
        newLines.push(line)
      }
    } else {
      newLines.push(line)
    }
  }
  await fs.writeFile(configPath, newLines.join('\n'))

  return { didAddPostcssClient, didRemoveAutoprefixer, didRemovePostCSSImport }
}

async function migratePostCSSJsonConfig(json: any): Promise<{
  json: any
  didAddPostcssClient: boolean
  didRemoveAutoprefixer: boolean
  didRemovePostCSSImport: boolean
} | null> {
  function isTailwindCSSPlugin(plugin: string, options: any) {
    return plugin === 'tailwindcss' && isEmptyObject(options)
  }
  function isPostCSSImportPlugin(plugin: string, options: any) {
    return plugin === 'postcss-import' && isEmptyObject(options)
  }
  function isAutoprefixerPlugin(plugin: string, options: any) {
    return plugin === 'autoprefixer' && isEmptyObject(options)
  }
  function isTailwindCSSNestingPlugin(plugin: string, options: any) {
    return (
      plugin === 'tailwindcss/nesting' && (options === 'postcss-nesting' || isEmptyObject(options))
    )
  }

  let didAddPostcssClient = false
  let didRemoveAutoprefixer = false
  let didRemovePostCSSImport = false

  let plugins = Object.entries(json.plugins || {})

  let newPlugins: [string, any][] = []
  for (let i = 0; i < plugins.length; i++) {
    let [plugin, options] = plugins[i]

    if (isTailwindCSSPlugin(plugin, options)) {
      didAddPostcssClient = true
      newPlugins.push(['@tailwindcss/postcss', options])
    } else if (isAutoprefixerPlugin(plugin, options)) {
      didRemoveAutoprefixer = true
    } else if (isPostCSSImportPlugin(plugin, options)) {
      // Check that there are no unknown plugins before the tailwindcss plugin
      let hasUnknownPluginsBeforeTailwindCSS = false
      for (let j = i + 1; j < plugins.length; j++) {
        let [nextPlugin, nextOptions] = plugins[j]
        if (isTailwindCSSPlugin(nextPlugin, nextOptions)) {
          break
        }
        if (isTailwindCSSNestingPlugin(nextPlugin, nextOptions)) {
          continue
        }
        hasUnknownPluginsBeforeTailwindCSS = true
        break
      }

      if (!hasUnknownPluginsBeforeTailwindCSS) {
        didRemovePostCSSImport = true
      } else {
        newPlugins.push([plugin, options])
      }
    } else if (isTailwindCSSNestingPlugin(plugin, options)) {
      // Check if the following rule is the tailwindcss plugin
      let [nextPlugin, nextOptions] = plugins[i + 1]
      if (isTailwindCSSPlugin(nextPlugin, nextOptions)) {
        // Since this plugin is bundled with `tailwindcss`, we don't need to
        // clean up a package when deleting this line.
      } else {
        newPlugins.push([plugin, options])
      }
    } else {
      newPlugins.push([plugin, options])
    }
  }

  return {
    json: { ...json, plugins: Object.fromEntries(newPlugins) },
    didAddPostcssClient,
    didRemoveAutoprefixer,
    didRemovePostCSSImport,
  }
}

const JS_CONFIG_FILE_LOCATIONS = [
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
async function detectJSConfigPath(base: string): Promise<null | string> {
  for (let file of JS_CONFIG_FILE_LOCATIONS) {
    let fullPath = path.resolve(base, file)
    try {
      await fs.access(fullPath)
      return fullPath
    } catch {}
  }
  return null
}

const JSON_CONFIG_FILE_LOCATIONS = [
  '.postcssrc',
  '.postcssrc.json',
  // yaml syntax is not supported
  // '.postcssrc.yml'
]
async function detectJSONConfigPath(base: string): Promise<null | string> {
  for (let file of JSON_CONFIG_FILE_LOCATIONS) {
    let fullPath = path.resolve(base, file)
    try {
      await fs.access(fullPath)
      return fullPath
    } catch {}
  }
  return null
}

async function isSimplePostCSSConfig(configPath: string): Promise<boolean> {
  let content = await fs.readFile(configPath, 'utf-8')
  return (
    content.includes('tailwindcss:') &&
    !(
      content.includes('require') ||
      // Adding a space at the end to not match `'postcss-import'`
      content.includes('import ')
    )
  )
}

function isEmptyObject(obj: any) {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length === 0
}
