import { substituteAtApply } from './apply'
import { objectToAst, rule, type AstNode, type CssInJs } from './ast'
import type { NamedUtilityValue } from './candidate'
import { deepMerge } from './compat/config/deep-merge'
import { resolveConfig } from './compat/config/resolve-config'
import type { UserConfig } from './compat/config/types'
import type { DesignSystem } from './design-system'
import type { Theme } from './theme'
import { withAlpha, withNegative } from './utilities'
import { DefaultMap } from './utils/default-map'
import { inferDataType } from './utils/infer-data-type'
import { segment } from './utils/segment'

export type Config = UserConfig
export type PluginFn = (api: PluginAPI) => void
export type PluginWithConfig = { handler: PluginFn; config?: UserConfig }
export type PluginWithOptions<T> = {
  (options?: T): PluginWithConfig
  __isOptionsFunction: true
}

export type Plugin = PluginFn | PluginWithConfig | PluginWithOptions<any>

export type PluginAPI = {
  addBase(base: CssInJs): void
  addVariant(name: string, variant: string | string[] | CssInJs): void
  addUtilities(utilities: Record<string, CssInJs>, options?: {}): void
  matchUtilities(
    utilities: Record<string, (value: string, extra: { modifier: string | null }) => CssInJs>,
    options?: Partial<{
      type: string | string[]
      supportsNegativeValues: boolean
      values: { __BARE_VALUE__?: (value: NamedUtilityValue) => string | undefined } & Record<
        string,
        string
      >
      modifiers: 'any' | Record<string, string>
    }>,
  ): void
  theme(path: string): any
}

const IS_VALID_UTILITY_NAME = /^[a-z][a-zA-Z0-9/%._-]*$/

function buildPluginApi(
  designSystem: DesignSystem,
  ast: AstNode[],
  resolvedConfig: { theme?: Record<string, any> },
): PluginAPI {
  return {
    addBase(css) {
      ast.push(rule('@layer base', objectToAst(css)))
    },

    addVariant(name, variant) {
      // Single selector
      if (typeof variant === 'string') {
        designSystem.variants.static(name, (r) => {
          r.nodes = [rule(variant, r.nodes)]
        })
      }

      // Multiple parallel selectors
      else if (Array.isArray(variant)) {
        designSystem.variants.static(name, (r) => {
          r.nodes = variant.map((selector) => rule(selector, r.nodes))
        })
      }

      // CSS-in-JS object
      else if (typeof variant === 'object') {
        designSystem.variants.fromAst(name, objectToAst(variant))
      }
    },

    addUtilities(utilities) {
      for (let [name, css] of Object.entries(utilities)) {
        if (name.startsWith('@keyframes ')) {
          ast.push(rule(name, objectToAst(css)))
          continue
        }

        if (name[0] !== '.' || !IS_VALID_UTILITY_NAME.test(name.slice(1))) {
          throw new Error(
            `\`addUtilities({ '${name}' : … })\` defines an invalid utility selector. Utilities must be a single class name and start with a lowercase letter, eg. \`.scrollbar-none\`.`,
          )
        }

        designSystem.utilities.static(name.slice(1), (candidate) => {
          if (candidate.negative) return

          let ast = objectToAst(css)
          substituteAtApply(ast, designSystem)
          return ast
        })
      }
    },

    matchUtilities(utilities, options) {
      let types = options?.type
        ? Array.isArray(options?.type)
          ? options.type
          : [options.type]
        : ['any']

      for (let [name, fn] of Object.entries(utilities)) {
        if (!IS_VALID_UTILITY_NAME.test(name)) {
          throw new Error(
            `\`matchUtilities({ '${name}' : … })\` defines an invalid utility name. Utilities should be alphanumeric and start with a lowercase letter, eg. \`scrollbar\`.`,
          )
        }

        designSystem.utilities.functional(name, (candidate) => {
          // A negative utility was provided but is unsupported
          if (!options?.supportsNegativeValues && candidate.negative) return

          // Throw out any candidate whose value is not a supported type
          if (candidate.value?.kind === 'arbitrary' && types.length > 0 && !types.includes('any')) {
            // The candidate has an explicit data type but it's not in the list
            // of supported types by this utility. For example, a `scrollbar`
            // utility that is only used to change the scrollbar color but is
            // used with a `length` value: `scrollbar-[length:var(--whatever)]`
            if (candidate.value.dataType && !types.includes(candidate.value.dataType)) {
              return
            }

            // The candidate does not have an explicit data type and the value
            // cannot be inferred as one of the supported types. For example, a
            // `scrollbar` utility that is only used to change the scrollbar
            // color but is used with a `length` value: `scrollbar-[33px]`
            if (
              !candidate.value.dataType &&
              !inferDataType(candidate.value.value, types as any[])
            ) {
              return
            }
          }

          let isColor = types.includes('color')

          // Resolve the candidate value
          let value: string | null = null
          let isFraction = false

          {
            let values = options?.values ?? {}

            if (isColor) {
              // Color utilities implicitly support `inherit`, `transparent`, and `currentColor`
              // for backwards compatibility but still allow them to be overridden
              values = Object.assign(
                {
                  inherit: 'inherit',
                  transparent: 'transparent',
                  current: 'currentColor',
                },
                values,
              )
            }

            if (!candidate.value) {
              value = values.DEFAULT ?? null
            } else if (candidate.value.kind === 'arbitrary') {
              value = candidate.value.value
            } else if (values[candidate.value.value]) {
              value = values[candidate.value.value]
            } else if (values.__BARE_VALUE__) {
              value = values.__BARE_VALUE__(candidate.value) ?? null

              isFraction = (candidate.value.fraction !== null && value?.includes('/')) ?? false
            }
          }

          if (value === null) return

          // Resolve the modifier value
          let modifier: string | null

          {
            let modifiers = options?.modifiers ?? null

            if (!candidate.modifier) {
              modifier = null
            } else if (modifiers === 'any' || candidate.modifier.kind === 'arbitrary') {
              modifier = candidate.modifier.value
            } else if (modifiers?.[candidate.modifier.value]) {
              modifier = modifiers[candidate.modifier.value]
            } else if (isColor && !Number.isNaN(Number(candidate.modifier.value))) {
              modifier = `${candidate.modifier.value}%`
            } else {
              modifier = null
            }
          }

          // A modifier was provided but is invalid
          if (candidate.modifier && modifier === null && !isFraction) {
            // For arbitrary values, return `null` to avoid falling through to the next utility
            return candidate.value?.kind === 'arbitrary' ? null : undefined
          }

          if (isColor && modifier !== null) {
            value = withAlpha(value, modifier)
          }

          if (candidate.negative) {
            value = withNegative(value, candidate)
          }

          let ast = objectToAst(fn(value, { modifier }))
          substituteAtApply(ast, designSystem)
          return ast
        })
      }
    },
    theme(path) {
      let cssValue = readFromCss(designSystem.theme, path)

      if (typeof cssValue !== 'object') {
        return cssValue
      }

      let result = resolvedConfig.theme ?? {}

      // 1. Convert `path` to an array of parts (segment)
      // 2. Find the "obeject" that corresponds to the path
      // 3. Deep merge the object with the resolved theme
      let parts = segment(path, '.')

      let obj = get(result, parts) ?? {}

      if (typeof obj === 'object') {
        deepMerge(obj, [cssValue], (a, b) => b)
        set(result, parts, obj)
      } else {
        // This case happens when the CSS theme produces an object for a given
        // keypath but the v3-style config does not. However we still want the
        // CSS to "win" in this case so we overwrite the v3-style config value.
        set(result, parts, cssValue)
      }

      for (let part of parts) {
        result = result?.[part]
      }

      return result
    },
  }
}

export function registerPlugins(plugins: Plugin[], designSystem: DesignSystem, ast: AstNode[]) {
  let pluginObjects = []

  for (let plugin of plugins) {
    if ('__isOptionsFunction' in plugin) {
      // Happens with `plugin.withOptions()` when no options were passed:
      // e.g. `require("my-plugin")` instead of `require("my-plugin")(options)`
      pluginObjects.push(plugin())
    } else if ('handler' in plugin) {
      // Happens with `plugin(…)`:
      // e.g. `require("my-plugin")`
      //
      // or with `plugin.withOptions()` when the user passed options:
      // e.g. `require("my-plugin")(options)`
      pluginObjects.push(plugin)
    } else {
      // Just a plain function without using the plugin(…) API
      pluginObjects.push({ handler: plugin, config: {} as UserConfig })
    }
  }

  // Now merge all the configs and make all that crap work
  let resolvedConfig = resolveConfig([
    createCompatabilityConfig(designSystem.theme),
    ...pluginObjects.map(({ config }) => config ?? {}),
  ])

  let pluginApi = buildPluginApi(designSystem, ast, resolvedConfig)

  // Loop over the handlers and run them all with the resolved config + CSS theme probably somehow
  for (let { handler } of pluginObjects) {
    handler(pluginApi)
  }
}

function readFromCss(theme: Theme, path: string) {
  type ThemeValue =
    // A normal string value
    | string

    // A nested tuple with additional data
    | [main: string, extra: Record<string, string>]
  // This only supports reading from the CSS Theme:…
  let original = path
    // Escape dots used inside square brackets
    .replace(/\[(.*?)\]/g, (_, value) => `-${value.replace('.', '_')}`)
    // Replace dots with dashes
    .replace(/\./g, '-')
    // Replace camelCase with dashes
    .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}-${b.toLowerCase()}`)

  // Perform an "upgrade" on the path so that, for example, a request for
  // accentColor merges values from --color-* and --accent-color-*
  let paths: string[] = []

  for (let prefix in themeUpgradeMap) {
    if (!original.startsWith(prefix)) continue

    // This makes sure that:
    // `accent-color` is turned into `color`; AND
    // `accent-color-foo` is turned into `color-foo`
    let suffix = original.slice(prefix.length)

    for (let upgrade of themeUpgradeMap[prefix]) {
      paths.push(upgrade + suffix)
    }
  }

  // Make sure the original path is included last because it should take precedence
  paths.push(original)

  let map = new Map<string | null, ThemeValue>()
  let nested = new DefaultMap<string | null, Map<string, string>>(() => new Map())

  for (let path of paths) {
    path = path.replace('-DEFAULT', '')

    let ns = theme.resolveNamespace(`--${path}` as any)

    for (let [key, value] of ns) {
      // Non-nested values can be set directly
      if (!key || !key.includes('--')) {
        map.set(key, value)
        continue
      }

      // Nested values are stored separately
      let nestedIndex = key.indexOf('--')

      let mainKey = key.slice(0, nestedIndex)
      let nestedKey = key.slice(nestedIndex + 2)

      // Make `nestedKey` camel case:
      nestedKey = nestedKey.replace(/-([a-z])/g, (_, a) => a.toUpperCase())

      nested.get(mainKey === '' ? null : mainKey).set(nestedKey, value)
    }
  }

  for (let [key, extra] of nested) {
    let value = map.get(key)
    if (typeof value !== 'string') continue

    map.set(key, [value, Object.fromEntries(extra)])
  }

  // We have to turn the map into object-like structure for v3 compatibility
  let obj = {}
  let useNestedObjects = false // paths.some((path) => nestedKeys.has(path))

  for (let [key, value] of map) {
    key = key ?? 'DEFAULT'

    let path: string[] = []
    let splitIndex = key.indexOf('-')

    if (useNestedObjects && splitIndex !== -1) {
      path.push(key.slice(0, splitIndex))
      path.push(key.slice(splitIndex + 1))
    } else {
      path.push(key)
    }

    set(obj, path, value)
  }

  if (path.endsWith('.DEFAULT') && 'DEFAULT' in obj) {
    return obj.DEFAULT ?? null
  }

  if (Object.keys(obj).length === 1 && 'DEFAULT' in obj) {
    return obj.DEFAULT
  }

  return obj
}

function get(obj: any, path: string[]) {
  for (let key of path) {
    if (obj[key] === undefined) {
      return undefined
    }

    obj = obj[key]
  }

  return obj
}

function set(obj: any, path: string[], value: any) {
  for (let key of path.slice(0, -1)) {
    if (obj[key] === undefined) {
      obj[key] = {}
    }

    obj = obj[key]
  }

  obj[path[path.length - 1]] = value
}

let themeUpgradeMap: Record<string, string[]> = {
  colors: ['color'],
}

function bareValues(fn: (value: NamedUtilityValue) => string | undefined) {
  return {
    // Ideally this would be a Symbol but some of the ecosystem assumes object with
    // string / number keys for example by using `Object.entries()` which means that
    // the function that handles the bare value would be lost
    __BARE_VALUE__: fn,
  }
}

let bareIntegers = bareValues((value) => {
  if (!Number.isNaN(Number(value.value))) {
    return value.value
  }
})

let barePercentages = bareValues((value: NamedUtilityValue) => {
  if (!Number.isNaN(Number(value.value))) {
    return `${value.value}%`
  }
})

let barePixels = bareValues((value: NamedUtilityValue) => {
  if (!Number.isNaN(Number(value.value))) {
    return `${value.value}px`
  }
})

let bareMilliseconds = bareValues((value: NamedUtilityValue) => {
  if (!Number.isNaN(Number(value.value))) {
    return `${value.value}ms`
  }
})

let bareDegrees = bareValues((value: NamedUtilityValue) => {
  if (!Number.isNaN(Number(value.value))) {
    return `${value.value}deg`
  }
})

function createCompatabilityConfig(theme: Theme): UserConfig {
  return {
    theme: {
      accentColor: ({ theme }) => theme('colors'),
      aspectRatio: bareValues((value) => {
        if (value.fraction === null) return
        let [lhs, rhs] = segment(value.fraction, '/')
        if (!Number.isInteger(Number(lhs)) || !Number.isInteger(Number(rhs))) return
        return value.fraction
      }),
      backdropBlur: ({ theme }) => theme('blur'),
      backdropBrightness: ({ theme }) => ({
        ...theme('brightness'),
        ...barePercentages,
      }),
      backdropContrast: ({ theme }) => ({
        ...theme('contrast'),
        ...barePercentages,
      }),
      backdropGrayscale: ({ theme }) => ({
        ...theme('grayscale'),
        ...barePercentages,
      }),
      backdropHueRotate: ({ theme }) => ({
        ...theme('hueRotate'),
        ...bareDegrees,
      }),
      backdropInvert: ({ theme }) => ({
        ...theme('invert'),
        ...barePercentages,
      }),
      backdropOpacity: ({ theme }) => ({
        ...theme('opacity'),
        ...barePercentages,
      }),
      backdropSaturate: ({ theme }) => ({
        ...theme('saturate'),
        ...barePercentages,
      }),
      backdropSepia: ({ theme }) => ({
        ...theme('sepia'),
        ...barePercentages,
      }),
      backgroundColor: ({ theme }) => theme('colors'),
      backgroundOpacity: ({ theme }) => theme('opacity'),
      border: barePixels,
      borderColor: ({ theme }) => theme('colors'),
      borderOpacity: ({ theme }) => theme('opacity'),
      borderSpacing: ({ theme }) => theme('spacing'),
      boxShadowColor: ({ theme }) => theme('colors'),
      brightness: barePercentages,
      caretColor: ({ theme }) => theme('colors'),
      columns: bareIntegers,
      contrast: barePercentages,
      divideColor: ({ theme }) => theme('borderColor'),
      divideOpacity: ({ theme }) => theme('borderOpacity'),
      divideWidth: ({ theme }) => ({
        ...theme('borderWidth'),
        ...barePixels,
      }),
      fill: ({ theme }) => theme('colors'),
      flexBasis: ({ theme }) => theme('spacing'),
      flexGrow: bareIntegers,
      flexShrink: bareIntegers,
      gap: ({ theme }) => theme('spacing'),
      gradientColorStopPositions: barePercentages,
      gradientColorStops: ({ theme }) => theme('colors'),
      grayscale: barePercentages,
      gridRowEnd: bareIntegers,
      gridRowStart: bareIntegers,
      gridTemplateColumns: bareValues((value) => {
        if (!Number.isNaN(Number(value.value))) {
          return `repeat(${value.value}, minmax(0, 1fr))`
        }
      }),
      gridTemplateRows: bareValues((value) => {
        if (!Number.isNaN(Number(value.value))) {
          return `repeat(${value.value}, minmax(0, 1fr))`
        }
      }),
      height: ({ theme }) => theme('spacing'),
      hueRotate: bareDegrees,
      inset: ({ theme }) => theme('spacing'),
      invert: barePercentages,
      lineClamp: bareIntegers,
      margin: ({ theme }) => theme('spacing'),
      maxHeight: ({ theme }) => theme('spacing'),
      maxWidth: ({ theme }) => theme('spacing'),
      minHeight: ({ theme }) => theme('spacing'),
      minWidth: ({ theme }) => theme('spacing'),
      opacity: barePercentages,
      order: bareIntegers,
      outlineColor: ({ theme }) => theme('colors'),
      outlineOffset: barePixels,
      outlineWidth: barePixels,
      padding: ({ theme }) => theme('spacing'),
      placeholderColor: ({ theme }) => theme('colors'),
      placeholderOpacity: ({ theme }) => theme('opacity'),
      ringColor: ({ theme }) => theme('colors'),
      ringOffsetColor: ({ theme }) => theme('colors'),
      ringOffsetWidth: barePixels,
      ringOpacity: ({ theme }) => theme('opacity'),
      ringWidth: barePixels,
      rotate: bareDegrees,
      saturate: barePercentages,
      scale: barePercentages,
      scrollMargin: ({ theme }) => theme('spacing'),
      scrollPadding: ({ theme }) => theme('spacing'),
      sepia: barePercentages,
      size: ({ theme }) => theme('spacing'),
      skew: bareDegrees,
      space: ({ theme }) => theme('spacing'),
      stroke: ({ theme }) => theme('colors'),
      strokeWidth: barePixels,
      textColor: ({ theme }) => theme('colors'),
      textDecorationColor: ({ theme }) => theme('colors'),
      textDecorationThickness: barePixels,
      textIndent: ({ theme }) => theme('spacing'),
      textOpacity: ({ theme }) => theme('opacity'),
      textUnderlineOffset: barePixels,
      transitionDelay: bareMilliseconds,
      transitionDuration: {
        DEFAULT: theme.get(['--default-transition-duration']) ?? null,
        ...bareMilliseconds,
      },
      transitionTimingFunction: {
        DEFAULT: theme.get(['--default-transition-timing-function']) ?? null,
      },
      translate: ({ theme }) => theme('spacing'),
      width: ({ theme }) => theme('spacing'),
      zIndex: bareIntegers,
    },
  }
}
