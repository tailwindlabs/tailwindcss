import type { Features } from '..'
import { substituteAtApply } from '../apply'
import { atRule, decl, rule, walk, type AstNode } from '../ast'
import type { Candidate, CandidateModifier, NamedUtilityValue } from '../candidate'
import { substituteFunctions } from '../css-functions'
import * as CSS from '../css-parser'
import type { DesignSystem } from '../design-system'
import { withAlpha } from '../utilities'
import { DefaultMap } from '../utils/default-map'
import { escape } from '../utils/escape'
import { inferDataType } from '../utils/infer-data-type'
import { segment } from '../utils/segment'
import { toKeyPath } from '../utils/to-key-path'
import { compoundsForSelectors, IS_VALID_VARIANT_NAME, substituteAtSlot } from '../variants'
import type { ResolvedConfig, UserConfig } from './config/types'
import { createThemeFn } from './plugin-functions'
import * as SelectorParser from './selector-parser'

export type Config = UserConfig
export type PluginFn = (api: PluginAPI) => void
export type PluginWithConfig = {
  handler: PluginFn
  config?: UserConfig

  /** @internal */
  reference?: boolean
}
export type PluginWithOptions<T> = {
  (options?: T): PluginWithConfig
  __isOptionsFunction: true
}

export type Plugin = PluginFn | PluginWithConfig | PluginWithOptions<any>

export type PluginAPI = {
  addBase(base: CssInJs): void

  addVariant(name: string, variant: string | string[] | CssInJs): void
  matchVariant<T = string>(
    name: string,
    cb: (value: T | string, extra: { modifier: string | null }) => string | string[],
    options?: {
      values?: Record<string, T>
      sort?(
        a: { value: T | string; modifier: string | null },
        b: { value: T | string; modifier: string | null },
      ): number
    },
  ): void

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
  config(path?: string, defaultValue?: any): any
  prefix(className: string): string
}

const IS_VALID_UTILITY_NAME = /^[a-z@][a-zA-Z0-9/%._-]*$/

export function buildPluginApi({
  designSystem,
  ast,
  resolvedConfig,
  featuresRef,
  referenceMode,
}: {
  designSystem: DesignSystem
  ast: AstNode[]
  resolvedConfig: ResolvedConfig
  featuresRef: { current: Features }
  referenceMode: boolean
}): PluginAPI {
  let api: PluginAPI = {
    addBase(css) {
      if (referenceMode) return
      let baseNodes = objectToAst(css)
      featuresRef.current |= substituteFunctions(baseNodes, designSystem)
      ast.push(atRule('@layer', 'base', baseNodes))
    },

    addVariant(name, variant) {
      if (!IS_VALID_VARIANT_NAME.test(name)) {
        throw new Error(
          `\`addVariant('${name}')\` defines an invalid variant name. Variants should only contain alphanumeric, dashes or underscore characters.`,
        )
      }

      // Single selector or multiple parallel selectors
      if (typeof variant === 'string' || Array.isArray(variant)) {
        designSystem.variants.static(
          name,
          (r) => {
            r.nodes = parseVariantValue(variant, r.nodes)
          },
          {
            compounds: compoundsForSelectors(typeof variant === 'string' ? [variant] : variant),
          },
        )
      }

      // CSS-in-JS object
      else if (typeof variant === 'object') {
        designSystem.variants.fromAst(name, objectToAst(variant))
      }
    },
    matchVariant(name, fn, options) {
      function resolveVariantValue<T extends Parameters<typeof fn>[0]>(
        value: T,
        modifier: CandidateModifier | null,
        nodes: AstNode[],
      ): AstNode[] {
        let resolved = fn(value, { modifier: modifier?.value ?? null })
        return parseVariantValue(resolved, nodes)
      }

      let defaultOptionKeys = Object.keys(options?.values ?? {})
      designSystem.variants.group(
        () => {
          designSystem.variants.functional(name, (ruleNodes, variant) => {
            if (!variant.value) {
              if (options?.values && 'DEFAULT' in options.values) {
                ruleNodes.nodes = resolveVariantValue(
                  options.values.DEFAULT,
                  variant.modifier,
                  ruleNodes.nodes,
                )
                return
              }
              return null
            }

            if (variant.value.kind === 'arbitrary') {
              ruleNodes.nodes = resolveVariantValue(
                variant.value.value,
                variant.modifier,
                ruleNodes.nodes,
              )
            } else if (variant.value.kind === 'named' && options?.values) {
              let defaultValue = options.values[variant.value.value]
              if (typeof defaultValue !== 'string') {
                return
              }

              ruleNodes.nodes = resolveVariantValue(defaultValue, variant.modifier, ruleNodes.nodes)
            }
          })
        },
        (a, z) => {
          // Since we only define a functional variant in the group, the `kind`
          // has to be `functional`.
          if (a.kind !== 'functional' || z.kind !== 'functional') {
            return 0
          }

          let aValueKey = a.value ? a.value.value : 'DEFAULT'
          let zValueKey = z.value ? z.value.value : 'DEFAULT'

          let aValue = options?.values?.[aValueKey] ?? aValueKey
          let zValue = options?.values?.[zValueKey] ?? zValueKey

          if (options && typeof options.sort === 'function') {
            return options.sort(
              { value: aValue, modifier: a.modifier?.value ?? null },
              { value: zValue, modifier: z.modifier?.value ?? null },
            )
          }

          let aOrder = defaultOptionKeys.indexOf(aValueKey)
          let zOrder = defaultOptionKeys.indexOf(zValueKey)

          // Sort arbitrary values after configured values
          aOrder = aOrder === -1 ? defaultOptionKeys.length : aOrder
          zOrder = zOrder === -1 ? defaultOptionKeys.length : zOrder

          if (aOrder !== zOrder) return aOrder - zOrder

          // SAFETY: The values don't need to be checked for equality as they
          // are guaranteed to be unique since we sort a list of de-duped
          // variants and different (valid) variants cannot produce the same AST.
          return aValue < zValue ? -1 : 1
        },
      )
    },

    addUtilities(utilities) {
      utilities = Array.isArray(utilities) ? utilities : [utilities]

      let entries = utilities.flatMap((u) => Object.entries(u))

      // Split multi-selector utilities into individual utilities
      entries = entries.flatMap(([name, css]) =>
        segment(name, ',').map((selector) => [selector.trim(), css] as [string, CssInJs]),
      )

      // Merge entries for the same class
      let utils = new DefaultMap<string, AstNode[]>(() => [])

      for (let [name, css] of entries) {
        if (name.startsWith('@keyframes ')) {
          if (!referenceMode) {
            ast.push(rule(name, objectToAst(css)))
          }
          continue
        }

        let selectorAst = SelectorParser.parse(name)
        let foundValidUtility = false

        SelectorParser.walk(selectorAst, (node) => {
          if (
            node.kind === 'selector' &&
            node.value[0] === '.' &&
            IS_VALID_UTILITY_NAME.test(node.value.slice(1))
          ) {
            let value = node.value
            node.value = '&'
            let selector = SelectorParser.toCss(selectorAst)

            let className = value.slice(1)
            let contents = selector === '&' ? objectToAst(css) : [rule(selector, objectToAst(css))]
            utils.get(className).push(...contents)
            foundValidUtility = true

            node.value = value
            return
          }

          if (node.kind === 'function' && node.value === ':not') {
            return SelectorParser.SelectorWalkAction.Skip
          }
        })

        if (!foundValidUtility) {
          throw new Error(
            `\`addUtilities({ '${name}' : … })\` defines an invalid utility selector. Utilities must be a single class name and start with a lowercase letter, eg. \`.scrollbar-none\`.`,
          )
        }
      }

      for (let [className, ast] of utils) {
        // Prefix all class selector with the configured theme prefix
        if (designSystem.theme.prefix) {
          walk(ast, (node) => {
            if (node.kind === 'rule') {
              let selectorAst = SelectorParser.parse(node.selector)
              SelectorParser.walk(selectorAst, (node) => {
                if (node.kind === 'selector' && node.value[0] === '.') {
                  node.value = `.${designSystem.theme.prefix}\\:${node.value.slice(1)}`
                }
              })
              node.selector = SelectorParser.toCss(selectorAst)
            }
          })
        }

        designSystem.utilities.static(className, (candidate) => {
          let clonedAst = structuredClone(ast)
          replaceNestedClassNameReferences(clonedAst, className, candidate.raw)
          featuresRef.current |= substituteAtApply(clonedAst, designSystem)
          return clonedAst
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

        function compileFn({ negative }: { negative: boolean }) {
          return (candidate: Extract<Candidate, { kind: 'functional' }>) => {
            // Throw out any candidate whose value is not a supported type
            if (
              candidate.value?.kind === 'arbitrary' &&
              types.length > 0 &&
              !types.includes('any')
            ) {
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
            let ignoreModifier = false

            {
              let values = options?.values ?? {}

              if (isColor) {
                // Color utilities implicitly support `inherit`, `transparent`, and `currentcolor`
                // for backwards compatibility but still allow them to be overridden
                values = Object.assign(
                  {
                    inherit: 'inherit',
                    transparent: 'transparent',
                    current: 'currentcolor',
                  },
                  values,
                )
              }

              if (!candidate.value) {
                value = values.DEFAULT ?? null
              } else if (candidate.value.kind === 'arbitrary') {
                value = candidate.value.value
              } else if (candidate.value.fraction && values[candidate.value.fraction]) {
                value = values[candidate.value.fraction]
                ignoreModifier = true
              } else if (values[candidate.value.value]) {
                value = values[candidate.value.value]
              } else if (values.__BARE_VALUE__) {
                value = values.__BARE_VALUE__(candidate.value) ?? null
                ignoreModifier =
                  (candidate.value.fraction !== null && value?.includes('/')) ?? false
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
            if (candidate.modifier && modifier === null && !ignoreModifier) {
              // For arbitrary values, return `null` to avoid falling through to the next utility
              return candidate.value?.kind === 'arbitrary' ? null : undefined
            }

            if (isColor && modifier !== null) {
              value = withAlpha(value, modifier)
            }

            if (negative) {
              value = `calc(${value} * -1)`
            }

            let ast = objectToAst(fn(value, { modifier }))
            replaceNestedClassNameReferences(ast, name, candidate.raw)
            featuresRef.current |= substituteAtApply(ast, designSystem)
            return ast
          }
        }

        if (options?.supportsNegativeValues) {
          designSystem.utilities.functional(`-${name}`, compileFn({ negative: true }), { types })
        }
        designSystem.utilities.functional(name, compileFn({ negative: false }), { types })

        designSystem.utilities.suggest(name, () => {
          let values = options?.values ?? {}
          let valueKeys = new Set<string | null>(Object.keys(values))

          // The `__BARE_VALUE__` key is a special key used to ensure bare values
          // work even with legacy configs and plugins
          valueKeys.delete('__BARE_VALUE__')

          // The `DEFAULT` key is represented as `null` in the utility API
          if (valueKeys.has('DEFAULT')) {
            valueKeys.delete('DEFAULT')
            valueKeys.add(null)
          }

          let modifiers = options?.modifiers ?? {}
          let modifierKeys = modifiers === 'any' ? [] : Object.keys(modifiers)

          return [
            {
              supportsNegative: options?.supportsNegativeValues ?? false,
              values: Array.from(valueKeys),
              modifiers: modifierKeys,
            },
          ]
        })
      }
    },

    addComponents(components, options) {
      this.addUtilities(components, options)
    },

    matchComponents(components, options) {
      this.matchUtilities(components, options)
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

      if (!path) return obj

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

export function objectToAst(rules: CssInJs | CssInJs[]): AstNode[] {
  let ast: AstNode[] = []

  rules = Array.isArray(rules) ? rules : [rules]

  let entries = rules.flatMap((rule) => Object.entries(rule))

  for (let [name, value] of entries) {
    if (typeof value !== 'object') {
      if (!name.startsWith('--')) {
        if (value === '@slot') {
          ast.push(rule(name, [atRule('@slot')]))
          continue
        }

        // Convert camelCase to kebab-case:
        // https://github.com/postcss/postcss-js/blob/b3db658b932b42f6ac14ca0b1d50f50c4569805b/parser.js#L30-L35
        name = name.replace(/([A-Z])/g, '-$1').toLowerCase()
      }

      ast.push(decl(name, String(value)))
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

function parseVariantValue(resolved: string | string[], nodes: AstNode[]): AstNode[] {
  let resolvedArray = typeof resolved === 'string' ? [resolved] : resolved
  return resolvedArray.flatMap((r) => {
    if (r.trim().endsWith('}')) {
      let updatedCSS = r.replace('}', '{@slot}}')
      let ast = CSS.parse(updatedCSS)
      substituteAtSlot(ast, nodes)
      return ast
    } else {
      return rule(r, nodes)
    }
  })
}

type Primitive = string | number | boolean | null
export type CssPluginOptions = Record<string, Primitive | Primitive[]>

function replaceNestedClassNameReferences(
  ast: AstNode[],
  utilityName: string,
  rawCandidate: string,
) {
  // Replace nested rules using the utility name in the selector
  walk(ast, (node) => {
    if (node.kind === 'rule') {
      let selectorAst = SelectorParser.parse(node.selector)
      SelectorParser.walk(selectorAst, (node) => {
        if (node.kind === 'selector' && node.value === `.${utilityName}`) {
          node.value = `.${escape(rawCandidate)}`
        }
      })
      node.selector = SelectorParser.toCss(selectorAst)
    }
  })
}
