import { deepMerge } from './compat/config/deep-merge'
import type { UserConfig } from './compat/config/types'
import type { DesignSystem } from './design-system'
import type { Theme } from './theme'
import { DefaultMap } from './utils/default-map'
import { toKeyPath } from './utils/to-key-path'

export function createThemeFn(
  designSystem: DesignSystem,
  configTheme: () => UserConfig['theme'],
  resolveValue: (value: any) => any,
) {
  return function theme(path: string, defaultValue?: any) {
    let keypath = toKeyPath(path)
    let cssValue = readFromCss(designSystem.theme, keypath)

    if (typeof cssValue !== 'object') {
      return cssValue
    }

    let configValue = resolveValue(get(configTheme() ?? {}, keypath) ?? null)

    if (configValue !== null && typeof configValue === 'object') {
      return deepMerge({}, [configValue, cssValue], (_, b) => b)
    }

    // Values from CSS take precedence over values from the config
    return cssValue ?? configValue ?? defaultValue
  }
}

function readFromCss(theme: Theme, path: string[]) {
  type ThemeValue =
    // A normal string value
    | string

    // A nested tuple with additional data
    | [main: string, extra: Record<string, string>]

  let themeKey = path
    // Escape dots used inside square brackets
    // Replace camelCase with dashes
    .map((part) =>
      part.replaceAll('.', '_').replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}-${b.toLowerCase()}`),
    )

    // Remove the `DEFAULT` key at the end of a path
    // We're reading from CSS anyway so it'll be a string
    .filter((part, index) => part !== 'DEFAULT' || index !== path.length - 1)
    .join('-')

  let map = new Map<string | null, ThemeValue>()
  let nested = new DefaultMap<string | null, Map<string, string>>(() => new Map())

  let ns = theme.resolveNamespace(`--${themeKey}` as any)

  if (ns.size === 0) {
    return null
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

  if ('DEFAULT' in obj) {
    // The request looked like `theme('animation.DEFAULT')` and was turned into
    // a lookup for `--animation-*` and we should extract the value for the
    // `DEFAULT` key from the list of possible values
    if (path[path.length - 1] === 'DEFAULT') {
      return obj.DEFAULT
    }

    // The request looked like `theme('animation.spin')` and was turned into a
    // lookup for `--animation-spin-*` which had only one entry which means it
    // should be returned directly
    if (Object.keys(obj).length === 1) {
      return obj.DEFAULT
    }
  }

  return obj
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
