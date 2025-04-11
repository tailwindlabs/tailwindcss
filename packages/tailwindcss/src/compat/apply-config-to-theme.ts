import type { DesignSystem } from '../design-system'
import { ThemeOptions } from '../theme'
import type { ResolvedConfig } from './config/types'

function resolveThemeValue(value: unknown, subValue: string | null = null): string | null {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[1] === 'object' &&
    typeof value[1] !== null
  ) {
    return subValue ? (value[1][subValue] ?? null) : value[0]
  } else if (Array.isArray(value) && subValue === null) {
    return value.join(', ')
  } else if (typeof value === 'string' && subValue === null) {
    return value
  }

  return null
}

export function applyConfigToTheme(
  designSystem: DesignSystem,
  { theme }: ResolvedConfig,
  replacedThemeKeys: Set<string>,
) {
  for (let replacedThemeKey of replacedThemeKeys) {
    let name = keyPathToCssProperty([replacedThemeKey])
    if (!name) continue

    designSystem.theme.clearNamespace(`--${name}`, ThemeOptions.DEFAULT)
  }

  for (let [path, value] of themeableValues(theme)) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      continue
    }

    // Replace `<alpha-value>` with `1`
    if (typeof value === 'string') {
      value = value.replace(/<alpha-value>/g, '1')
    }

    // Convert `opacity` namespace from decimal to percentage values
    if (path[0] === 'opacity' && (typeof value === 'number' || typeof value === 'string')) {
      let numValue = typeof value === 'string' ? parseFloat(value) : value

      if (numValue >= 0 && numValue <= 1) {
        value = numValue * 100 + '%'
      }
    }

    let name = keyPathToCssProperty(path)
    if (!name) continue

    designSystem.theme.add(
      `--${name}`,
      '' + value,
      ThemeOptions.INLINE | ThemeOptions.REFERENCE | ThemeOptions.DEFAULT,
    )
  }

  // If someone has updated `fontFamily.sans` or `fontFamily.mono` in a JS
  // config, we need to make sure variables like `--default-font-family` and
  // `--default-font-feature-settings` are updated to match those explicit
  // values, because variables like `--font-family-sans` and
  // `--font-family-sans--feature-settings` (which the `--default-font-*`
  // variables reference) won't exist in the generated CSS.
  if (Object.hasOwn(theme, 'fontFamily')) {
    let options = ThemeOptions.INLINE | ThemeOptions.DEFAULT

    // Replace `--default-font-*` with `fontFamily.sans` values
    {
      let fontFamily = resolveThemeValue(theme.fontFamily.sans)
      if (fontFamily && designSystem.theme.hasDefault('--font-sans')) {
        designSystem.theme.add('--default-font-family', fontFamily, options)
        designSystem.theme.add(
          '--default-font-feature-settings',
          resolveThemeValue(theme.fontFamily.sans, 'fontFeatureSettings') ?? 'normal',
          options,
        )
        designSystem.theme.add(
          '--default-font-variation-settings',
          resolveThemeValue(theme.fontFamily.sans, 'fontVariationSettings') ?? 'normal',
          options,
        )
      }
    }

    // Replace `--default-mono-font-*` with `fontFamily.mono` values
    {
      let fontFamily = resolveThemeValue(theme.fontFamily.mono)
      if (fontFamily && designSystem.theme.hasDefault('--font-mono')) {
        designSystem.theme.add('--default-mono-font-family', fontFamily, options)
        designSystem.theme.add(
          '--default-mono-font-feature-settings',
          resolveThemeValue(theme.fontFamily.mono, 'fontFeatureSettings') ?? 'normal',
          options,
        )
        designSystem.theme.add(
          '--default-mono-font-variation-settings',
          resolveThemeValue(theme.fontFamily.mono, 'fontVariationSettings') ?? 'normal',
          options,
        )
      }
    }
  }

  return theme
}

export function themeableValues(config: ResolvedConfig['theme']): [string[], unknown][] {
  let toAdd: [string[], unknown][] = []

  walk(config as any, [], (value, path) => {
    if (isValidThemePrimitive(value)) {
      toAdd.push([path, value])

      return WalkAction.Skip
    }

    if (isValidThemeTuple(value)) {
      toAdd.push([path, value[0]])

      for (let key of Reflect.ownKeys(value[1]) as string[]) {
        toAdd.push([[...path, `-${key}`], value[1][key]])
      }

      return WalkAction.Skip
    }

    if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
      if (path[0] === 'fontSize') {
        toAdd.push([path, value[0]])

        if (value.length >= 2) {
          toAdd.push([[...path, '-line-height'], value[1]])
        }
      } else {
        toAdd.push([path, value.join(', ')])
      }

      return WalkAction.Skip
    }
  })

  return toAdd
}

const IS_VALID_KEY = /^[a-zA-Z0-9-_%/\.]+$/

export function keyPathToCssProperty(path: string[]) {
  // The legacy container component config should not be included in the Theme
  if (path[0] === 'container') return null

  path = structuredClone(path)

  if (path[0] === 'animation') path[0] = 'animate'
  if (path[0] === 'aspectRatio') path[0] = 'aspect'
  if (path[0] === 'borderRadius') path[0] = 'radius'
  if (path[0] === 'boxShadow') path[0] = 'shadow'
  if (path[0] === 'colors') path[0] = 'color'
  if (path[0] === 'containers') path[0] = 'container'
  if (path[0] === 'fontFamily') path[0] = 'font'
  if (path[0] === 'fontSize') path[0] = 'text'
  if (path[0] === 'letterSpacing') path[0] = 'tracking'
  if (path[0] === 'lineHeight') path[0] = 'leading'
  if (path[0] === 'maxWidth') path[0] = 'container'
  if (path[0] === 'screens') path[0] = 'breakpoint'
  if (path[0] === 'transitionTimingFunction') path[0] = 'ease'

  for (let part of path) {
    if (!IS_VALID_KEY.test(part)) return null
  }

  return (
    path
      // [1] should move into the nested object tuple. To create the CSS variable
      // name for this, we replace it with an empty string that will result in two
      // subsequent dashes when joined.
      //
      // E.g.:
      // - `fontSize.xs.1.lineHeight` -> `font-size-xs--line-height`
      // - `spacing.1` -> `--spacing-1`
      .map((path, idx, all) => (path === '1' && idx !== all.length - 1 ? '' : path))

      // Resolve the key path to a CSS variable segment
      .map((part) =>
        part
          .replaceAll('.', '_')
          .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}-${b.toLowerCase()}`),
      )

      // Remove the `DEFAULT` key at the end of a path
      // We're reading from CSS anyway so it'll be a string
      .filter((part, index) => part !== 'DEFAULT' || index !== path.length - 1)
      .join('-')
  )
}

function isValidThemePrimitive(value: unknown) {
  return typeof value === 'number' || typeof value === 'string'
}

function isValidThemeTuple(value: unknown): value is [string, Record<string, string | number>] {
  // Check for tuple values of the form
  // `[string, Record<string, string | number>]`
  if (!Array.isArray(value)) return false
  if (value.length !== 2) return false

  // A string or number as the "value"
  if (typeof value[0] !== 'string' && typeof value[0] !== 'number') return false

  // An object as the nested theme values
  if (value[1] === undefined || value[1] === null) return false
  if (typeof value[1] !== 'object') return false

  for (let key of Reflect.ownKeys(value[1])) {
    if (typeof key !== 'string') return false
    if (typeof value[1][key] !== 'string' && typeof value[1][key] !== 'number') return false
  }

  return true
}

const enum WalkAction {
  /** Continue walking, which is the default */
  Continue,

  /** Skip visiting the children of this node */
  Skip,

  /** Stop the walk entirely */
  Stop,
}

function walk(
  obj: Record<string, unknown>,
  path: string[] = [],
  callback: (value: unknown, path: string[]) => WalkAction | void,
) {
  for (let key of Reflect.ownKeys(obj) as string[]) {
    let value = obj[key]

    if (value === undefined || value === null) {
      continue
    }

    let keyPath = [...path, key]

    let result = callback(value, keyPath) ?? WalkAction.Continue

    if (result === WalkAction.Skip) continue
    if (result === WalkAction.Stop) return WalkAction.Stop

    if (!Array.isArray(value) && typeof value !== 'object') continue

    if (walk(value as any, keyPath, callback) === WalkAction.Stop) {
      return WalkAction.Stop
    }
  }
}
