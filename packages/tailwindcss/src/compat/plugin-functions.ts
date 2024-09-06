import type { DesignSystem } from '../design-system'
import { ThemeOptions, type Theme, type ThemeKey } from '../theme'
import { withAlpha } from '../utilities'
import { DefaultMap } from '../utils/default-map'
import { toKeyPath } from '../utils/to-key-path'
import { deepMerge } from './config/deep-merge'
import type { UserConfig } from './config/types'

export function createThemeFn(
  designSystem: DesignSystem,
  configTheme: () => UserConfig['theme'],
  resolveValue: (value: any) => any,
) {
  return function theme(path: string, defaultValue?: any) {
    // Extract an eventual modifier from the path. e.g.:
    // - "colors.red.500 / 50%" -> "50%"
    // - "foo/bar/baz/50%"      -> "50%"
    let lastSlash = path.lastIndexOf('/')
    let modifier: string | null = null
    if (lastSlash !== -1) {
      modifier = path.slice(lastSlash + 1).trim()
      path = path.slice(0, lastSlash).trim()
    }

    let resolvedValue = (() => {
      let keypath = toKeyPath(path)
      let [cssValue, options] = readFromCss(designSystem.theme, keypath)

      let configValue = resolveValue(get(configTheme() ?? {}, keypath) ?? null)

      // Resolved to a primitive value.
      if (typeof cssValue !== 'object') {
        if (typeof options !== 'object' && options & ThemeOptions.DEFAULT) {
          return configValue ?? cssValue
        }

        return cssValue
      }

      //
      if (configValue !== null && typeof configValue === 'object' && !Array.isArray(configValue)) {
        let configValueCopy: Record<string, unknown> & { __CSS_VALUES__?: Record<string, number> } =
          // We want to make sure that we don't mutate the original config
          // value. Ideally we use `structuredClone` here, but it's not possible
          // because it can contain functions.
          deepMerge({}, [configValue], (_, b) => b)

        // There is no `cssValue`, which means we can back-fill it with values
        // from the `configValue`.
        if (cssValue === null && Object.hasOwn(configValue, '__CSS_VALUES__')) {
          let localCssValue: Record<string, unknown> = {}
          for (let key in configValue.__CSS_VALUES__) {
            localCssValue[key] = configValue[key]
            delete configValueCopy[key]
          }
          cssValue = localCssValue
        }

        for (let key in cssValue) {
          if (key === '__CSS_VALUES__') continue

          // If the value is coming from a default source (`@theme default`),
          // then we keep the value from the js config (which is also a
          // default source, but wins from the built in defaults).
          if (
            configValue?.__CSS_VALUES__?.[key] & ThemeOptions.DEFAULT &&
            get(configValueCopy, key.split('-')) !== undefined
          ) {
            continue
          }

          // CSS values from `@theme` win over values from the config
          configValueCopy[key] = cssValue[key]
        }

        return configValueCopy
      }

      // Values from CSS take precedence over values from the config
      return cssValue ?? configValue
    })()

    // Apply the opacity modifier if present
    if (modifier && typeof resolvedValue === 'string') {
      resolvedValue = withAlpha(resolvedValue, modifier)
    }

    return resolvedValue ?? defaultValue
  }
}

function readFromCss(
  theme: Theme,
  path: string[],
):
  | [value: string | null | Record<string, unknown>, options: number]
  | [value: Record<string, unknown>, options: Record<string, number>] {
  // `--color-red-500` should resolve to the theme variable directly, no look up
  // and handling of nested objects is required.
  if (path.length === 1 && path[0].startsWith('--')) {
    return [theme.get([path[0] as ThemeKey]), theme.getOptions(path[0])] as const
  }

  type ThemeValue =
    // A normal string value
    | string

    // A nested tuple with additional data
    | [main: string, extra: Record<string, string>]

  let themeKey = path
    // [1] should move into the nested object tuple. To create the CSS variable
    // name for this, we replace it with an empty string that will result in two
    // subsequent dashes when joined.
    .map((path) => (path === '1' ? '' : path))

    // Resolve the key path to a CSS variable segment
    .map((part) =>
      part.replaceAll('.', '_').replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}-${b.toLowerCase()}`),
    )

    // Remove the `DEFAULT` key at the end of a path
    // We're reading from CSS anyway so it'll be a string
    .filter((part, index) => part !== 'DEFAULT' || index !== path.length - 1)
    .join('-')

  let map = new Map<string | null, ThemeValue>()
  let nested = new DefaultMap<string | null, Map<string, string>>(() => new Map())

  let ns = theme.namespace(`--${themeKey}` as any)
  if (ns.size === 0) {
    return [null, ThemeOptions.NONE]
  }

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

  for (let [key, extra] of nested) {
    let value = map.get(key)
    if (typeof value !== 'string') continue

    map.set(key, [value, Object.fromEntries(extra)])
  }

  // We have to turn the map into object-like structure for v3 compatibility
  let obj: Record<string, unknown> = {}
  let useNestedObjects = false // paths.some((path) => nestedKeys.has(path))
  let options = Object.fromEntries(
    Array.from(ns.entries()).map(([key]) => {
      let fullKey = key === null ? `--${themeKey}` : `--${themeKey}-${key}`
      return [key ?? 'DEFAULT', theme.getOptions(fullKey)]
    }),
  )

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

  // If the request looked like `theme('animation.DEFAULT')` it would have been
  // turned into a lookup for `--animation-*` so we should extract the value for
  // the `DEFAULT` key from the list of possible values. If there is no
  // `DEFAULT` in the list, there is no match so return `null`.
  if (path[path.length - 1] === 'DEFAULT') {
    return [(obj?.DEFAULT ?? null) as any, options.DEFAULT ?? 0] as const
  }

  // The request looked like `theme('animation.spin')` and was turned into a
  // lookup for `--animation-spin-*` which had only one entry which means it
  // should be returned directly.
  if ('DEFAULT' in obj && Object.keys(obj).length === 1) {
    return [obj.DEFAULT as string, options.DEFAULT ?? 0] as const
  }

  // Attach the CSS values to the object for later use. This object could be
  // mutated by the user so we want to keep the original CSS values around.
  obj.__CSS_VALUES__ = options

  return [obj, options] as const
}

function get(obj: any, path: string[]) {
  for (let i = 0; i < path.length; ++i) {
    let key = path[i]

    // The key does not exist so concatenate it with the next key
    if (obj[key] === undefined) {
      if (path[i + 1] === undefined) {
        return undefined
      }

      path[i + 1] = `${key}-${path[i + 1]}`
      continue
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
