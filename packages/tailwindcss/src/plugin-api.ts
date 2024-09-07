import { substituteAtApply } from './apply'
import { decl, rule, type AstNode } from './ast'
import type { Candidate, NamedUtilityValue } from './candidate'
import { applyConfigToTheme } from './compat/apply-config-to-theme'
import { createCompatConfig } from './compat/config/create-compat-config'
import { resolveConfig } from './compat/config/resolve-config'
import type { ResolvedConfig, UserConfig } from './compat/config/types'
import { darkModePlugin } from './compat/dark-mode'
import { createThemeFn } from './compat/plugin-functions'
import { substituteFunctions } from './css-functions'
import type { DesignSystem } from './design-system'
import type { Theme, ThemeKey } from './theme'
import { withAlpha, withNegative } from './utilities'
import { inferDataType } from './utils/infer-data-type'
import { segment } from './utils/segment'
import { toKeyPath } from './utils/to-key-path'

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

  addUtilities(
    utilities: Record<string, CssInJs | CssInJs[]> | Record<string, CssInJs | CssInJs[]>[],
    options?: {},
  ): void
  matchUtilities(
    utilities: Record<
      string,
      (value: string, extra: { modifier: string | null }) => CssInJs | CssInJs[]
    >,
    options?: Partial<{
      type: string | string[]
      supportsNegativeValues: boolean
      values: Record<string, string> & {
        __BARE_VALUE__?: (value: NamedUtilityValue) => string | undefined
      }
      modifiers: 'any' | Record<string, string>
    }>,
  ): void

  addComponents(utilities: Record<string, CssInJs> | Record<string, CssInJs>[], options?: {}): void
  matchComponents(
    utilities: Record<string, (value: string, extra: { modifier: string | null }) => CssInJs>,
    options?: Partial<{
      type: string | string[]
      supportsNegativeValues: boolean
      values: Record<string, string> & {
        __BARE_VALUE__?: (value: NamedUtilityValue) => string | undefined
      }
      modifiers: 'any' | Record<string, string>
    }>,
  ): void

  theme(path: string, defaultValue?: any): any
  config(path: string, defaultValue?: any): any
  prefix(className: string): string
}

const IS_VALID_UTILITY_NAME = /^[a-z][a-zA-Z0-9/%._-]*$/

function buildPluginApi(
  designSystem: DesignSystem,
  ast: AstNode[],
  resolvedConfig: ResolvedConfig,
): PluginAPI {
  let api: PluginAPI = {
    addBase(css) {
      let baseNodes = objectToAst(css)
      substituteFunctions(baseNodes, api.theme)
      ast.push(rule('@layer base', baseNodes))
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
      utilities = Array.isArray(utilities) ? utilities : [utilities]

      let entries = utilities.flatMap((u) => Object.entries(u))

      // Split multi-selector utilities into individual utilities
      entries = entries.flatMap(([name, css]) =>
        segment(name, ',').map((selector) => [selector.trim(), css] as [string, CssInJs]),
      )

      // Merge entries for the same class
      let utils: Record<string, CssInJs[]> = {}

      for (let [name, css] of entries) {
        let [className, ...parts] = segment(name, ':')

        // Modify classes using pseudo-classes or pseudo-elements to use nested rules
        if (parts.length > 0) {
          let pseudos = parts.map((p) => `:${p.trim()}`).join('')
          css = {
            [`&${pseudos}`]: css,
          }
        }

        utils[className] ??= []
        css = Array.isArray(css) ? css : [css]
        utils[className].push(...css)
      }

      for (let [name, css] of Object.entries(utils)) {
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

        function compileFn(candidate: Extract<Candidate, { kind: 'functional' }>) {
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
        }

        designSystem.utilities.functional(name, compileFn, {
          types,
        })
      }
    },

    addComponents(components, options) {
      this.addUtilities(components)
    },

    matchComponents(components, options) {
      this.matchUtilities(components)
    },

    theme: createThemeFn(
      designSystem,
      () => resolvedConfig.theme ?? {},
      (value) => value,
    ),

    prefix(className) {
      return className
    },

    config(path, defaultValue) {
      let obj: Record<any, any> = resolvedConfig

      let keypath = toKeyPath(path)

      for (let i = 0; i < keypath.length; ++i) {
        let key = keypath[i]

        if (obj[key] === undefined) return defaultValue

        obj = obj[key]
      }

      return obj ?? defaultValue
    },
  }

  // Bind these functions so they can use `this`
  api.addComponents = api.addComponents.bind(api)
  api.matchComponents = api.matchComponents.bind(api)

  return api
}

export type CssInJs = { [key: string]: string | string[] | CssInJs | CssInJs[] }

function objectToAst(rules: CssInJs | CssInJs[]): AstNode[] {
  let ast: AstNode[] = []

  rules = Array.isArray(rules) ? rules : [rules]

  let entries = rules.flatMap((rule) => Object.entries(rule))

  for (let [name, value] of entries) {
    if (typeof value !== 'object') {
      if (!name.startsWith('--') && value === '@slot') {
        ast.push(rule(name, [rule('@slot', [])]))
      } else {
        // Convert camelCase to kebab-case:
        // https://github.com/postcss/postcss-js/blob/b3db658b932b42f6ac14ca0b1d50f50c4569805b/parser.js#L30-L35
        name = name.replace(/([A-Z])/g, '-$1').toLowerCase()

        ast.push(decl(name, String(value)))
      }
    } else if (Array.isArray(value)) {
      for (let item of value) {
        if (typeof item === 'string') {
          ast.push(decl(name, item))
        } else {
          ast.push(rule(name, objectToAst(item)))
        }
      }
    } else if (value !== null) {
      ast.push(rule(name, objectToAst(value)))
    }
  }

  return ast
}

type Primitive = string | number | boolean | null
export type CssPluginOptions = Record<string, Primitive | Primitive[]>

export async function applyCompatibilityHooks(
  designSystem: DesignSystem,
  ast: AstNode[],
  pluginPaths: [string, CssPluginOptions | null][],
  loadPlugin: (path: string) => Promise<Plugin>,
  configPaths: string[],
  loadConfig: (path: string) => Promise<UserConfig>,
  globs: { origin?: string; pattern: string }[],
) {
  // Override `resolveThemeValue` with a version that is backwards compatible
  // with dot notation paths like `colors.red.500`. We could do this by default
  // in `resolveThemeValue` but handling it here keeps all backwards
  // compatibility concerns localized to our compatability layer.
  let resolveThemeVariableValue = designSystem.resolveThemeValue

  designSystem.resolveThemeValue = function resolveThemeValue(path: string) {
    if (path.startsWith('--')) {
      return resolveThemeVariableValue(path)
    }

    // Extract an eventual modifier from the path. e.g.:
    // - "--color-red-500 / 50%" -> "50%"
    let lastSlash = path.lastIndexOf('/')
    let modifier: string | null = null
    if (lastSlash !== -1) {
      modifier = path.slice(lastSlash + 1).trim()
      path = path.slice(0, lastSlash).trim() as ThemeKey
    }

    let themeValue = lookupThemeValue(designSystem.theme, path)

    // Apply the opacity modifier if present
    if (modifier && typeof themeValue === 'string') {
      return withAlpha(themeValue, modifier)
    }

    return themeValue
  }

  // If there are no plugins or configs registered, we don't need to register
  // any additional backwards compatibility hooks.
  if (!pluginPaths.length && !configPaths.length) return

  let configs = await Promise.all(
    configPaths.map(async (configPath) => ({
      path: configPath,
      config: await loadConfig(configPath),
    })),
  )
  let pluginDetails = await Promise.all(
    pluginPaths.map(async ([pluginPath, pluginOptions]) => ({
      path: pluginPath,
      plugin: await loadPlugin(pluginPath),
      options: pluginOptions,
    })),
  )

  let plugins = pluginDetails.map((detail) => {
    if (!detail.options) {
      return detail.plugin
    }

    if ('__isOptionsFunction' in detail.plugin) {
      return detail.plugin(detail.options)
    }

    throw new Error(`The plugin "${detail.path}" does not accept options`)
  })

  let userConfig = [{ config: { plugins } }, ...configs]

  let resolvedConfig = resolveConfig(designSystem, [
    { config: createCompatConfig(designSystem.theme) },
    ...userConfig,
    { config: { plugins: [darkModePlugin] } },
  ])

  let pluginApi = buildPluginApi(designSystem, ast, resolvedConfig)

  for (let { handler } of resolvedConfig.plugins) {
    handler(pluginApi)
  }

  // Merge the user-configured theme keys into the design system. The compat
  // config would otherwise expand into namespaces like `background-color` which
  // core utilities already read from.
  applyConfigToTheme(designSystem, userConfig)

  // Replace `resolveThemeValue` with a version that is backwards compatible
  // with dot-notation but also aware of any JS theme configurations registered
  // by plugins or JS config files. This is significantly slower than just
  // upgrading dot-notation keys so we only use this version if plugins or
  // config files are actually being used. In the future we may want to optimize
  // this further by only doing this if plugins or config files _actually_
  // registered JS config objects.
  designSystem.resolveThemeValue = function resolveThemeValue(path: string, defaultValue?: string) {
    let resolvedValue = pluginApi.theme(path, defaultValue)

    if (Array.isArray(resolvedValue) && resolvedValue.length === 2) {
      // When a tuple is returned, return the first element
      return resolvedValue[0]
    } else if (Array.isArray(resolvedValue)) {
      // Arrays get serialized into a comma-separated lists
      return resolvedValue.join(', ')
    } else if (typeof resolvedValue === 'string') {
      // Otherwise only allow string values here, objects (and namespace maps)
      // are treated as non-resolved values for the CSS `theme()` function.
      return resolvedValue
    }
  }

  for (let file of resolvedConfig.content.files) {
    if ('raw' in file) {
      throw new Error(
        `Error in the config file/plugin/preset. The \`content\` key contains a \`raw\` entry:\n\n${JSON.stringify(file, null, 2)}\n\nThis feature is not currently supported.`,
      )
    }

    globs.push({ origin: file.base, pattern: file.pattern })
  }
}

function toThemeKey(keypath: string[]) {
  return (
    keypath
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
      .filter((part, index) => part !== 'DEFAULT' || index !== keypath.length - 1)
      .join('-')
  )
}

function lookupThemeValue(theme: Theme, path: string) {
  let baseThemeKey = '--' + toThemeKey(toKeyPath(path))

  let resolvedValue = theme.get([baseThemeKey as ThemeKey])

  if (resolvedValue !== null) {
    return resolvedValue
  }

  for (let [givenKey, upgradeKey] of Object.entries(themeUpgradeKeys)) {
    if (!baseThemeKey.startsWith(givenKey)) continue

    let upgradedKey = upgradeKey + baseThemeKey.slice(givenKey.length)
    let resolvedValue = theme.get([upgradedKey as ThemeKey])

    if (resolvedValue !== null) {
      return resolvedValue
    }
  }
}

let themeUpgradeKeys = {
  '--colors': '--color',
  '--accent-color': '--color',
  '--backdrop-blur': '--blur',
  '--backdrop-brightness': '--brightness',
  '--backdrop-contrast': '--contrast',
  '--backdrop-grayscale': '--grayscale',
  '--backdrop-hue-rotate': '--hueRotate',
  '--backdrop-invert': '--invert',
  '--backdrop-opacity': '--opacity',
  '--backdrop-saturate': '--saturate',
  '--backdrop-sepia': '--sepia',
  '--background-color': '--color',
  '--background-opacity': '--opacity',
  '--border-color': '--color',
  '--border-opacity': '--opacity',
  '--border-spacing': '--spacing',
  '--box-shadow-color': '--color',
  '--caret-color': '--color',
  '--divide-color': '--borderColor',
  '--divide-opacity': '--borderOpacity',
  '--divide-width': '--borderWidth',
  '--fill': '--color',
  '--flex-basis': '--spacing',
  '--gap': '--spacing',
  '--gradient-color-stops': '--color',
  '--height': '--spacing',
  '--inset': '--spacing',
  '--margin': '--spacing',
  '--max-height': '--spacing',
  '--max-width': '--spacing',
  '--min-height': '--spacing',
  '--min-width': '--spacing',
  '--outline-color': '--color',
  '--padding': '--spacing',
  '--placeholder-color': '--color',
  '--placeholder-opacity': '--opacity',
  '--ring-color': '--color',
  '--ring-offset-color': '--color',
  '--ring-opacity': '--opacity',
  '--scroll-margin': '--spacing',
  '--scroll-padding': '--spacing',
  '--space': '--spacing',
  '--stroke': '--color',
  '--text-color': '--color',
  '--text-decoration-color': '--color',
  '--text-indent': '--spacing',
  '--text-opacity': '--opacity',
  '--translate': '--spacing',
  '--size': '--spacing',
  '--width': '--spacing',
}
