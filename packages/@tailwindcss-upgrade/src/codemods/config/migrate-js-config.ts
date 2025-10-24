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
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { escape } from '../../../../tailwindcss/src/utils/escape'
import {
  isValidOpacityValue,
  isValidSpacingMultiplier,
} from '../../../../tailwindcss/src/utils/infer-data-type'
import * as ValueParser from '../../../../tailwindcss/src/value-parser'
import { findStaticPlugins, type StaticPluginOptions } from '../../utils/extract-static-plugins'
import { highlight, info, relative, warn } from '../../utils/renderer'

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

  let canMigrateConfigResult = canMigrateConfig(unresolvedConfig, source)
  if (!canMigrateConfigResult.valid) {
    info(
      `The configuration file at ${highlight(relative(fullConfigPath, base))} could not be automatically migrated to the new CSS configuration format, so your CSS has been updated to load your existing configuration file.`,
      { prefix: '↳ ' },
    )
    for (let [category, messages] of canMigrateConfigResult.errors.entries()) {
      switch (category) {
        case 'general': {
          for (let msg of messages) warn(msg, { prefix: '  ↳ ' })
          break
        }
        case 'top-level': {
          warn(
            `Cannot migrate unknown top-level keys:\n${Array.from(messages)
              .map((key) => `  - \`${key}\``)
              .join(
                '\n',
              )}\n\nThese are non-standard Tailwind CSS options, so we don't know how to migrate them to CSS.`,
            { prefix: '  ↳ ' },
          )
          break
        }
        case 'unknown-theme-keys': {
          warn(
            `Cannot migrate unknown theme keys:\n${Array.from(messages)
              .map((key) => `  - \`${key}\``)
              .join(
                '\n',
              )}\n\nThese are non-standard Tailwind CSS theme keys, so we don't know how to migrate them to CSS.`,
            { prefix: '  ↳ ' },
          )
          break
        }
        case 'complex-screens': {
          warn(
            `Cannot migrate complex screen configuration (min/max/raw):\n${Array.from(messages)
              .map((key) => `  - \`${key}\``)
              .join('\n')}`,
            { prefix: '  ↳ ' },
          )
          break
        }
      }
    }
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
): Promise<string> {
  // Resolve the config file without applying plugins and presets, as these are
  // migrated to CSS separately.
  let configToResolve: ConfigFile = {
    base,
    config: { ...unresolvedConfig, plugins: [], presets: undefined },
    reference: false,
    src: undefined,
  }
  let { resolvedConfig, replacedThemeKeys } = resolveConfig(designSystem, [configToResolve])

  let resetNamespaces = new Map<string, boolean>(
    Array.from(replacedThemeKeys.entries()).map(([key]) => [key, false]),
  )

  removeUnnecessarySpacingKeys(designSystem, resolvedConfig, replacedThemeKeys)

  let css = ''
  let prevSectionKey = ''
  let themeSection: string[] = []
  let keyframesCss = ''
  let variants = new Map<string, string>()

  // Special handling of specific theme keys:
  {
    if ('keyframes' in resolvedConfig.theme) {
      keyframesCss += keyframesToCss(resolvedConfig.theme.keyframes)
      delete resolvedConfig.theme.keyframes
    }

    if ('container' in resolvedConfig.theme) {
      let rules = buildCustomContainerUtilityRules(resolvedConfig.theme.container, designSystem)
      if (rules.length > 0) {
        // Using `theme` instead of `utility` so it sits before the `@layer
        // base` with compatibility CSS. While this is technically a utility, it
        // makes a bit more sense to emit this closer to the `@theme` values
        // since it is needed for backwards compatibility.
        css += `\n@tw-bucket theme {\n`
        css += toCss([atRule('@utility', 'container', rules)])
        css += '}\n' // @tw-bucket
      }
      delete resolvedConfig.theme.container
    }

    if ('aria' in resolvedConfig.theme) {
      for (let [key, value] of Object.entries(resolvedConfig.theme.aria ?? {})) {
        // Will be handled by bare values if the names match.
        // E.g.: `aria-foo:flex` should produce `[aria-foo="true"]`
        if (new RegExp(`^${key}=(['"]?)true\\1$`).test(`${value}`)) continue

        // Create custom variant
        variants.set(`aria-${key}`, `&[aria-${value}]`)
      }
      delete resolvedConfig.theme.aria
    }

    if ('data' in resolvedConfig.theme) {
      for (let [key, value] of Object.entries(resolvedConfig.theme.data ?? {})) {
        // Will be handled by bare values if the names match.
        // E.g.: `data-foo:flex` should produce `[data-foo]`
        if (key === value) continue

        // Create custom variant
        variants.set(`data-${key}`, `&[data-${value}]`)
      }
      delete resolvedConfig.theme.data
    }

    if ('supports' in resolvedConfig.theme) {
      for (let [key, value] of Object.entries(resolvedConfig.theme.supports ?? {})) {
        // Will be handled by bare values if the value of the declaration is a
        // CSS variable.
        let parsed = ValueParser.parse(`${value}`)

        // Unwrap the parens, e.g.: `(foo: var(--bar))` → `foo: var(--bar)`
        if (parsed.length === 1 && parsed[0].kind === 'function' && parsed[0].value === '') {
          parsed = parsed[0].nodes
        }

        // Verify structure: `foo: var(--bar)`
        //                    ^^^ ← must match the `key`
        if (
          parsed.length === 3 &&
          parsed[0].kind === 'word' &&
          parsed[0].value === key &&
          parsed[2].kind === 'function' &&
          parsed[2].value === 'var'
        ) {
          continue
        }

        // Create custom variant
        variants.set(`supports-${key}`, `{@supports(${value}){@slot;}}`)
      }
      delete resolvedConfig.theme.supports
    }
  }

  // Convert theme values to CSS custom properties
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

    let sectionKey = createSectionKey(key)
    if (sectionKey !== prevSectionKey) {
      themeSection.push('')
      prevSectionKey = sectionKey
    }

    if (resetNamespaces.has(key[0]) && resetNamespaces.get(key[0]) === false) {
      resetNamespaces.set(key[0], true)
      let property = keyPathToCssProperty([key[0]])
      if (property !== null) {
        themeSection.push(`  ${escape(`--${property}`)}-*: initial;`)
      }
    }

    let property = keyPathToCssProperty(key)
    if (property !== null) {
      themeSection.push(`  ${escape(`--${property}`)}: ${value};`)
    }
  }

  if (keyframesCss) {
    themeSection.push('', keyframesCss)
  }

  if (themeSection.length > 0) {
    css += `\n@tw-bucket theme {\n`
    css += `\n@theme {\n`
    css += themeSection.join('\n') + '\n'
    css += '}\n' // @theme
    css += '}\n' // @tw-bucket
  }

  if (variants.size > 0) {
    css += '\n@tw-bucket custom-variant {\n'

    let previousRoot = ''
    for (let [name, selector] of variants) {
      let root = name.split('-')[0]
      if (previousRoot !== root) css += '\n'
      previousRoot = root

      if (selector.startsWith('{')) {
        css += `@custom-variant ${name} ${selector}\n`
      } else {
        css += `@custom-variant ${name} (${selector});\n`
      }
    }
    css += '}\n'
  }

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

const JS_IDENTIFIER_REGEX = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
function stringifyPath(path: (string | number)[]): string {
  let result = ''

  for (let segment of path) {
    if (typeof segment === 'number') {
      result += `[${segment}]`
    } else if (!JS_IDENTIFIER_REGEX.test(segment)) {
      result += `[\`${segment}\`]`
    } else {
      result += result.length > 0 ? `.${segment}` : segment
    }
  }

  return result
}

// Keep track of issues given a category and a set of messages
const MIGRATION_ISSUES = new DefaultMap(() => new Set<string>())

// Applies heuristics to determine if we can attempt to migrate the config
function canMigrateConfig(
  unresolvedConfig: Config,
  source: string,
): { valid: true } | { valid: false; errors: typeof MIGRATION_ISSUES } {
  let theme = unresolvedConfig.theme

  // Migrating presets are not supported
  if (unresolvedConfig.presets && unresolvedConfig.presets.length > 0) {
    MIGRATION_ISSUES.get('general').add('Cannot migrate config files that use presets')
  }

  // The file may only contain known-migratable top-level properties
  let knownProperties = [
    'darkMode',
    'content',
    'theme',
    'plugins',
    'presets',
    'prefix', // Prefix is handled in the dedicated prefix migrator
    'corePlugins',
  ]

  for (let key of Object.keys(unresolvedConfig)) {
    if (!knownProperties.includes(key)) {
      MIGRATION_ISSUES.get('top-level').add(key)
    }
  }

  // Only migrate the config file if all top-level theme keys are allowed to be
  // migrated
  if (theme && typeof theme === 'object') {
    let { extend, ...themeCopy } = theme
    onlyAllowedThemeValues(themeCopy, ['theme'])
    if (extend) onlyAllowedThemeValues(extend, ['theme', 'extend'])
  }

  // TODO: findStaticPlugins already logs errors for unsupported plugins, maybe
  // it should return them instead?
  findStaticPlugins(source)

  return MIGRATION_ISSUES.size <= 0 ? { valid: true } : { valid: false, errors: MIGRATION_ISSUES }
}

const ALLOWED_THEME_KEYS = [
  ...Object.keys(defaultTheme),
  // Used by @tailwindcss/container-queries
  'containers',
]
function onlyAllowedThemeValues(theme: ThemeConfig, path: (string | number)[]) {
  for (let key of Object.keys(theme)) {
    if (!ALLOWED_THEME_KEYS.includes(key)) {
      MIGRATION_ISSUES.get('unknown-theme-keys').add(stringifyPath([...path, key]))
    }
  }

  if ('screens' in theme && typeof theme.screens === 'object' && theme.screens !== null) {
    for (let [name, screen] of Object.entries(theme.screens)) {
      if (typeof screen === 'object' && screen !== null && ('max' in screen || 'raw' in screen)) {
        MIGRATION_ISSUES.get('complex-screens').add(stringifyPath([...path, 'screens', name]))
      }
    }
  }
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
