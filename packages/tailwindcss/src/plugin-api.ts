import { substituteAtApply } from './apply'
import { objectToAst, rule, type AstNode, type CssInJs } from './ast'
import type { DesignSystem } from './design-system'
import { withAlpha, withNegative } from './utilities'
import { inferDataType } from './utils/infer-data-type'
import { segment } from './utils/segment'

export type Config = Record<string, any>

export type PluginFn = (api: PluginAPI) => void
export type PluginWithConfig = { handler: PluginFn; config?: Partial<Config> }
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
      values: Record<string, string> & {
        [BARE_VALUE]?: (value: string) => string | null | undefined
      }
      modifiers: 'any' | Record<string, string>
    }>,
  ): void
  theme(path: string): any
}

const IS_VALID_UTILITY_NAME = /^[a-z][a-zA-Z0-9/%._-]*$/

export function buildPluginApi(
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

          {
            let values = options?.values ?? {}

            if (isColor) {
              // Color utilities implicitly support `inherit`, `transparent`, and `currentColor`
              // for backwards compatibility but still allow them to be overridden
              values = {
                inherit: 'inherit',
                transparent: 'transparent',
                current: 'currentColor',
                ...values,
              }
            }

            if (!candidate.value) {
              value = values.DEFAULT ?? null
            } else if (candidate.value.kind === 'arbitrary') {
              value = candidate.value.value
            } else if (values[candidate.value.value]) {
              value = values[candidate.value.value]
            } else if (values[BARE_VALUE]) {
              value = values[BARE_VALUE](candidate.value.value) ?? null
            }
          }

          if (!value) return

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
          if (candidate.modifier && !modifier) {
            // For arbitrary values, return `null` to avoid falling through to the next utility
            return candidate.value?.kind === 'arbitrary' ? null : undefined
          }

          if (isColor && modifier) {
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
      if (path === 'colors') {
        let result: Record<string, string> = resolvedConfig.theme?.colors ?? {}

        for (let [key] of designSystem.theme.namespace('--color')) {
          result[key ?? 'DEFAULT'] = designSystem.theme.resolve(key, ['--color'])!
        }

        return result
      }

      let parts = segment(path, '.')
      let result = resolvedConfig.theme ?? {}

      for (let part of parts) {
        result = result?.[part]
      }

      return result
    },
  }
}

const BARE_VALUE = Symbol('BARE_VALUE')

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
      pluginObjects.push({ handler: plugin, config: {} as Config })
    }
  }

  // Now merge all the configs and make all that crap work
  let resolvedConfig: Config = { theme: {} }

  for (let { config } of pluginObjects) {
    for (let key in config?.theme?.extend) {
      resolvedConfig.theme[key] ??= {}
      let value = config.theme.extend[key]
      if (value instanceof Function) {
        value = value({
          theme(path: string) {
            if (path === 'transitionDuration') {
              return {
                [BARE_VALUE]: (value: string) => {
                  if (!Number.isNaN(Number(value))) {
                    return `${value}ms`
                  }
                },
              }
            }
          },
        })
      }
      Object.assign(resolvedConfig.theme[key], value)
    }
  }

  let pluginApi = buildPluginApi(designSystem, ast, resolvedConfig)

  // Loop over the handlers and run them all with the resolved config + CSS theme probably somehow
  for (let { handler } of pluginObjects) {
    handler(pluginApi)
  }
}
