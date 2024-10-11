import fs from 'node:fs/promises'
import { dirname } from 'path'
import type { Config } from 'tailwindcss'
import { fileURLToPath } from 'url'
import { loadModule } from '../../@tailwindcss-node/src/compile'
import {
  keyPathToCssProperty,
  themeableValues,
} from '../../tailwindcss/src/compat/apply-config-to-theme'
import { deepMerge } from '../../tailwindcss/src/compat/config/deep-merge'
import { mergeThemeExtension } from '../../tailwindcss/src/compat/config/resolve-config'
import { darkModePlugin } from '../../tailwindcss/src/compat/dark-mode'
import { info } from './utils/renderer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export type JSConfigMigration =
  // Could not convert the config file, need to inject it as-is in a @config directive
  null | {
    sources: { base: string; pattern: string }[]
    css: string
  }

export async function migrateJsConfig(
  fullConfigPath: string,
  base: string,
): Promise<JSConfigMigration> {
  let [unresolvedConfig, source] = await Promise.all([
    loadModule(fullConfigPath, __dirname, () => {}).then((result) => result.module) as Config,
    fs.readFile(fullConfigPath, 'utf-8'),
  ])

  if (!canMigrateConfig(unresolvedConfig, source)) {
    info(
      'Your configuration file could not be automatically migrated to the new CSS configuration format, so your CSS has been updated to load your existing configuration file.',
    )
    return null
  }

  let sources: { base: string; pattern: string }[] = []
  let cssConfigs: string[] = []

  if ('darkMode' in unresolvedConfig) {
    cssConfigs.push(migrateDarkMode(unresolvedConfig as any))
  }

  if ('content' in unresolvedConfig) {
    sources = migrateContent(unresolvedConfig as any, base)
  }

  if ('theme' in unresolvedConfig) {
    cssConfigs.push(await migrateTheme(unresolvedConfig as any))
  }

  return {
    sources,
    css: cssConfigs.join('\n'),
  }
}

async function migrateTheme(unresolvedConfig: Config & { theme: any }): Promise<string> {
  let { extend: extendTheme, ...overwriteTheme } = unresolvedConfig.theme

  let resetNamespaces = new Map<string, boolean>()
  // Before we merge theme overrides with theme extensions, we capture all
  // namespaces that need to be reset.
  for (let [key, value] of themeableValues(overwriteTheme)) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      continue
    }

    if (!resetNamespaces.has(key[0])) {
      resetNamespaces.set(key[0], false)
    }
  }

  let themeValues = deepMerge({}, [overwriteTheme, extendTheme], mergeThemeExtension)

  let prevSectionKey = ''

  let css = `@theme {`
  for (let [key, value] of themeableValues(themeValues)) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      continue
    }

    let sectionKey = createSectionKey(key)
    if (sectionKey !== prevSectionKey) {
      css += `\n`
      prevSectionKey = sectionKey
    }

    if (resetNamespaces.has(key[0]) && resetNamespaces.get(key[0]) === false) {
      resetNamespaces.set(key[0], true)
      css += `  --${keyPathToCssProperty([key[0]])}-*: initial;\n`
    }

    css += `  --${keyPathToCssProperty(key)}: ${value};\n`
  }

  return css + '}\n'
}

function migrateDarkMode(unresolvedConfig: Config & { darkMode: any }): string {
  let variant: string = ''
  let addVariant = (_name: string, _variant: string) => (variant = _variant)
  let config = () => unresolvedConfig.darkMode
  darkModePlugin({ config, addVariant })

  if (variant === '') {
    return ''
  }
  return `@variant dark (${variant});\n`
}

// Returns a string identifier used to section theme declarations
function createSectionKey(key: string[]): string {
  let sectionSegments = []
  for (let i = 0; i < key.length - 1; i++) {
    let segment = key[i]
    // Ignore tuples
    if (key[i + 1][0] === '-') {
      break
    }
    sectionSegments.push(segment)
  }
  return sectionSegments.join('-')
}

function migrateContent(
  unresolvedConfig: Config & { content: any },
  base: string,
): { base: string; pattern: string }[] {
  let sources = []
  for (let content of unresolvedConfig.content) {
    if (typeof content !== 'string') {
      throw new Error('Unsupported content value: ' + content)
    }
    sources.push({ base, pattern: content })
  }
  return sources
}

// Applies heuristics to determine if we can attempt to migrate the config
function canMigrateConfig(unresolvedConfig: Config, source: string): boolean {
  // The file may not contain any functions
  if (source.includes('function') || source.includes(' => ')) {
    return false
  }

  // The file may not contain non-serializable values
  function isSimpleValue(value: unknown): boolean {
    if (typeof value === 'function') return false
    if (Array.isArray(value)) return value.every(isSimpleValue)
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).every(isSimpleValue)
    }
    return ['string', 'number', 'boolean', 'undefined'].includes(typeof value)
  }

  if (!isSimpleValue(unresolvedConfig)) {
    return false
  }

  // The file may only contain known-migrateable top-level properties
  let knownProperties = [
    'darkMode',
    'content',
    'theme',
    'plugins',
    'presets',
    'prefix', // Prefix is handled in the dedicated prefix migrator
  ]

  if (Object.keys(unresolvedConfig).some((key) => !knownProperties.includes(key))) {
    return false
  }

  if (unresolvedConfig.plugins && unresolvedConfig.plugins.length > 0) {
    return false
  }

  if (unresolvedConfig.presets && unresolvedConfig.presets.length > 0) {
    return false
  }

  return true
}
