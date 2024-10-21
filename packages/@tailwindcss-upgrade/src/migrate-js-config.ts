import { Scanner } from '@tailwindcss/oxide'
import fs from 'node:fs/promises'
import { dirname } from 'path'
import { type Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import { fileURLToPath } from 'url'
import { loadModule } from '../../@tailwindcss-node/src/compile'
import { toCss, type AstNode } from '../../tailwindcss/src/ast'
import {
  keyPathToCssProperty,
  themeableValues,
} from '../../tailwindcss/src/compat/apply-config-to-theme'
import { keyframesToRules } from '../../tailwindcss/src/compat/apply-keyframes-to-theme'
import { resolveConfig, type ConfigFile } from '../../tailwindcss/src/compat/config/resolve-config'
import type { ThemeConfig } from '../../tailwindcss/src/compat/config/types'
import { darkModePlugin } from '../../tailwindcss/src/compat/dark-mode'
import type { DesignSystem } from '../../tailwindcss/src/design-system'
import { findStaticPlugins, type StaticPluginOptions } from './utils/extract-static-plugins'
import { info } from './utils/renderer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export type JSConfigMigration =
  // Could not convert the config file, need to inject it as-is in a @config directive
  null | {
    sources: { base: string; pattern: string }[]
    plugins: { base: string; path: string; options: null | StaticPluginOptions }[]
    css: string
  }

export async function migrateJsConfig(
  designSystem: DesignSystem,
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
  let plugins: { base: string; path: string; options: null | StaticPluginOptions }[] = []
  let cssConfigs: string[] = []

  if ('darkMode' in unresolvedConfig) {
    cssConfigs.push(migrateDarkMode(unresolvedConfig as any))
  }

  if ('content' in unresolvedConfig) {
    sources = await migrateContent(unresolvedConfig as any, base)
  }

  if ('theme' in unresolvedConfig) {
    let themeConfig = await migrateTheme(designSystem, unresolvedConfig, base)
    if (themeConfig) cssConfigs.push(themeConfig)
  }

  if ('corePlugins' in unresolvedConfig) {
    info(
      `The \`corePlugins\` option is no longer supported as of Tailwind CSS v4.0, so it's been removed from your configuration.`,
    )
  }

  let simplePlugins = findStaticPlugins(source)
  if (simplePlugins !== null) {
    for (let [path, options] of simplePlugins) {
      plugins.push({ base, path, options })
    }
  }

  return {
    sources,
    plugins,
    css: cssConfigs.join('\n'),
  }
}

async function migrateTheme(
  designSystem: DesignSystem,
  unresolvedConfig: Config,
  base: string,
): Promise<string | null> {
  // Resolve the config file without applying plugins and presets, as these are
  // migrated to CSS separately.
  let configToResolve: ConfigFile = {
    base,
    config: { ...unresolvedConfig, plugins: [], presets: undefined },
  }
  let { resolvedConfig, replacedThemeKeys } = resolveConfig(designSystem, [configToResolve])

  let resetNamespaces = new Map<string, boolean>(
    Array.from(replacedThemeKeys.entries()).map(([key]) => [key, false]),
  )

  let prevSectionKey = ''
  let css = `@theme {`
  let containsThemeKeys = false
  for (let [key, value] of themeableValues(resolvedConfig.theme)) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      continue
    }

    if (key[0] === 'keyframes') {
      continue
    }
    containsThemeKeys = true

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

  if ('keyframes' in resolvedConfig.theme) {
    containsThemeKeys = true
    css += '\n' + keyframesToCss(resolvedConfig.theme.keyframes)
  }

  if (!containsThemeKeys) {
    return null
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

async function migrateContent(
  unresolvedConfig: Config & { content: any },
  base: string,
): Promise<{ base: string; pattern: string }[]> {
  let autoContentFiles = autodetectedSourceFiles(base)

  let sources = []
  for (let content of unresolvedConfig.content) {
    if (typeof content !== 'string') {
      throw new Error('Unsupported content value: ' + content)
    }

    let sourceFiles = patternSourceFiles({ base, pattern: content })

    let autoContentContainsAllSourceFiles = true
    for (let sourceFile of sourceFiles) {
      if (!autoContentFiles.includes(sourceFile)) {
        autoContentContainsAllSourceFiles = false
        break
      }
    }

    if (!autoContentContainsAllSourceFiles) {
      sources.push({ base, pattern: content })
    }
  }
  return sources
}

// Applies heuristics to determine if we can attempt to migrate the config
function canMigrateConfig(unresolvedConfig: Config, source: string): boolean {
  // The file may not contain non-serializable values
  function isSimpleValue(value: unknown): boolean {
    if (typeof value === 'function') return false
    if (Array.isArray(value)) return value.every(isSimpleValue)
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).every(isSimpleValue)
    }
    return ['string', 'number', 'boolean', 'undefined'].includes(typeof value)
  }

  // `theme` and `plugins` are handled separately and allowed to be more complex
  let { plugins, theme, ...remainder } = unresolvedConfig
  if (!isSimpleValue(remainder)) {
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
    'corePlugins',
  ]

  if (Object.keys(unresolvedConfig).some((key) => !knownProperties.includes(key))) {
    return false
  }

  if (findStaticPlugins(source) === null) {
    return false
  }

  if (unresolvedConfig.presets && unresolvedConfig.presets.length > 0) {
    return false
  }

  // Only migrate the config file if all top-level theme keys are allowed to be
  // migrated
  if (theme && typeof theme === 'object') {
    if (theme.extend && !onlyAllowedThemeValues(theme.extend)) return false
    let { extend: _extend, ...themeCopy } = theme
    if (!onlyAllowedThemeValues(themeCopy)) return false
  }

  return true
}

const ALLOWED_THEME_KEYS = [
  ...Object.keys(defaultTheme),
  // Used by @tailwindcss/container-queries
  'containers',
]
const BLOCKED_THEME_KEYS = ['supports', 'data', 'aria']
function onlyAllowedThemeValues(theme: ThemeConfig): boolean {
  for (let key of Object.keys(theme)) {
    if (!ALLOWED_THEME_KEYS.includes(key)) {
      return false
    }
    if (BLOCKED_THEME_KEYS.includes(key)) {
      return false
    }
  }

  if ('screens' in theme && typeof theme.screens === 'object' && theme.screens !== null) {
    for (let screen of Object.values(theme.screens)) {
      if (typeof screen === 'object' && screen !== null && ('max' in screen || 'raw' in screen)) {
        return false
      }
    }
  }
  return true
}

function keyframesToCss(keyframes: Record<string, unknown>): string {
  let ast: AstNode[] = keyframesToRules({ theme: { keyframes } })
  return toCss(ast).trim() + '\n'
}

function autodetectedSourceFiles(base: string) {
  let scanner = new Scanner({ detectSources: { base } })
  scanner.scan()
  return scanner.files
}

function patternSourceFiles(source: { base: string; pattern: string }): string[] {
  let scanner = new Scanner({ sources: [source] })
  scanner.scan()
  return scanner.files
}
