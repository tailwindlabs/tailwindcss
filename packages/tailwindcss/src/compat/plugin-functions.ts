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

      if (typeof cssValue !== 'object') {
        if (options & ThemeOptions.DEFAULT) {
          return configValue ?? cssValue
        }

        return cssValue
      }

      if (configValue !== null && typeof configValue === 'object' && !Array.isArray(configValue)) {
        let configValueCopy = deepMerge({}, [configValue], (_, b) => {
          return b
        })

        for (let key in cssValue) {
          let configLeafValue = get(configValueCopy, key.split('-'))
          if (configLeafValue && options.get(key) & ThemeOptions.DEFAULT) {
            continue
          }

          configValueCopy[key] = cssValue[key]
        }

        console.dir({ configValueCopy }, { depth: null })

        return configValueCopy
        // console.dir({ abc }, { depth: null })
        return deepMerge({}, [configValue, cssValue], (a, b, path) => {
          // console.log({
          //   a,
          //   b,
          //   path,
          //   cssValue,
          //   options: cssValue === null ? options : options.get(path.join('-')),
          // })
          // let fullKey = path.join('-')
          // // console.log({ fullKey, options, configValue })
          // if (
          //   configValue[fullKey] &&
          //   options.get(fullKey.slice('--color-'.length) & ThemeOptions.DEFAULT)
          // ) {
          //   return configValue[fullKey]
          // }
          //
          // console.log({ a, b })
          // if (typeof a === 'string' && typeof b === 'string') {
          //   let key = path.join('-')
          //   console.log({ a, b, key })
          //   if (options.get(key.slice('--color-'.length)) & ThemeOptions.DEFAULT) {
          //     return a
          //   }
          // }
          return b
        })
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
): [value: string | null, options: number] | [value: object, options: Map<string, number>] {
  // `--color-red-500` should resolve to the theme variable directly, no look up
  // and handling of nested objects is required.
  if (path.length === 1 && path[0].startsWith('--')) {
    return [theme.get([path[0] as ThemeKey]), theme.getOptions(path[0])]
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

  // TODO: Bad Robin
  if (themeKey === 'colors') themeKey = 'color'

  let ns = theme.namespace(`--${themeKey}` as any)
  if (ns.size === 0) {
    console.log({ themeKey })
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
  let options = new Map(
    Array.from(ns.entries()).map(([key]) => {
      let fullKey = key === null ? `--${themeKey}` : `--${themeKey}-${key}`
      return [key, theme.getOptions(fullKey)]
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
    return [obj?.DEFAULT ?? null, options.get(null) ?? 0]
  }

  // The request looked like `theme('animation.spin')` and was turned into a
  // lookup for `--animation-spin-*` which had only one entry which means it
  // should be returned directly.
  if ('DEFAULT' in obj && Object.keys(obj).length === 1) {
    return [obj.DEFAULT, options.get(null) ?? 0]
  }

  return [obj, options]
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
