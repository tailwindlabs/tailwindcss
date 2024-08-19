import type { DesignSystem } from '../../design-system'
import type { PluginWithConfig } from '../../plugin-api'
import { createThemeFn } from '../../theme-fn'
import { deepMerge, isPlainObject } from './deep-merge'
import {
  type ResolvedConfig,
  type ResolvedThemeValue,
  type ThemeValue,
  type UserConfig,
} from './types'

interface ResolutionContext {
  design: DesignSystem
  configs: UserConfig[]
  plugins: PluginWithConfig[]
  theme: Record<string, ThemeValue>
  extend: Record<string, ThemeValue[]>
  result: ResolvedConfig
}

let minimal: ResolvedConfig = {
  theme: {},
  plugins: [],
}

export function resolveConfig(design: DesignSystem, configs: UserConfig[]): ResolvedConfig {
  let ctx: ResolutionContext = {
    design,
    configs: [],
    plugins: [],
    theme: {},
    extend: {},

    // Start with a minimal valid, but empty config
    result: structuredClone(minimal),
  }

  for (let config of configs) {
    resolveInternal(ctx, config)
  }

  // Merge themes
  mergeTheme(ctx)

  return {
    theme: ctx.theme as ResolvedConfig['theme'],
    plugins: ctx.plugins,
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

  // Execute default behaviour
  return undefined
}

export interface PluginUtils {
  theme(keypath: string, defaultValue?: any): any
}

function resolveInternal(ctx: ResolutionContext, user: UserConfig): void {
  let plugins: PluginWithConfig[] = []

  // Normalize plugins so they share the same shape
  for (let plugin of user.plugins ?? []) {
    if ('__isOptionsFunction' in plugin) {
      // Happens with `plugin.withOptions()` when no options were passed:
      // e.g. `require("my-plugin")` instead of `require("my-plugin")(options)`
      plugins.push(plugin())
    } else if ('handler' in plugin) {
      // Happens with `plugin(…)`:
      // e.g. `require("my-plugin")`
      //
      // or with `plugin.withOptions()` when the user passed options:
      // e.g. `require("my-plugin")(options)`
      plugins.push(plugin)
    } else {
      // Just a plain function without using the plugin(…) API
      plugins.push({ handler: plugin })
    }
  }

  // Apply configs from plugins
  for (let plugin of plugins) {
    ctx.plugins.push(plugin)

    if (plugin.config) {
      resolveInternal(ctx, plugin.config)
    }
  }

  // Then apply the "user" config
  ctx.configs.push(user)
}

function mergeTheme(ctx: ResolutionContext) {
  let api: PluginUtils = {
    theme: createThemeFn(ctx.design, () => ctx.theme, resolveValue),
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

  // Remove the `extend` key from the theme It's only used for merging and
  // should not be present in the resolved theme
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
