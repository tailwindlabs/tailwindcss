import fs from 'node:fs/promises'
import { dirname } from 'path'
import type { Config } from 'tailwindcss'
import { fileURLToPath } from 'url'
import { loadModule } from '../../@tailwindcss-node/src/compile'
import {
  keyPathToCssProperty,
  themeableValues,
} from '../../tailwindcss/src/compat/apply-config-to-theme'
import { darkModePlugin } from '../../tailwindcss/src/compat/dark-mode'
import { info } from './utils/renderer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function migrateJsConfig(fullConfigPath: string): Promise<void> {
  let [unresolvedConfig, source] = await Promise.all([
    loadModule(fullConfigPath, __dirname, () => {}).then((result) => result.module) as Config,
    fs.readFile(fullConfigPath, 'utf-8'),
  ])

  if (!isSimpleConfig(unresolvedConfig, source)) {
    info(
      'The configuration file is not a simple object. Please refer to the migration guide for how to migrate it fully to Tailwind CSS v4. For now, we will load the configuration file as-is.',
    )
    return
  }

  let cssConfigs: string[] = []

  if ('darkMode' in unresolvedConfig) {
    cssConfigs.push(migrateDarkMode(unresolvedConfig as any))
  }

  if ('content' in unresolvedConfig) {
    cssConfigs.push(migrateContent(unresolvedConfig as any))
  }

  if ('theme' in unresolvedConfig) {
    cssConfigs.push(await migrateTheme(unresolvedConfig as any))
  }

  console.log(cssConfigs.join('\n'))
}

async function migrateTheme(unresolvedConfig: Config & { theme: any }): Promise<string> {
  let { extend: extendTheme, ...overwriteTheme } = unresolvedConfig.theme

  let resetNamespaces = new Set()
  let prevSectionKey = ''

  let css = `@theme reference inline {\n`
  for (let [key, value] of themeableValues(overwriteTheme)) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      continue
    }

    let sectionKey = createSectionKey(key)
    if (sectionKey !== prevSectionKey) {
      css += `\n`
      prevSectionKey = sectionKey
    }

    if (!resetNamespaces.has(key[0])) {
      resetNamespaces.add(key[0])
      css += `  --${keyPathToCssProperty([key[0]])}-*: initial;\n`
    }

    css += `  --${keyPathToCssProperty(key)}: ${value};\n`
  }

  for (let [key, value] of themeableValues(extendTheme)) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      continue
    }

    let sectionKey = createSectionKey(key)
    if (sectionKey !== prevSectionKey) {
      css += `\n`
      prevSectionKey = sectionKey
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
    // ignore tuples
    if (key[i + 1][0] === '-') {
      break
    }
    sectionSegments.push(segment)
  }
  return sectionSegments.join('-')
}

function migrateContent(unresolvedConfig: Config & { content: any }): string {
  let css = ''
  for (let content of unresolvedConfig.content) {
    if (typeof content !== 'string') {
      throw new Error('Unsupported content value: ' + content)
    }

    css += `@source  "${content}";\n`
  }
  return css
}

// Applies heuristics to determine if we can attempt to migrate the config
async function isSimpleConfig(unresolvedConfig: Config, source: string): Promise<boolean> {
  // The file may not contain any functions
  if (source.includes('function') || source.includes(' => ')) {
    return false
  }

  // The file may not contain non-serializable values
  const isSimpleValue = (value: unknown): boolean => {
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

  // The file may only contain known-migrateable high-level properties
  const knownProperties = ['darkMode', 'content', 'theme', 'plugins', 'presets']
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
