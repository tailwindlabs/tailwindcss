import { segment } from '../../utils/segment'
import { deepMerge, isPlainObject } from './deep-merge'
import {
  type LoadedPlugin,
  type LoadedPreset,
  type RawPlugin,
  type ResolvedConfig,
  type ResolvedContentConfig,
  type ResolvedThemeValue,
  type ThemeValue,
  type UserConfig,
} from './types'

interface ResolutionContext {
  configs: UserConfig[]
  plugins: RawPlugin[]
  content: ResolvedContentConfig
  theme: Record<string, ThemeValue>
  extend: Record<string, ThemeValue[]>
  result: ResolvedConfig
}

let minimal: ResolvedConfig = {
  important: false,
  content: {
    files: [],
    transform: {},
  },
  blocklist: [],
  prefix: '',
  separator: ':',
  darkMode: 'media',
  theme: {},
  plugins: [],
}

export function resolveConfig(configs: UserConfig[]): ResolvedConfig {
  let ctx: ResolutionContext = {
    configs: [],
    plugins: [],
    content: {
      files: [],
      transform: {},
    },
    theme: {},
    extend: {},

    // Start with a minimal valid, but empty config
    result: structuredClone(minimal),
  }

  // Gather a list of mergable configs
  // Gather a final list of plugins
  for (let config of configs) {
    resolveInternal(config, ctx)
  }

  // Merge top-level keys
  mergeTopLevel(ctx)

  // Merge content
  mergeContent(ctx)

  // Merge themes
  mergeTheme(ctx)

  return {
    ...ctx.result,
    theme: ctx.theme as ResolvedConfig['theme'],
    content: ctx.content,
    plugins: ctx.plugins,
  }
}

function mergeTopLevel(ctx: ResolutionContext) {
  for (let config of ctx.configs) {
    Object.assign(ctx.result, config)
  }
}

function mergeContent(ctx: ResolutionContext) {
  let resolved = ctx.content

  for (let config of ctx.configs) {
    let content = config.content ?? []
    let files = Array.isArray(content) ? content : content.files
    let transform = Array.isArray(content) ? {} : content.transform

    resolved.files.push(...files)
    Object.assign(resolved.transform, transform)
  }
}

function mergeThemeExtension(
  themeValue: ThemeValue | ThemeValue[],
  extensionValue: ThemeValue | ThemeValue[],
) {
  // When we have an array of objects, we do want to merge it
  if (Array.isArray(themeValue) && isPlainObject(themeValue[0])) {
    return themeValue.concat(extensionValue)
  }

  // When the incoming value is an array, and the existing config is an object, prepend the existing object
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

  // Execute default behaviour
  return undefined
}

export interface PluginUtils {
  theme(keypath: string, defaultValue?: any): any
}

function createThemeFn(ctx: ResolutionContext, resolveValue: (value: any) => any) {
  return function theme(path: string): any {
    let parts = segment(path, '.')
    let value: any = ctx.theme

    for (let key of parts) {
      // The value isn't an object which means we can't traverse it
      if (typeof value !== 'object' || value === null) {
        return null
      }

      // The path contains a key that doesn't exist
      if (!(key in value)) {
        return null
      }

      value = value[key]
    }

    return resolveValue(value)
  }
}

function mergeTheme(ctx: ResolutionContext) {
  let api: PluginUtils = {
    theme: createThemeFn(ctx, resolveValue),
  }

  function resolveValue(value: ThemeValue | null | undefined): ResolvedThemeValue {
    if (typeof value === 'function') {
      return value(api) ?? null
    }

    return value ?? null
  }

  for (let config of ctx.configs) {
    let theme = config.theme ?? {}
    let extend = theme.extend ?? {}

    // Shallow merge themes so latest "group" wins
    Object.assign(ctx.theme, theme)

    // Collect extensions by key so each
    // group can be lazily deep merged
    for (let key in extend) {
      ctx.extend[key] ??= []
      ctx.extend[key].push(extend[key])
    }
  }

  // Remove the `extend` key from the theme
  // It's only used for merging and should
  // not be present in the resolved theme
  delete ctx.theme.extend

  // Deep merge every `extend` key into the theme
  for (let key in ctx.extend) {
    let values = [ctx.theme[key], ...ctx.extend[key]]

    ctx.theme[key] = () => {
      let v = values.map(resolveValue)

      let result = deepMerge({}, v, mergeThemeExtension)
      return result
    }
  }

  for (let key in ctx.theme) {
    ctx.theme[key] = resolveValue(ctx.theme[key])
  }
}

function resolveInternal(user: UserConfig, ctx: ResolutionContext): void {
  let presets = (user.presets ?? []) as LoadedPreset[]
  let plugins = (user.plugins ?? []) as LoadedPlugin[]

  // Presets are applied first
  // They may define presets, plugins, and configs
  for (let preset of presets) {
    resolveInternal(preset, ctx)
  }

  // Plugins are applied next
  // They may define presets, plugins, and configs
  for (let plugin of plugins) {
    if (typeof plugin === 'function') {
      ctx.plugins.push(plugin)
    } else {
      ctx.plugins.push(plugin.handler)

      if (plugin.config) {
        resolveInternal(plugin.config(), ctx)
      }
    }
  }

  // The "user" config is then applied
  // This config may actually represent:
  // - a preset config
  // - a plugin config
  // - a user config
  ctx.configs.push(user)
}
