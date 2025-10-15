import { version } from '../package.json'
import { substituteAtApply } from './apply'
import {
  atRoot,
  atRule,
  comment,
  context,
  context as contextNode,
  decl,
  optimizeAst,
  rule,
  styleRule,
  toCss,
  walk,
  WalkAction,
  type AstNode,
  type AtRule,
  type Context,
  type StyleRule,
} from './ast'
import { substituteAtImports } from './at-import'
import { applyCompatibilityHooks } from './compat/apply-compat-hooks'
import type { UserConfig } from './compat/config/types'
import { type Plugin } from './compat/plugin-api'
import { compileCandidates } from './compile'
import { substituteFunctions } from './css-functions'
import * as CSS from './css-parser'
import { buildDesignSystem, type DesignSystem } from './design-system'
import { createSourceMap, type DecodedSourceMap } from './source-maps/source-map'
import { Theme, ThemeOptions } from './theme'
import { createCssUtility } from './utilities'
import { expand } from './utils/brace-expansion'
import { escape, unescape } from './utils/escape'
import { segment } from './utils/segment'
import { topologicalSort } from './utils/topological-sort'
import { compoundsForSelectors, IS_VALID_VARIANT_NAME, substituteAtVariant } from './variants'
export type Config = UserConfig

const IS_VALID_PREFIX = /^[a-z]+$/

export const enum Polyfills {
  None = 0,

  // Control if fallbacks for `@property` rules are emitted
  AtProperty = 1 << 0,

  // Control if `color-mix(…)` fallbacks are inserted
  ColorMix = 1 << 1,

  // Enable all
  All = AtProperty | ColorMix,
}

type CompileOptions = {
  base?: string
  from?: string
  polyfills?: Polyfills
  loadModule?: (
    id: string,
    base: string,
    resourceHint: 'plugin' | 'config',
  ) => Promise<{
    path: string
    base: string
    module: Plugin | Config
  }>
  loadStylesheet?: (
    id: string,
    base: string,
  ) => Promise<{
    path: string
    base: string
    content: string
  }>
}

function throwOnLoadModule(): never {
  throw new Error('No `loadModule` function provided to `compile`')
}

function throwOnLoadStylesheet(): never {
  throw new Error('No `loadStylesheet` function provided to `compile`')
}

function parseThemeOptions(params: string) {
  let options = ThemeOptions.NONE
  let prefix = null

  for (let option of segment(params, ' ')) {
    if (option === 'reference') {
      options |= ThemeOptions.REFERENCE
    } else if (option === 'inline') {
      options |= ThemeOptions.INLINE
    } else if (option === 'default') {
      options |= ThemeOptions.DEFAULT
    } else if (option === 'static') {
      options |= ThemeOptions.STATIC
    } else if (option.startsWith('prefix(') && option.endsWith(')')) {
      prefix = option.slice(7, -1)
    }
  }

  return [options, prefix] as const
}

type Root =
  // Unknown root
  | null

  // Explicitly no root specified via `source(none)`
  | 'none'

  // Specified via `source(…)`, relative to the `base`
  | { base: string; pattern: string }

export const enum Features {
  None = 0,

  // `@apply` was used
  AtApply = 1 << 0,

  // `@import` was used
  AtImport = 1 << 1,

  // `@plugin` or `@config` was used
  JsPluginCompat = 1 << 2,

  // `theme(…)` was used
  ThemeFunction = 1 << 3,

  // `@tailwind utilities` was used
  Utilities = 1 << 4,

  // `@variant` was used
  Variants = 1 << 5,

  // `@theme` was used
  AtTheme = 1 << 6,
}

async function parseCss(
  ast: AstNode[],
  {
    base = '',
    from,
    loadModule = throwOnLoadModule,
    loadStylesheet = throwOnLoadStylesheet,
  }: CompileOptions = {},
) {
  let features = Features.None
  ast = [contextNode({ base }, ast)] as AstNode[]

  features |= await substituteAtImports(ast, base, loadStylesheet, 0, from !== undefined)

  let important = null as boolean | null
  let theme = new Theme()
  let customVariants = new Map<string, (designSystem: DesignSystem) => void>()
  let customVariantDependencies = new Map<string, Set<string>>()
  let customUtilities: ((designSystem: DesignSystem) => void)[] = []
  let firstThemeRule = null as StyleRule | null
  let utilitiesNode = null as AtRule | null
  let variantNodes: AtRule[] = []
  let sources: { base: string; pattern: string; negated: boolean }[] = []
  let inlineCandidates: string[] = []
  let ignoredCandidates: string[] = []
  let root = null as Root

  // Handle at-rules
  walk(ast, (node, ctx) => {
    if (node.kind !== 'at-rule') return

    // Find `@tailwind utilities` so that we can later replace it with the
    // actual generated utility class CSS.
    if (
      node.name === '@tailwind' &&
      (node.params === 'utilities' || node.params.startsWith('utilities'))
    ) {
      // Any additional `@tailwind utilities` nodes can be removed
      if (utilitiesNode !== null) {
        ctx.replaceWith([])
        return
      }

      // When inside `@reference` we should treat `@tailwind utilities` as if
      // it wasn't there in the first place. This should also let `build()`
      // return the cached static AST.
      if (ctx.context.reference) {
        ctx.replaceWith([])
        return
      }

      let params = segment(node.params, ' ')
      for (let param of params) {
        if (param.startsWith('source(')) {
          let path = param.slice(7, -1)

          // Keyword: `source(none)`
          if (path === 'none') {
            root = path
            continue
          }

          // Explicit path: `source('…')`
          if (
            (path[0] === '"' && path[path.length - 1] !== '"') ||
            (path[0] === "'" && path[path.length - 1] !== "'") ||
            (path[0] !== "'" && path[0] !== '"')
          ) {
            throw new Error('`source(…)` paths must be quoted.')
          }

          root = {
            base: (ctx.context.sourceBase as string) ?? (ctx.context.base as string),
            pattern: path.slice(1, -1),
          }
        }
      }

      utilitiesNode = node
      features |= Features.Utilities
    }

    // Collect custom `@utility` at-rules
    if (node.name === '@utility') {
      if (ctx.parent !== null) {
        throw new Error('`@utility` cannot be nested.')
      }

      if (node.nodes.length === 0) {
        throw new Error(
          `\`@utility ${node.params}\` is empty. Utilities should include at least one property.`,
        )
      }

      let utility = createCssUtility(node)
      if (utility === null) {
        if (!node.params.endsWith('-*')) {
          if (node.params.endsWith('*')) {
            throw new Error(
              `\`@utility ${node.params}\` defines an invalid utility name. A functional utility must end in \`-*\`.`,
            )
          } else if (node.params.includes('*')) {
            throw new Error(
              `\`@utility ${node.params}\` defines an invalid utility name. The dynamic portion marked by \`-*\` must appear once at the end.`,
            )
          }
        }

        throw new Error(
          `\`@utility ${node.params}\` defines an invalid utility name. Utilities should be alphanumeric and start with a lowercase letter.`,
        )
      }

      customUtilities.push(utility)
    }

    // Collect paths from `@source` at-rules
    if (node.name === '@source') {
      if (node.nodes.length > 0) {
        throw new Error('`@source` cannot have a body.')
      }

      if (ctx.parent !== null) {
        throw new Error('`@source` cannot be nested.')
      }

      let not = false
      let inline = false
      let path = node.params

      if (path[0] === 'n' && path.startsWith('not ')) {
        not = true
        path = path.slice(4)
      }

      if (path[0] === 'i' && path.startsWith('inline(')) {
        inline = true
        path = path.slice(7, -1)
      }

      if (
        (path[0] === '"' && path[path.length - 1] !== '"') ||
        (path[0] === "'" && path[path.length - 1] !== "'") ||
        (path[0] !== "'" && path[0] !== '"')
      ) {
        throw new Error('`@source` paths must be quoted.')
      }

      let source = path.slice(1, -1)

      if (inline) {
        let destination = not ? ignoredCandidates : inlineCandidates
        let sources = segment(source, ' ')
        for (let source of sources) {
          for (let candidate of expand(source)) {
            destination.push(candidate)
          }
        }
      } else {
        sources.push({
          base: ctx.context.base as string,
          pattern: source,
          negated: not,
        })
      }
      ctx.replaceWith([])
      return
    }

    // Apply `@variant` at-rules
    if (node.name === '@variant') {
      // Legacy `@variant` at-rules containing `@slot` or without a body should
      // be considered a `@custom-variant` at-rule.
      if (ctx.parent === null) {
        // Body-less `@variant`, e.g.: `@variant foo (…);`
        if (node.nodes.length === 0) {
          node.name = '@custom-variant'
        }

        // Using `@slot`:
        //
        // ```css
        // @variant foo {
        //   &:hover {
        //     @slot;
        //   }
        // }
        // ```
        else {
          walk(node.nodes, (child) => {
            if (child.kind === 'at-rule' && child.name === '@slot') {
              node.name = '@custom-variant'
              return WalkAction.Stop
            }
          })

          // No `@slot` found, so this is still a regular `@variant` at-rule
          if (node.name === '@variant') {
            variantNodes.push(node)
          }
        }
      }

      // Collect all the `@variant` at-rules, we will replace them later once
      // all variants are registered in the system.
      else {
        variantNodes.push(node)
      }
    }

    // Register custom variants from `@custom-variant` at-rules
    if (node.name === '@custom-variant') {
      if (ctx.parent !== null) {
        throw new Error('`@custom-variant` cannot be nested.')
      }

      // Remove `@custom-variant` at-rule so it's not included in the compiled CSS
      ctx.replaceWith([])

      let [name, selector] = segment(node.params, ' ')

      if (!IS_VALID_VARIANT_NAME.test(name)) {
        throw new Error(
          `\`@custom-variant ${name}\` defines an invalid variant name. Variants should only contain alphanumeric, dashes, or underscore characters and start with a lowercase letter or number.`,
        )
      }

      if (node.nodes.length > 0 && selector) {
        throw new Error(`\`@custom-variant ${name}\` cannot have both a selector and a body.`)
      }

      // Variants with a selector, but without a body, e.g.: `@custom-variant hocus (&:hover, &:focus);`
      if (node.nodes.length === 0) {
        if (!selector) {
          throw new Error(`\`@custom-variant ${name}\` has no selector or body.`)
        }

        let selectors = segment(selector.slice(1, -1), ',')
        if (selectors.length === 0 || selectors.some((selector) => selector.trim() === '')) {
          throw new Error(
            `\`@custom-variant ${name} (${selectors.join(',')})\` selector is invalid.`,
          )
        }

        let atRuleParams: string[] = []
        let styleRuleSelectors: string[] = []

        for (let selector of selectors) {
          selector = selector.trim()

          if (selector[0] === '@') {
            atRuleParams.push(selector)
          } else {
            styleRuleSelectors.push(selector)
          }
        }

        customVariants.set(name, (designSystem) => {
          designSystem.variants.static(
            name,
            (r) => {
              let nodes: AstNode[] = []

              if (styleRuleSelectors.length > 0) {
                nodes.push(styleRule(styleRuleSelectors.join(', '), r.nodes))
              }

              for (let selector of atRuleParams) {
                nodes.push(rule(selector, r.nodes))
              }

              r.nodes = nodes
            },
            {
              compounds: compoundsForSelectors([...styleRuleSelectors, ...atRuleParams]),
            },
          )
        })
        customVariantDependencies.set(name, new Set<string>())

        return
      }

      // Variants without a selector, but with a body:
      //
      // E.g.:
      //
      // ```css
      // @custom-variant hocus {
      //   &:hover {
      //     @slot;
      //   }
      //
      //   &:focus {
      //     @slot;
      //   }
      // }
      // ```
      else {
        let dependencies = new Set<string>()
        walk(node.nodes, (child) => {
          if (child.kind === 'at-rule' && child.name === '@variant') {
            dependencies.add(child.params)
          }
        })

        customVariants.set(name, (designSystem) => {
          designSystem.variants.fromAst(name, node.nodes, designSystem)
        })
        customVariantDependencies.set(name, dependencies)

        return
      }
    }

    if (node.name === '@media') {
      let params = segment(node.params, ' ')
      let unknownParams: string[] = []

      for (let param of params) {
        // Handle `@media source(…)`
        if (param.startsWith('source(')) {
          let path = param.slice(7, -1)

          walk(node.nodes, (child, ctx) => {
            if (child.kind !== 'at-rule') return

            if (child.name === '@tailwind' && child.params === 'utilities') {
              child.params += ` source(${path})`
              ctx.replaceWith([contextNode({ sourceBase: ctx.context.base }, [child])])
              return WalkAction.Stop
            }
          })
        }

        // Handle `@media theme(…)`
        //
        // We support `@import "tailwindcss" theme(reference)` as a way to
        // import an external theme file as a reference, which becomes `@media
        // theme(reference) { … }` when the `@import` is processed.
        else if (param.startsWith('theme(')) {
          let themeParams = param.slice(6, -1)
          let hasReference = themeParams.includes('reference')

          walk(node.nodes, (child) => {
            if (child.kind !== 'at-rule') {
              if (hasReference) {
                throw new Error(
                  `Files imported with \`@import "…" theme(reference)\` must only contain \`@theme\` blocks.\nUse \`@reference "…";\` instead.`,
                )
              }

              return WalkAction.Continue
            }

            if (child.name === '@theme') {
              child.params += ' ' + themeParams
              return WalkAction.Skip
            }
          })
        }

        // Handle `@media prefix(…)`
        //
        // We support `@import "tailwindcss" prefix(ident)` as a way to
        // configure a theme prefix for variables and utilities.
        else if (param.startsWith('prefix(')) {
          let prefix = param.slice(7, -1)

          walk(node.nodes, (child) => {
            if (child.kind !== 'at-rule') return
            if (child.name === '@theme') {
              child.params += ` prefix(${prefix})`
              return WalkAction.Skip
            }
          })
        }

        // Handle important
        else if (param === 'important') {
          important = true
        }

        // Handle `@import "…" reference`
        else if (param === 'reference') {
          node.nodes = [contextNode({ reference: true }, node.nodes)]
        }

        //
        else {
          unknownParams.push(param)
        }
      }

      if (unknownParams.length > 0) {
        node.params = unknownParams.join(' ')
      } else if (params.length > 0) {
        ctx.replaceWith(node.nodes)
      }
    }

    // Handle `@theme`
    if (node.name === '@theme') {
      let [themeOptions, themePrefix] = parseThemeOptions(node.params)

      features |= Features.AtTheme

      if (ctx.context.reference) {
        themeOptions |= ThemeOptions.REFERENCE
      }

      if (themePrefix) {
        if (!IS_VALID_PREFIX.test(themePrefix)) {
          throw new Error(
            `The prefix "${themePrefix}" is invalid. Prefixes must be lowercase ASCII letters (a-z) only.`,
          )
        }

        theme.prefix = themePrefix
      }

      // Record all custom properties in the `@theme` declaration
      walk(node.nodes, (child) => {
        // Collect `@keyframes` rules to re-insert with theme variables later,
        // since the `@theme` rule itself will be removed.
        if (child.kind === 'at-rule' && child.name === '@keyframes') {
          theme.addKeyframes(child)
          return WalkAction.Skip
        }

        if (child.kind === 'comment') return
        if (child.kind === 'declaration' && child.property.startsWith('--')) {
          theme.add(unescape(child.property), child.value ?? '', themeOptions, child.src)
          return
        }

        let snippet = toCss([atRule(node.name, node.params, [child])])
          .split('\n')
          .map((line, idx, all) => `${idx === 0 || idx >= all.length - 2 ? ' ' : '>'} ${line}`)
          .join('\n')

        throw new Error(
          `\`@theme\` blocks must only contain custom properties or \`@keyframes\`.\n\n${snippet}`,
        )
      })

      // Keep a reference to the first `@theme` rule to update with the full
      // theme later, and delete any other `@theme` rules.
      if (!firstThemeRule) {
        firstThemeRule = styleRule(':root, :host', [])
        firstThemeRule.src = node.src
        ctx.replaceWith([firstThemeRule])
      } else {
        ctx.replaceWith([])
      }
      return WalkAction.Skip
    }
  })

  let designSystem = buildDesignSystem(theme)

  if (important) {
    designSystem.important = important
  }

  if (ignoredCandidates.length > 0) {
    for (let candidate of ignoredCandidates) {
      designSystem.invalidCandidates.add(candidate)
    }
  }

  // Apply hooks from backwards compatibility layer. This function takes a lot
  // of random arguments because it really just needs access to "the world" to
  // do whatever ungodly things it needs to do to make things backwards
  // compatible without polluting core.
  features |= await applyCompatibilityHooks({
    designSystem,
    base,
    ast,
    loadModule,
    sources,
  })

  for (let name of customVariants.keys()) {
    // Pre-register the variant to ensure its position in the variant list is
    // based on the order we see them in the CSS.
    designSystem.variants.static(name, () => {})
  }

  // Register custom variants in order
  for (let variant of topologicalSort(customVariantDependencies, {
    onCircularDependency(path, start) {
      let output = toCss(
        path.map((name, idx) => {
          return atRule('@custom-variant', name, [atRule('@variant', path[idx + 1] ?? start, [])])
        }),
      )
        .replaceAll(';', ' { … }')
        .replace(`@custom-variant ${start} {`, `@custom-variant ${start} { /* ← */`)

      throw new Error(`Circular dependency detected in custom variants:\n\n${output}`)
    },
  })) {
    customVariants.get(variant)?.(designSystem)
  }

  for (let customUtility of customUtilities) {
    customUtility(designSystem)
  }

  // Output final set of theme variables at the position of the first
  // `@theme` rule.
  if (firstThemeRule) {
    let nodes = []

    for (let [key, value] of designSystem.theme.entries()) {
      if (value.options & ThemeOptions.REFERENCE) continue
      let node = decl(escape(key), value.value)
      node.src = value.src
      nodes.push(node)
    }

    let keyframesRules = designSystem.theme.getKeyframes()
    for (let keyframes of keyframesRules) {
      // Wrap `@keyframes` in `AtRoot` so they are hoisted out of `:root` when
      // printing. We push it to the top-level of the AST so that an eventual
      // `@reference` does not cut it out when printing the document.
      ast.push(context({ theme: true }, [atRoot([keyframes])]))
    }

    firstThemeRule.nodes = [context({ theme: true }, nodes)]
  }

  features |= substituteAtVariant(ast, designSystem)
  features |= substituteFunctions(ast, designSystem)
  features |= substituteAtApply(ast, designSystem)

  // Replace the `@tailwind utilities` node with a context since it prints
  // children directly.
  if (utilitiesNode) {
    let node = utilitiesNode as AstNode as Context
    node.kind = 'context'
    node.context = {}
  }

  // Remove `@utility`, we couldn't replace it before yet because we had to
  // handle the nested `@apply` at-rules first.
  walk(ast, (node, ctx) => {
    if (node.kind !== 'at-rule') return

    if (node.name === '@utility') {
      ctx.replaceWith([])
    }

    // The `@utility` has to be top-level, therefore we don't have to traverse
    // into nested trees.
    return WalkAction.Skip
  })

  return {
    designSystem,
    ast,
    sources,
    root,
    utilitiesNode,
    features,
    inlineCandidates,
  }
}

export async function compileAst(
  input: AstNode[],
  opts: CompileOptions = {},
): Promise<{
  sources: { base: string; pattern: string; negated: boolean }[]
  root: Root
  features: Features
  build(candidates: string[]): AstNode[]
}> {
  let { designSystem, ast, sources, root, utilitiesNode, features, inlineCandidates } =
    await parseCss(input, opts)

  if (process.env.NODE_ENV !== 'test') {
    ast.unshift(comment(`! tailwindcss v${version} | MIT License | https://tailwindcss.com `))
  }

  // Track all invalid candidates
  function onInvalidCandidate(candidate: string) {
    designSystem.invalidCandidates.add(candidate)
  }

  // Track all valid candidates, these are the incoming `rawCandidate` that
  // resulted in a generated AST Node. All the other `rawCandidates` are invalid
  // and should be ignored.
  let allValidCandidates = new Set<string>()
  let compiled = null as AstNode[] | null
  let previousAstNodeCount = 0
  let defaultDidChange = false

  for (let candidate of inlineCandidates) {
    if (!designSystem.invalidCandidates.has(candidate)) {
      allValidCandidates.add(candidate)
      defaultDidChange = true
    }
  }

  return {
    sources,
    root,
    features,
    build(newRawCandidates: string[]) {
      if (features === Features.None) {
        return input
      }

      if (!utilitiesNode) {
        compiled ??= optimizeAst(ast, designSystem, opts.polyfills)
        return compiled
      }

      let didChange = defaultDidChange
      let didAddExternalVariable = false
      defaultDidChange = false

      // Add all new candidates unless we know that they are invalid.
      let prevSize = allValidCandidates.size
      for (let candidate of newRawCandidates) {
        if (!designSystem.invalidCandidates.has(candidate)) {
          if (candidate[0] === '-' && candidate[1] === '-') {
            let didMarkVariableAsUsed = designSystem.theme.markUsedVariable(candidate)
            didChange ||= didMarkVariableAsUsed
            didAddExternalVariable ||= didMarkVariableAsUsed
          } else {
            allValidCandidates.add(candidate)
            didChange ||= allValidCandidates.size !== prevSize
          }
        }
      }

      // If no new candidates were added, we can return the original CSS. This
      // currently assumes that we only add new candidates and never remove any.
      if (!didChange) {
        compiled ??= optimizeAst(ast, designSystem, opts.polyfills)
        return compiled
      }

      let newNodes = compileCandidates(allValidCandidates, designSystem, {
        onInvalidCandidate,
      }).astNodes

      if (opts.from) {
        walk(newNodes, (node) => {
          // We do this conditionally to preserve source locations from both
          // `@utility` and `@custom-variant`. Even though generated nodes are
          // cached this should be fine because `utilitiesNode.src` should not
          // change without a full rebuild which destroys the cache.
          node.src ??= utilitiesNode.src
        })
      }

      // If no new ast nodes were generated, then we can return the original
      // CSS. This currently assumes that we only add new ast nodes and never
      // remove any.
      if (!didAddExternalVariable && previousAstNodeCount === newNodes.length) {
        compiled ??= optimizeAst(ast, designSystem, opts.polyfills)
        return compiled
      }

      previousAstNodeCount = newNodes.length

      utilitiesNode.nodes = newNodes

      compiled = optimizeAst(ast, designSystem, opts.polyfills)
      return compiled
    },
  }
}

export type { DecodedSourceMap }

export async function compile(
  css: string,
  opts: CompileOptions = {},
): Promise<{
  sources: { base: string; pattern: string; negated: boolean }[]
  root: Root
  features: Features
  build(candidates: string[]): string
  buildSourceMap(): DecodedSourceMap
}> {
  let ast = CSS.parse(css, { from: opts.from })
  let api = await compileAst(ast, opts)
  let compiledAst = ast
  let compiledCss = css

  return {
    ...api,
    build(newCandidates) {
      let newAst = api.build(newCandidates)

      if (newAst === compiledAst) {
        return compiledCss
      }

      compiledCss = toCss(newAst, !!opts.from)
      compiledAst = newAst

      return compiledCss
    },

    buildSourceMap() {
      return createSourceMap({
        ast: compiledAst,
      })
    },
  }
}

export async function __unstable__loadDesignSystem(css: string, opts: CompileOptions = {}) {
  let result = await parseCss(CSS.parse(css), opts)
  return result.designSystem
}

export default function postcssPluginWarning() {
  throw new Error(
    `It looks like you're trying to use \`tailwindcss\` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install \`@tailwindcss/postcss\` and update your PostCSS configuration.`,
  )
}
