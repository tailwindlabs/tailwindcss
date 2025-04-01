import { Scanner } from '@tailwindcss/oxide'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadModule } from '../../../../@tailwindcss-node/src/compile'
import defaultTheme from '../../../../tailwindcss/dist/default-theme'
import { atRule, toCss, type AstNode } from '../../../../tailwindcss/src/ast'
import {
  keyPathToCssProperty,
  themeableValues,
} from '../../../../tailwindcss/src/compat/apply-config-to-theme'
import { keyframesToRules } from '../../../../tailwindcss/src/compat/apply-keyframes-to-theme'
import {
  resolveConfig,
  type ConfigFile,
} from '../../../../tailwindcss/src/compat/config/resolve-config'
import type { ResolvedConfig, ThemeConfig } from '../../../../tailwindcss/src/compat/config/types'
import { buildCustomContainerUtilityRules } from '../../../../tailwindcss/src/compat/container'
import { darkModePlugin } from '../../../../tailwindcss/src/compat/dark-mode'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { escape } from '../../../../tailwindcss/src/utils/escape'
import {
  isValidOpacityValue,
  isValidSpacingMultiplier,
} from '../../../../tailwindcss/src/utils/infer-data-type'
import { findStaticPlugins, type StaticPluginOptions } from '../../utils/extract-static-plugins'
import { highlight, info, relative } from '../../utils/renderer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
      `The configuration file at ${highlight(relative(fullConfigPath, base))} could not be automatically migrated to the new CSS configuration format, so your CSS has been updated to load your existing configuration file.`,
      { prefix: '↳ ' },
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
    sources = await migrateContent(unresolvedConfig as any, fullConfigPath, base)
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
    reference: false,
  }
  let { resolvedConfig, replacedThemeKeys } = resolveConfig(designSystem, [configToResolve])

  let resetNamespaces = new Map<string, boolean>(
    Array.from(replacedThemeKeys.entries()).map(([key]) => [key, false]),
  )

  removeUnnecessarySpacingKeys(designSystem, resolvedConfig, replacedThemeKeys)

  let prevSectionKey = ''
  let css = '\n@tw-bucket theme {\n'
  css += `\n@theme {\n`
  let containsThemeKeys = false
  for (let [key, value] of themeableValues(resolvedConfig.theme)) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      continue
    }

    if (typeof value === 'string') {
      // This is more advanced than the version in core as ideally something
      // like `rgba(0 0 0 / <alpha-value>)` becomes `rgba(0 0 0)`. Since we know
      // from the `/` that it's used in an alpha channel and we can remove it.
      //
      // In other cases we may not know exactly how its used, so we'll just
      // replace it with `1` like core does.
      value = value.replace(/\s*\/\s*<alpha-value>/, '').replace(/<alpha-value>/, '1')
    }

    // Convert `opacity` namespace from decimal to percentage values.
    // Additionally we can drop values that resolve to the same value as the
    // named modifier with the same name.
    if (key[0] === 'opacity' && (typeof value === 'number' || typeof value === 'string')) {
      let numValue = typeof value === 'string' ? parseFloat(value) : value

      if (numValue >= 0 && numValue <= 1) {
        value = numValue * 100 + '%'
      }

      if (
        typeof value === 'string' &&
        key[1] === value.replace(/%$/, '') &&
        isValidOpacityValue(key[1])
      ) {
        continue
      }
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
      let property = keyPathToCssProperty([key[0]])
      if (property !== null) {
        css += `  ${escape(`--${property}`)}-*: initial;\n`
      }
    }

    let property = keyPathToCssProperty(key)
    if (property !== null) {
      css += `  ${escape(`--${property}`)}: ${value};\n`
    }
  }

  if ('keyframes' in resolvedConfig.theme) {
    containsThemeKeys = true
    css += '\n' + keyframesToCss(resolvedConfig.theme.keyframes)
  }

  if (!containsThemeKeys) {
    return null
  }

  css += '}\n' // @theme

  if ('container' in resolvedConfig.theme) {
    let rules = buildCustomContainerUtilityRules(resolvedConfig.theme.container, designSystem)
    if (rules.length > 0) {
      css += '\n' + toCss([atRule('@utility', 'container', rules)])
    }
  }

  css += '}\n' // @tw-bucket

  return css
}

function migrateDarkMode(unresolvedConfig: Config & { darkMode: any }): string {
  let variant: string | string[] = ''
  let addVariant = (_name: string, _variant: string) => (variant = _variant)
  let config = () => unresolvedConfig.darkMode
  darkModePlugin({ config, addVariant })

  if (variant === '') {
    return ''
  }

  if (!Array.isArray(variant)) {
    variant = [variant]
  }

  if (variant.length === 1 && !variant[0].includes('{')) {
    return `\n@tw-bucket custom-variant {\n@custom-variant dark (${variant[0]});\n}\n`
  }

  let customVariant = ''
  for (let variantName of variant) {
    // Convert to the block syntax if a block is used
    if (variantName.includes('{')) {
      customVariant += variantName.replace('}', '{ @slot }}') + '\n'
    } else {
      customVariant += variantName + '{ @slot }\n'
    }
  }

  if (customVariant !== '') {
    return `\n@tw-bucket custom-variant {\n@custom-variant dark {${customVariant}};\n}\n`
  }

  return ''
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
  unresolvedConfig: Config,
  configPath: string,
  base: string,
): Promise<{ base: string; pattern: string }[]> {
  let autoContentFiles = autodetectedSourceFiles(base)

  let sources = []
  let contentIsRelative = (() => {
    if (!unresolvedConfig.content) return false
    if (Array.isArray(unresolvedConfig.content)) return false
    if (unresolvedConfig.content.relative) return true
    if (unresolvedConfig.future === 'all') return false
    return unresolvedConfig.future?.relativeContentPathsByDefault ?? false
  })()

  let sourceGlobs = Array.isArray(unresolvedConfig.content)
    ? unresolvedConfig.content.map((pattern) => ({ base, pattern }))
    : (unresolvedConfig.content?.files ?? []).map((pattern) => {
        if (typeof pattern === 'string' && contentIsRelative) {
          return { base: path.dirname(configPath), pattern: pattern }
        }
        return { base, pattern }
      })

  for (let { base, pattern } of sourceGlobs) {
    if (typeof pattern !== 'string') {
      throw new Error('Unsupported content value: ' + pattern)
    }

    let sourceFiles = patternSourceFiles({
      base,
      pattern: pattern[0] === '!' ? pattern.slice(1) : pattern,
      negated: pattern[0] === '!',
    })

    let autoContentContainsAllSourceFiles = true
    for (let sourceFile of sourceFiles) {
      if (!autoContentFiles.includes(sourceFile)) {
        autoContentContainsAllSourceFiles = false
        break
      }
    }

    if (!autoContentContainsAllSourceFiles) {
      sources.push({ base, pattern })
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
  let scanner = new Scanner({
    sources: [
      {
        base,
        pattern: '**/*',
        negated: false,
      },
    ],
  })
  scanner.scan()
  return scanner.files
}

function patternSourceFiles(source: { base: string; pattern: string; negated: boolean }): string[] {
  let scanner = new Scanner({ sources: [source] })
  scanner.scan()
  return scanner.files
}

function removeUnnecessarySpacingKeys(
  designSystem: DesignSystem,
  resolvedConfig: ResolvedConfig,
  replacedThemeKeys: Set<string>,
) {
  // We want to keep the spacing scale as-is if the user is overwriting
  if (replacedThemeKeys.has('spacing')) return

  // Ensure we have a spacing multiplier
  let spacingScale = designSystem.theme.get(['--spacing'])
  if (!spacingScale) return

  let [spacingMultiplier, spacingUnit] = splitNumberAndUnit(spacingScale)
  if (!spacingMultiplier || !spacingUnit) return

  if (spacingScale && !replacedThemeKeys.has('spacing')) {
    for (let [key, value] of Object.entries(resolvedConfig.theme.spacing ?? {})) {
      let [multiplier, unit] = splitNumberAndUnit(value as string)
      if (multiplier === null) continue

      if (!isValidSpacingMultiplier(key)) continue
      if (unit !== spacingUnit) continue

      if (parseFloat(multiplier) === Number(key) * parseFloat(spacingMultiplier)) {
        delete resolvedConfig.theme.spacing[key]
        designSystem.theme.clearNamespace(escape(`--spacing-${key.replaceAll('.', '_')}`), 0)
      }
    }
  }
}

function splitNumberAndUnit(value: string): [string, string] | [null, null] {
  let match = value.match(/^([0-9.]+)(.*)$/)
  if (!match) {
    return [null, null]
  }
  return [match[1], match[2]]
}
