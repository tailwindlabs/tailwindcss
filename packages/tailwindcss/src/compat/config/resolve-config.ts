import { segment } from '../../utils/segment'
import { deepMerge, isPlainObject } from './deep-merge'
import {
  type ResolvedConfig,
  type ResolvedThemeValue,
  type ThemeValue,
  type UserConfig,
} from './types'

interface ResolutionContext {
  configs: UserConfig[]
  theme: Record<string, ThemeValue>
  extend: Record<string, ThemeValue[]>
  result: ResolvedConfig
}

let minimal: ResolvedConfig = {
  theme: {},
}

export function resolveConfig(configs: UserConfig[]): ResolvedConfig {
  let ctx: ResolutionContext = {
    configs,
    theme: {},
    extend: {},

    // Start with a minimal valid, but empty config
    result: structuredClone(minimal),
  }

  // Merge themes
  mergeTheme(ctx)

  return {
    theme: ctx.theme as ResolvedConfig['theme'],
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
      if (!Object.hasOwn(value, key)) {
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
