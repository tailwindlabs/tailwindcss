import { objectToAst, rule, type CssInJs } from './ast'
import type { Candidate } from './candidate'
import type { DesignSystem } from './design-system'
import { withAlpha, withNegative } from './utilities'
import { inferDataType } from './utils/infer-data-type'

export type PluginAPI = {
  addVariant(name: string, variant: string | string[] | CssInJs): void
  addUtilities(utilities: Record<string, CssInJs>, options?: {}): void
  matchUtilities(
    utilities: Record<string, (value: string, extra: { modifier: string | null }) => CssInJs>,
    options?: Partial<{
      type: string | string[]

      supportsNegativeValues: boolean

      values: Record<string, string>
      modifiers: 'any' | Record<string, string>
    }>,
  ): void
}

let NOOP = () => null

function resolve(
  item: Extract<Candidate, { kind: 'functional' }>['value' | 'modifier'],
  list: Record<string, any> | null,
  resolveBare: (value: string) => string | null = NOOP,
) {
  if (!item) {
    if (list && typeof list === 'object' && list.DEFAULT) {
      return list.DEFAULT
    }

    // Falsy values are invalid
    return null
  }

  // Arbitrary values and modifiers are also used as-is
  if (item.kind === 'arbitrary') return item.value

  // There's no list of valid, named values so this is invalid
  if (!list) return null

  // If the value isn't in the list then resolve it as a bare value (if possible)
  if (!(item.value in list)) {
    return resolveBare(item.value)
  }

  // Otherwise we'll return the value supplied by `list`
  // - `options.values`
  // - `options.modifiers`
  return list[item.value]
}

const IS_VALID_UTILITY_NAME = /^[a-z][a-zA-Z0-9/%._-]*$/

export function buildPluginApi(designSystem: DesignSystem): PluginAPI {
  let theme = designSystem.theme

  return {
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
        if (name[0] !== '.' || !IS_VALID_UTILITY_NAME.test(name.slice(1))) {
          throw new Error(
            `\`addUtilities({ '${name}' : … })\` defines an invalid utility selector. Utilities must be a single class name and start with a lowercase letter, eg. \`.scrollbar-none\`.`,
          )
        }

        designSystem.utilities.static(name.slice(1), (candidate) => {
          if (candidate.negative) return

          return objectToAst(css)
        })
      }
    },

    matchUtilities(utilities, options) {
      let types = options?.type
        ? Array.isArray(options?.type)
          ? options.type
          : [options.type]
        : []

      for (let [name, fn] of Object.entries(utilities)) {
        if (!IS_VALID_UTILITY_NAME.test(name)) {
          throw new Error(
            `\`matchUtilities({ '${name}' : … })\` defines an invalid utility name. Utilities should be alphanumeric and start with a lowercase letter.`,
          )
        }

        designSystem.utilities.functional(name, (candidate) => {
          // Any negative candiate without support is invalid
          if (!options?.supportsNegativeValues && candidate.negative) return

          // If this utility supports color values — try resolving as a color
          let modifiers = options?.modifiers ?? null

          if (types.includes('color')) {
            // Colors implicitly support modifiers when no modifiers are provided
            // They're read from the opacity scale'
            if (!modifiers) {
              modifiers = Object.fromEntries(theme.namespace('--opacity').entries())
            }
          }

          if (candidate.modifier && !modifiers) return

          let modifier = resolve(
            candidate.modifier,
            modifiers === 'any' ? {} : modifiers,
            (value) => {
              if (modifiers === 'any') return value
              if (!types.includes('color')) return null
              if (Number.isNaN(Number(value))) return null

              return `${value}%`
            },
          )

          if (candidate.modifier && !modifier) return

          let value = resolve(candidate.value, {
            inherit: 'inherit',
            transparent: 'transparent',
            current: 'currentColor',
            ...(options?.values ?? null),
          })

          if (!value) return

          if (types.includes('color') && modifier) {
            value = withAlpha(value, modifier)
          }

          // Throw out any candidate whose value isn't not of a support type
          if (candidate.value?.kind === 'arbitrary' && types.length > 0 && !types.includes('any')) {
            // Bail when the candidate has an explicit data type but it's not in
            // the list of supported types by this utility For example, given a
            // `scrollbar` utility that is used to change its color:
            // scrollbar-[length:var(--whatever)]
            if (candidate.value.dataType && !types.includes(candidate.value.dataType)) {
              return
            }

            // We also need to bail when the candidate does not have an explicit
            // type and we're not able to infer it as one of the supported types.
            if (
              !candidate.value.dataType &&
              !inferDataType(candidate.value.value, types as any[])
            ) {
              return
            }
          }

          if (candidate.negative) {
            value = withNegative(value, candidate)
          }

          return objectToAst(fn(value, { modifier }))
        })
      }
    },
  }
}
