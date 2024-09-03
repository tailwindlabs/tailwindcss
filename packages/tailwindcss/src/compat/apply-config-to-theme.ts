import type { DesignSystem } from '../design-system'
import { resolveConfig, type ConfigFile } from './config/resolve-config'
import type { ResolvedConfig } from './config/types'

export function applyConfigToTheme(designSystem: DesignSystem, configs: ConfigFile[]) {
  let theme = resolveConfig(designSystem, configs).theme

  for (let [path, value] of themeableValues(theme)) {
    let name = keyPathToCssProperty(path)

    designSystem.theme.add(`--${name}`, value as any, {
      isInline: true,
      isReference: false,
    })
  }

  // if theme has fontFamily.sans, set --default-font-family to that inline value

  if (Object.hasOwn(theme, 'fontFamily')) {
    if (Object.hasOwn(theme.fontFamily, 'sans')) {
      // TODO: Add an empty `@theme` to the AST

      designSystem.theme.add('--default-font-family', 'theme(fontFamily.sans)', {
        isInline: true,
        isReference: false,
      })

      designSystem.theme.add(
        '--default-font-feature-settings',
        'theme(fontFamily.sans[1].fontFeatureSettings)',
        {
          isInline: true,
          isReference: false,
        },
      )

      designSystem.theme.add(
        '--default-font-variation-settings',
        'theme(fontFamily.sans[1].fontVariationSettings)',
        {
          isInline: true,
          isReference: false,
        },
      )

      // if (Array.isArray(defaultFontFamily)) {
      //   if (typeof defaultFontFamily[1] === 'object') {
      //     defaultFontFeatureSettings = defaultFontFamily[1]?.fontFeatureSettings
      //     defaultFontVariationSettings = defaultFontFamily[1]?.fontVariationSettings
      //     defaultFontFamily = defaultFontFamily[0]
      //   } else {
      //     defaultFontFamily = defaultFontFamily.join(', ')
      //   }
      // }

      // designSystem.theme.add(`--default-font-family`, defaultFontFamily as string, {
      //   isInline: true,
      //   isReference: false,
      // })

      // if (defaultFontFeatureSettings) {
      //   designSystem.theme.add(
      //     `--default-font-feature-settings`,
      //     defaultFontFeatureSettings as string,
      //     {
      //       isInline: true,
      //       isReference: false,
      //     },
      //   )
      // }

      // if (defaultFontVariationSettings) {
      //   designSystem.theme.add(
      //     `--default-font-variation-settings`,
      //     defaultFontVariationSettings as string,
      //     {
      //       isInline: true,
      //       isReference: false,
      //     },
      //   )
      // }
    }

    // if (Object.hasOwn(theme.fontFamily, 'mono')) {
    //   // let defaultMonoFontFamily = theme.fontFamily.sans
    //   // let defaultMonoFontFeatureSettings = null
    //   // let defaultMonoFontVariationSettings = null

    //   // designSystem.theme.add('--default-font-family', 'theme(fontFamily.sans)', {
    //   //   isInline: true,
    //   //   isReference: false,
    //   // })

    //   if (Array.isArray(defaultMonoFontFamily)) {
    //     if (typeof defaultMonoFontFamily[1] === 'object') {
    //       defaultMonoFontFeatureSettings = defaultMonoFontFamily[1]?.fontFeatureSettings
    //       defaultMonoFontVariationSettings = defaultMonoFontFamily[1]?.fontVariationSettings
    //       defaultMonoFontFamily = defaultMonoFontFamily[0]
    //     } else {
    //       defaultMonoFontFamily = defaultMonoFontFamily.join(', ')
    //     }
    //   }

    //   designSystem.theme.add(`--default-font-family`, defaultMonoFontFamily as string, {
    //     isInline: true,
    //     isReference: false,
    //   })

    //   if (defaultMonoFontFeatureSettings) {
    //     designSystem.theme.add(
    //       `--default-font-feature-settings`,
    //       defaultMonoFontFeatureSettings as string,
    //       {
    //         isInline: true,
    //         isReference: false,
    //       },
    //     )
    //   }

    //   if (defaultMonoFontVariationSettings) {
    //     designSystem.theme.add(
    //       `--default-font-variation-settings`,
    //       defaultMonoFontVariationSettings as string,
    //       {
    //         isInline: true,
    //         isReference: false,
    //       },
    //     )
    //   }
    // }
  }

  return theme
}

function themeableValues(config: ResolvedConfig['theme']): [string[], unknown][] {
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
  })

  return toAdd
}

function keyPathToCssProperty(path: string[]) {
  if (path[0] === 'colors') {
    path[0] = 'color'
  }

  return (
    path
      // [1] should move into the nested object tuple. To create the CSS variable
      // name for this, we replace it with an empty string that will result in two
      // subsequent dashes when joined.
      .map((path) => (path === '1' ? '' : path))

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

enum WalkAction {
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
    if (result === WalkAction.Stop) break

    if (!Array.isArray(value) && typeof value !== 'object') continue

    walk(value as any, keyPath, callback)
  }
}
