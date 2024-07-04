import { decl, rule, type AstNode, type Rule } from './ast'
import type { Candidate } from './candidate'
import type { DesignSystem } from './design-system'

export type MatchData = {
  value: string | null
  modifier: string | null
}

export type SelectorFormat = CssSelectors | ((candidate: MatchData) => CssSelectors)
export type UtilityFormat = CssTree | ((value: string | null, candidate: MatchData) => CssTree)

export type CssSelectors = string | string[]
export interface CssTree extends Record<string, string | CssTree> {}

export interface PluginAPI {
  addVariant(name: string, format: SelectorFormat): void
  addVariants(variants: Record<string, SelectorFormat>): void

  addUtility(name: string, format: UtilityFormat): void
  addUtilities(utilities: Record<string, UtilityFormat>): void
}

export type Plugin = FunctionalPlugin | ConfigurablePlugin

export interface FunctionalPlugin {
  (api: PluginAPI): void | Promise<void>
}

export interface ConfigurablePlugin {
  handler(api: PluginAPI): void | Promise<void>
}

/**
 * Convert a recursive object structure to an AST
 * Leaf nodes are declarations and branches are rules
 **/
function treeToAst(props: CssTree): AstNode[] {
  let ast: AstNode[] = []

  for (let [name, value] of Object.entries(props)) {
    if (typeof value === 'string') {
      if (value.startsWith('@')) {
        ast.push(rule(name, []))
      } else {
        ast.push(decl(name, value))
      }
    } else {
      ast.push(rule(name, treeToAst(value)))
    }
  }

  return ast
}

/**
 * Convert a recursive object structure to an AST
 * Leaf nodes are declarations and branches are rules
 **/
function selectorsToAst(r: Rule, selectors: CssSelectors): AstNode[] {
  if (typeof selectors === 'string') {
    return [rule(selectors, r.nodes)]
  }

  return selectors.map((selector) => rule(selector, r.nodes))
}

/**
 * Convert a recursive object structure to an AST
 * Leaf nodes are declarations and branches are rules
 **/
function utilityToAst(
  candidate: Extract<Candidate, { kind: 'functional' | 'static' }>,
  props: UtilityFormat,
): AstNode[] {
  if (candidate.kind === 'static') {
    if (candidate.negative) {
      return []
    }

    if (typeof props === 'object') {
      return treeToAst(props)
    }

    return []
  }

  if (typeof props === 'object') {
    return treeToAst(props)
  }

  let match = {
    value: candidate.value?.value ?? null,
    modifier: candidate.modifier?.value ?? null,
  }

  return treeToAst(props(match.value, match))
}

export function registerPlugins(design: DesignSystem) {
  let { utilities, variants } = design

  function addUtility(name: string, format: UtilityFormat) {
    if (name.startsWith('.')) {
      name = name.slice(1)
    }

    if (typeof format === 'object') {
      utilities.static(name, (candidate) => utilityToAst(candidate, format))

      return
    }

    utilities.functional(name, (candidate) => utilityToAst(candidate, format))
  }

  function addUtilities(list: Record<string, UtilityFormat>) {
    for (let [className, format] of Object.entries(list)) {
      addUtility(className, format)
    }
  }

  function addVariant(name: string, format: SelectorFormat) {
    if (typeof format === 'string' || Array.isArray(format)) {
      variants.static(
        name,
        (r) => {
          r.nodes = selectorsToAst(r, format)
        },
        { compounds: true },
      )

      return
    }

    variants.functional(
      name,
      (r, variant) => {
        let match = {
          value: variant.value?.value ?? null,
          modifier: variant.modifier?.value ?? null,
        }

        let resolved = format(match)

        r.nodes = selectorsToAst(r, resolved)
      },
      { compounds: true },
    )
  }

  function addVariants(list: Record<string, SelectorFormat>) {
    for (let [name, format] of Object.entries(list)) {
      addVariant(name, format)
    }
  }

  for (let plugin of design.plugins) {
    let handler = typeof plugin === 'function' ? plugin : plugin.handler

    handler({
      // v3 compatible legacy API
      addUtility,
      addUtilities,
      addVariant,
      addVariants,
    })
  }
}
