import type { DesignSystem } from '../../design-system'
import type { SourceLocation } from '../../source-maps/source'
import colors from '../colors'
import type { PluginWithConfig } from '../plugin-api'
import { createThemeFn } from '../plugin-functions'
import { deepMerge, isPlainObject } from './deep-merge'
import {
  type ResolvedConfig,
  type ResolvedContentConfig,
  type ResolvedThemeValue,
  type ThemeValue,
  type UserConfig,
} from './types'

export interface ConfigFile {
  path?: string
  base: string
  config: UserConfig
  reference: boolean
  src: SourceLocation | undefined
}

interface ResolutionContext {
  design: DesignSystem
  configs: Pick<ConfigFile, 'config' | 'src'>[]
  plugins: PluginWithConfig[]
  content: ResolvedContentConfig
  theme: Record<string, ThemeValue>
  extend: Record<string, { value: ThemeValue; src: SourceLocation | undefined }[]>
  result: ResolvedConfig
}

let minimal: ResolvedConfig = {
  blocklist: [],
  future: {},
  experimental: {},
  prefix: '',
  important: false,
  darkMode: null,
  theme: {},
  plugins: [],
  content: {
    files: [],
  },
}

export function resolveConfig(
  design: DesignSystem,
  files: ConfigFile[],
): {
  resolvedConfig: ResolvedConfig
  replacedThemeKeys: Set<string>
  keyframeSources: Map<string, SourceLocation | undefined>
} {
  let ctx: ResolutionContext = {
    design,
    configs: [],
    plugins: [],
    content: {
      files: [],
    },
    theme: {},
    extend: {},

    // Start with a minimal valid, but empty config
    result: structuredClone(minimal),
  }

  for (let file of files) {
    extractConfigs(ctx, file)
  }

  // Merge top level keys
  for (let { config } of ctx.configs) {
    if ('darkMode' in config && config.darkMode !== undefined) {
      ctx.result.darkMode = config.darkMode ?? null
    }

    if ('prefix' in config && config.prefix !== undefined) {
      ctx.result.prefix = config.prefix ?? ''
    }

    if ('blocklist' in config && config.blocklist !== undefined) {
      ctx.result.blocklist = config.blocklist ?? []
    }

    if ('important' in config && config.important !== undefined) {
      ctx.result.important = config.important ?? false
    }
  }

  // Merge themes
  let { replacedThemeKeys, keyframeSources } = mergeTheme(ctx)

  return {
    resolvedConfig: {
      ...ctx.result,
      content: ctx.content,
      theme: ctx.theme as ResolvedConfig['theme'],
      plugins: ctx.plugins,
    },
    replacedThemeKeys,
    keyframeSources,
  }
}

export function mergeThemeExtension(
  themeValue: ThemeValue | ThemeValue[],
  extensionValue: ThemeValue | ThemeValue[],
) {
  // When we have an array of objects, we do want to merge it
  if (Array.isArray(themeValue) && isPlainObject(themeValue[0])) {
    return themeValue.concat(extensionValue)
  }

  // When the incoming value is an array, and the existing config is an object,
  // prepend the existing object
  if (
    Array.isArray(extensionValue) &&
    isPlainObject(extensionValue[0]) &&
    isPlainObject(themeValue)
  ) {
    return [themeValue, ...extensionValue]
  }

  // Override arrays (for example for font-families, box-shadows, ...)
  if (Array.isArray(extensionValue)) {
    return extensionValue
  }

  // Execute default behavior
  return undefined
}

export type PluginUtils = {
  theme: (keypath: string, defaultValue?: any) => any
  colors: typeof colors
}

function extractConfigs(
  ctx: ResolutionContext,
  { config, base, path, reference, src }: ConfigFile,
): void {
  let plugins: PluginWithConfig[] = []

  // Normalize plugins so they share the same shape
  for (let plugin of config.plugins ?? []) {
    if ('__isOptionsFunction' in plugin) {
      // Happens with `plugin.withOptions()` when no options were passed:
      // e.g. `require("my-plugin")` instead of `require("my-plugin")(options)`
      plugins.push({ ...plugin(), reference, src })
    } else if ('handler' in plugin) {
      // Happens with `plugin(…)`:
      // e.g. `require("my-plugin")`
      //
      // or with `plugin.withOptions()` when the user passed options:
      // e.g. `require("my-plugin")(options)`
      plugins.push({ ...plugin, reference, src })
    } else {
      // Just a plain function without using the plugin(…) API
      plugins.push({ handler: plugin, reference, src })
    }
  }

  // Apply configs from presets
  if (Array.isArray(config.presets) && config.presets.length === 0) {
    throw new Error(
      'Error in the config file/plugin/preset. An empty preset (`preset: []`) is not currently supported.',
    )
  }

  for (let preset of config.presets ?? []) {
    extractConfigs(ctx, { path, base, config: preset, reference, src })
  }

  // Apply configs from plugins
  for (let plugin of plugins) {
    ctx.plugins.push(plugin)

    if (plugin.config) {
      extractConfigs(ctx, {
        path,
        base,
        config: plugin.config,
        reference: !!plugin.reference,
        src: plugin.src ?? src,
      })
    }
  }

  // Merge in content paths from multiple configs
  let content = config.content ?? []
  let files = Array.isArray(content) ? content : content.files

  for (let file of files) {
    ctx.content.files.push(typeof file === 'object' ? file : { base, pattern: file })
  }

  // Then apply the "user" config
  ctx.configs.push({ config, src })
}

function mergeTheme(ctx: ResolutionContext) {
  let replacedThemeKeys: Set<string> = new Set()
  let keyframeSources = new Map<string, SourceLocation | undefined>()
  let baseKeyframesSource: SourceLocation | undefined

  let themeFn = createThemeFn(ctx.design, () => ctx.theme, resolveValue)
  let theme = Object.assign(themeFn, {
    theme: themeFn,
    colors,
  })

  function resolveValue(value: ThemeValue | null | undefined): ResolvedThemeValue {
    if (typeof value === 'function') {
      return value(theme) ?? null
    }

    return value ?? null
  }

  function recordKeyframeSources(keyframes: ResolvedThemeValue, src: SourceLocation | undefined) {
    for (let name of Object.keys(keyframes ?? {})) {
      keyframeSources.set(name, src)
    }
  }

  for (let { config, src } of ctx.configs) {
    let theme = config.theme ?? {}
    let extend = theme.extend ?? {}

    // Keep track of all theme keys that were reset
    for (let key in theme) {
      if (key === 'extend') {
        continue
      }
      replacedThemeKeys.add(key)
    }

    // Shallow merge themes so latest "group" wins
    Object.assign(ctx.theme, theme)
    if (Object.hasOwn(theme, 'keyframes')) {
      baseKeyframesSource = src
    }

    // Collect extensions by key so each group can be lazily deep merged
    for (let key in extend) {
      ctx.extend[key] ??= []
      ctx.extend[key].push({ value: extend[key], src })
    }
  }

  // Remove the `extend` key from the theme It's only used for merging and
  // should not be present in the resolved theme
  delete ctx.theme.extend

  // Deep merge every `extend` key into the theme
  for (let key in ctx.extend) {
    let values = [
      { value: ctx.theme[key], src: key === 'keyframes' ? baseKeyframesSource : undefined },
      ...ctx.extend[key],
    ]

    ctx.theme[key] = () => {
      let v = values.map(({ value }) => resolveValue(value))
      if (key === 'keyframes') {
        // Attribute each rule to the last config that contributed to it.
        keyframeSources.clear()
        for (let i = 0; i < v.length; i++) {
          recordKeyframeSources(v[i], values[i].src)
        }
      }

      let result = deepMerge({}, v, mergeThemeExtension)
      return result
    }
  }

  for (let key in ctx.theme) {
    let value = resolveValue(ctx.theme[key])
    ctx.theme[key] = value
    if (key === 'keyframes' && !ctx.extend.keyframes) {
      recordKeyframeSources(value, baseKeyframesSource)
    }
  }

  // Turn {min: '123px'} into '123px' in screens
  if (ctx.theme.screens && typeof ctx.theme.screens === 'object') {
    for (let key of Object.keys(ctx.theme.screens)) {
      let screen = ctx.theme.screens[key]
      if (!screen) continue
      if (typeof screen !== 'object') continue

      if ('raw' in screen) continue
      if ('max' in screen) continue
      if (!('min' in screen)) continue

      ctx.theme.screens[key] = screen.min
    }
  }

  return { replacedThemeKeys, keyframeSources }
}
