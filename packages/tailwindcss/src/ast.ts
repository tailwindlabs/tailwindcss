import { Polyfills } from '.'
import * as SelectorParser from '../src/selector-parser'
import { parseAtRule } from './css-parser'
import type { DesignSystem } from './design-system'
import type { Source, SourceLocation } from './source-maps/source'
import { Theme, ThemeOptions } from './theme'
import { DefaultMap } from './utils/default-map'
import { segment } from './utils/segment'
import { extractUsedVariables } from './utils/variables'
import * as ValueParser from './value-parser'
import { walk, WalkAction, type VisitContext } from './walk'

const AT_SIGN = 0x40
const PIPE = 0x7c

export type StyleRule = {
  kind: 'rule'
  selector: string
  nodes: AstNode[]

  src?: SourceLocation
  dst?: SourceLocation
}

export type AtRule = {
  kind: 'at-rule'
  name: string
  params: string
  nodes: AstNode[]

  src?: SourceLocation
  dst?: SourceLocation
}

export type Declaration = {
  kind: 'declaration'
  property: string
  value: string | undefined
  important: boolean

  src?: SourceLocation
  dst?: SourceLocation
}

export type Comment = {
  kind: 'comment'
  value: string

  src?: SourceLocation
  dst?: SourceLocation
}

export type Context = {
  kind: 'context'
  context: Record<string, string | boolean>
  nodes: AstNode[]

  src?: undefined
  dst?: undefined
}

export type AtRoot = {
  kind: 'at-root'
  nodes: AstNode[]

  src?: undefined
  dst?: undefined
}

export type Rule = StyleRule | AtRule
export type AstNode = StyleRule | AtRule | Declaration | Comment | Context | AtRoot

export function styleRule(selector: string, nodes: AstNode[] = []): StyleRule {
  return {
    kind: 'rule',
    selector,
    nodes,
  }
}

export function atRule(name: string, params: string = '', nodes: AstNode[] = []): AtRule {
  return {
    kind: 'at-rule',
    name,
    params,
    nodes,
  }
}

export function rule(selector: string, nodes: AstNode[] = []): StyleRule | AtRule {
  if (selector.charCodeAt(0) === AT_SIGN) {
    return parseAtRule(selector, nodes)
  }

  return styleRule(selector, nodes)
}

export function decl(property: string, value: string | undefined, important = false): Declaration {
  return {
    kind: 'declaration',
    property,
    value,
    important,
  }
}

export function comment(value: string): Comment {
  return {
    kind: 'comment',
    value: value,
  }
}

export function context(context: Record<string, string | boolean>, nodes: AstNode[]): Context {
  return {
    kind: 'context',
    context,
    nodes,
  }
}

export function atRoot(nodes: AstNode[]): AtRoot {
  return {
    kind: 'at-root',
    nodes,
  }
}

export function cloneAstNode<T extends AstNode>(node: T): T {
  switch (node.kind) {
    case 'rule':
      return {
        kind: node.kind,
        selector: node.selector,
        nodes: node.nodes.map(cloneAstNode),
        src: node.src,
        dst: node.dst,
      } satisfies StyleRule as T

    case 'at-rule':
      return {
        kind: node.kind,
        name: node.name,
        params: node.params,
        nodes: node.nodes.map(cloneAstNode),
        src: node.src,
        dst: node.dst,
      } satisfies AtRule as T

    case 'at-root':
      return {
        kind: node.kind,
        nodes: node.nodes.map(cloneAstNode),
        src: node.src,
        dst: node.dst,
      } satisfies AtRoot as T

    case 'context':
      return {
        kind: node.kind,
        context: { ...node.context },
        nodes: node.nodes.map(cloneAstNode),
        src: node.src,
        dst: node.dst,
      } satisfies Context as T

    case 'declaration':
      return {
        kind: node.kind,
        property: node.property,
        value: node.value,
        important: node.important,
        src: node.src,
        dst: node.dst,
      } satisfies Declaration as T

    case 'comment':
      return {
        kind: node.kind,
        value: node.value,
        src: node.src,
        dst: node.dst,
      } satisfies Comment as T

    default:
      node satisfies never
      throw new Error(`Unknown node kind: ${(node as any).kind}`)
  }
}

export function cssContext(
  ctx: VisitContext<AstNode>,
): VisitContext<AstNode> & { context: Record<string, string | boolean> } {
  return {
    depth: ctx.depth,
    index: ctx.index,
    siblings: ctx.siblings,
    get context() {
      let context: Record<string, string | boolean> = {}
      for (let child of ctx.path()) {
        if (child.kind === 'context') {
          Object.assign(context, child.context)
        }
      }

      // Once computed, we never need to compute this again
      Object.defineProperty(this, 'context', { value: context })
      return context
    },
    get parent() {
      let parent = (this.path().pop() as Extract<AstNode, { nodes: AstNode[] }>) ?? null

      // Once computed, we never need to compute this again
      Object.defineProperty(this, 'parent', { value: parent })
      return parent
    },
    path() {
      return ctx.path().filter((n) => n.kind !== 'context')
    },
  }
}

// Optimize the AST for printing where all the special nodes that require custom
// handling are handled such that the printing is a 1-to-1 transformation.
export function optimizeAst(
  ast: AstNode[],
  designSystem: DesignSystem,
  polyfills: Polyfills = Polyfills.All,
) {
  let atRoots: AstNode[] = []
  let seenAtProperties = new Set<string>()
  let cssThemeVariables = new DefaultMap<AstNode[], Set<Declaration>>(() => new Set())
  let colorMixDeclarations = new DefaultMap<AstNode[], Set<Declaration>>(() => new Set())
  let keyframes = new Set<AtRule>()
  let usedKeyframeNames = new Set()

  let propertyFallbacksRoot: Declaration[] = []
  let propertyFallbacksUniversal: Declaration[] = []

  let variableDependencies = new DefaultMap<string, Set<string>>(() => new Set())

  function transform(
    node: AstNode,
    parent: AstNode[],
    context: Record<string, string | boolean> = {},
    depth = 0,
  ) {
    // Declaration
    if (node.kind === 'declaration') {
      if (node.property === '--tw-sort' || node.value === undefined || node.value === null) {
        return
      }

      // Track variables defined in `@theme`
      if (context.theme && node.property[0] === '-' && node.property[1] === '-') {
        // Variables that resolve to `initial` should never be emitted. This can happen because of
        // the `--theme(…)` being used and evaluated lazily
        if (node.value === 'initial') {
          node.value = undefined
          return
        }

        if (!context.keyframes) {
          cssThemeVariables.get(parent).add(node)
        }
      }

      // Track used CSS variables
      if (node.value.includes('var(')) {
        // Declaring another variable does not count as usage. Instead, we mark
        // the relationship
        if (context.theme && node.property[0] === '-' && node.property[1] === '-') {
          for (let variable of extractUsedVariables(node.value)) {
            variableDependencies.get(variable).add(node.property)
          }
        } else {
          designSystem.trackUsedVariables(node.value)
        }
      }

      // Track used animation names
      if (node.property === 'animation') {
        for (let keyframeName of extractKeyframeNames(node.value)) {
          usedKeyframeNames.add(keyframeName)
        }
      }

      // Create fallback values for usages of the `color-mix(…)` function that reference variables
      // found in the theme config.
      if (
        polyfills & Polyfills.ColorMix &&
        !context.supportsColorMix &&
        !context.keyframes &&
        node.value.includes('color-mix(')
      ) {
        colorMixDeclarations.get(parent).add(node)
      }

      parent.push(node)
    }

    // Rule
    else if (node.kind === 'rule') {
      let nodes: AstNode[] = []

      for (let child of node.nodes) {
        transform(child, nodes, context, depth + 1)
      }

      if (nodes.length > 0) {
        parent.push({ ...node, nodes })
      }
    }

    // AtRule `@property`
    else if (node.kind === 'at-rule' && node.name === '@property' && depth === 0) {
      // Don't output duplicate `@property` rules
      if (seenAtProperties.has(node.params)) {
        return
      }

      // Collect fallbacks for `@property` rules for Firefox support We turn these into rules on
      // `:root` or `*` and some pseudo-elements based on the value of `inherits`
      if (polyfills & Polyfills.AtProperty) {
        let property = node.params
        let initialValue = null
        let inherits = false

        for (let prop of node.nodes) {
          if (prop.kind !== 'declaration') continue
          if (prop.property === 'initial-value') {
            initialValue = prop.value
          } else if (prop.property === 'inherits') {
            inherits = prop.value === 'true'
          }
        }

        let fallback = decl(property, initialValue ?? 'initial')
        fallback.src = node.src

        if (inherits) {
          propertyFallbacksRoot.push(fallback)
        } else {
          propertyFallbacksUniversal.push(fallback)
        }
      }

      seenAtProperties.add(node.params)

      let copy = { ...node, nodes: [] }
      for (let child of node.nodes) {
        transform(child, copy.nodes, context, depth + 1)
      }
      parent.push(copy)
    }

    // AtRule
    else if (node.kind === 'at-rule') {
      if (node.name === '@keyframes') {
        context = { ...context, keyframes: true }
      } else if (node.name === '@supports' && node.params.includes('color-mix(')) {
        context = { ...context, supportsColorMix: true }
      }

      let copy = { ...node, nodes: [] }
      for (let child of node.nodes) {
        transform(child, copy.nodes, context, depth + 1)
      }

      // Only track `@keyframes` that could be removed, when they were defined inside of a `@theme`.
      if (node.name === '@keyframes' && context.theme) {
        keyframes.add(copy)
      }

      if (
        copy.nodes.length > 0 ||
        copy.name === '@layer' ||
        copy.name === '@charset' ||
        copy.name === '@custom-media' ||
        copy.name === '@namespace' ||
        copy.name === '@import' ||
        copy.name === '@apply'
      ) {
        parent.push(copy)
      }
    }

    // AtRoot
    else if (node.kind === 'at-root') {
      for (let child of node.nodes) {
        let newParent: AstNode[] = []
        transform(child, newParent, context, 0)
        for (let child of newParent) {
          atRoots.push(child)
        }
      }
    }

    // Context
    else if (node.kind === 'context') {
      // Remove reference imports from printing
      if (node.context.reference) {
        return
      } else {
        for (let child of node.nodes) {
          transform(child, parent, { ...context, ...node.context }, depth)
        }
      }
    }

    // Comment
    else if (node.kind === 'comment') {
      parent.push(node)
    }

    // Unknown
    else {
      node satisfies never
    }
  }

  let newAst: AstNode[] = []
  for (let node of ast) {
    transform(node, newAst, {}, 0)
  }

  // Remove unused theme variables
  next: for (let [parent, declarations] of cssThemeVariables) {
    for (let declaration of declarations) {
      // Find out if a variable is either used directly or if any of the
      // variables referencing it is used.
      let variableUsed = isVariableUsed(
        declaration.property,
        designSystem.theme,
        variableDependencies,
      )
      if (variableUsed) {
        if (declaration.property.startsWith(designSystem.theme.prefixKey('--animate-'))) {
          for (let keyframeName of extractKeyframeNames(declaration.value!))
            usedKeyframeNames.add(keyframeName)
        }

        continue
      }

      // Remove the declaration (from its parent)
      let idx = parent.indexOf(declaration)
      parent.splice(idx, 1)

      // If the parent is now empty, remove it and any `@layer` rules above it
      // from the AST
      if (parent.length === 0) {
        let path = findNode(newAst, (node) => node.kind === 'rule' && node.nodes === parent)

        if (!path || path.length === 0) continue next

        // Add the root of the AST so we can delete from the top-level
        path.unshift({
          kind: 'at-root',
          nodes: newAst,
        })

        // Remove nodes from the parent as long as the parent is empty
        // otherwise and consist of only @layer rules
        do {
          let nodeToRemove = path.pop()
          if (!nodeToRemove) break

          let removeFrom = path[path.length - 1]
          if (!removeFrom) break
          if (removeFrom.kind !== 'at-root' && removeFrom.kind !== 'at-rule') break

          let idx = removeFrom.nodes.indexOf(nodeToRemove)
          if (idx === -1) break

          removeFrom.nodes.splice(idx, 1)
        } while (true)

        continue next
      }
    }
  }

  // Remove unused keyframes
  for (let keyframe of keyframes) {
    if (!usedKeyframeNames.has(keyframe.params)) {
      let idx = atRoots.indexOf(keyframe)
      atRoots.splice(idx, 1)
    }
  }

  newAst = newAst.concat(atRoots)

  // Fallbacks
  // Create fallback values for usages of the `color-mix(…)` function that reference variables
  // found in the theme config.
  if (polyfills & Polyfills.ColorMix) {
    for (let [parent, declarations] of colorMixDeclarations) {
      for (let declaration of declarations) {
        let idx = parent.indexOf(declaration)
        // If the declaration is no longer present, we don't need to create a polyfill anymore
        if (idx === -1 || declaration.value == null) continue

        let ast = ValueParser.parse(declaration.value)
        let requiresPolyfill = false
        walk(ast, (node) => {
          if (node.kind !== 'function' || node.value !== 'color-mix') return

          let containsUnresolvableVars = false
          let containsCurrentcolor = false
          walk(node.nodes, (node) => {
            if (node.kind == 'word' && node.value.toLowerCase() === 'currentcolor') {
              containsCurrentcolor = true
              requiresPolyfill = true
              return
            }

            let varNode: ValueParser.ValueAstNode | null = node
            let inlinedColor: string | null = null
            let seenVariables = new Set<string>()
            do {
              if (varNode.kind !== 'function' || varNode.value !== 'var') return
              let firstChild = varNode.nodes[0]
              if (!firstChild || firstChild.kind !== 'word') return

              let variableName = firstChild.value

              if (seenVariables.has(variableName)) {
                containsUnresolvableVars = true
                return
              }

              seenVariables.add(variableName)

              requiresPolyfill = true

              inlinedColor = designSystem.theme.resolveValue(null, [firstChild.value as any])
              if (!inlinedColor) {
                containsUnresolvableVars = true
                return
              }
              if (inlinedColor.toLowerCase() === 'currentcolor') {
                containsCurrentcolor = true
                return
              }

              if (inlinedColor.startsWith('var(')) {
                let subAst = ValueParser.parse(inlinedColor)
                varNode = subAst[0]
              } else {
                varNode = null
              }
            } while (varNode)

            return WalkAction.Replace({ kind: 'word', value: inlinedColor } as const)
          })

          if (containsUnresolvableVars || containsCurrentcolor) {
            let separatorIndex = node.nodes.findIndex(
              (node) => node.kind === 'separator' && node.value.trim().includes(','),
            )
            if (separatorIndex === -1) return
            let firstColorValue =
              node.nodes.length > separatorIndex ? node.nodes[separatorIndex + 1] : null
            if (!firstColorValue) return
            return WalkAction.Replace(firstColorValue)
          } else if (requiresPolyfill) {
            // Change the colorspace to `srgb` since the fallback values should not be represented as
            // `oklab(…)` functions again as their support in Safari <16 is very limited.
            let colorspace = node.nodes[2]
            if (
              colorspace.kind === 'word' &&
              (colorspace.value === 'oklab' ||
                colorspace.value === 'oklch' ||
                colorspace.value === 'lab' ||
                colorspace.value === 'lch')
            ) {
              colorspace.value = 'srgb'
            }
          }
        })
        if (!requiresPolyfill) continue

        let fallback = {
          ...declaration,
          value: ValueParser.toCss(ast),
        }
        let colorMixQuery = rule('@supports (color: color-mix(in lab, red, red))', [declaration])
        colorMixQuery.src = declaration.src
        parent.splice(idx, 1, fallback, colorMixQuery)
      }
    }
  }

  if (polyfills & Polyfills.AtProperty) {
    let fallbackAst = []

    if (propertyFallbacksRoot.length > 0) {
      let wrapper = rule(':root, :host', propertyFallbacksRoot)
      wrapper.src = propertyFallbacksRoot[0].src
      fallbackAst.push(wrapper)
    }

    if (propertyFallbacksUniversal.length > 0) {
      let wrapper = rule('*, ::before, ::after, ::backdrop', propertyFallbacksUniversal)
      wrapper.src = propertyFallbacksUniversal[0].src
      fallbackAst.push(wrapper)
    }

    if (fallbackAst.length > 0) {
      // Insert an empty `@layer properties;` at the beginning of the document. We need to place it
      // after eventual external imports as `lightningcss` would otherwise move the content into the
      // same place.
      let firstValidNodeIndex = newAst.findIndex((node) => {
        // License comments
        if (node.kind === 'comment') return false

        if (node.kind === 'at-rule') {
          // Charset
          if (node.name === '@charset') return false

          // External imports
          if (node.name === '@import') return false
        }

        return true
      })

      let layerPropertiesStatement = atRule('@layer', 'properties', [])
      layerPropertiesStatement.src = fallbackAst[0].src

      newAst.splice(
        firstValidNodeIndex < 0 ? newAst.length : firstValidNodeIndex,
        0,
        layerPropertiesStatement,
      )

      let block = rule('@layer properties', [
        atRule(
          '@supports',
          // We can't write a supports query for `@property` directly so we have to test for
          // features that are added around the same time in Mozilla and Safari.
          '((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b))))',
          fallbackAst,
        ),
      ])

      block.src = fallbackAst[0].src
      block.nodes[0].src = fallbackAst[0].src

      newAst.push(block)
    }
  }

  return handleNesting(newAst)
}

export function handleNesting(ast: AstNode[]): AstNode[] {
  let parseSelectorCache = new DefaultMap(SelectorParser.parse)

  // Track `rule` selectors as we go
  let selectorStack: [
    selector: string,
    src: SourceLocation | undefined,
    dst: SourceLocation | undefined,
  ][] = []

  // Track `at-rule` information as we go. Tracking this separately from the
  // selector stack for rules such that we can hoist this above all the rules.
  let atRuleStack: [
    name: string,
    params: string,
    src: SourceLocation | undefined,
    dst: SourceLocation | undefined,
  ][] = []

  // The current "nodes" we can push to
  let nodes = null as AstNode[] | null

  // Optimization: Track the declaration properties we've seen in the current
  // nodes.
  let seenDeclarationProperties = new Set<string>()

  // Track nodes lists where we want to dedupe declarations
  let dedupeDeclarationsInNodes = new Set<AstNode[]>()

  // The final, new AST
  let result: AstNode[] = []

  // Track whether we should skip a node in the `exit` phase
  let skipExit = new Set<AstNode>()

  walk(ast, {
    enter(node) {
      switch (node.kind) {
        case 'rule': {
          nodes = null // Start a new level

          // First time we see a rule
          if (selectorStack.length === 0) {
            // A rule with a selector containing `&` should replace the `&` with
            // `:scope` if there is no parent rule.
            //
            // Note: there could be false positives when the `&` is escaped or
            // part of a string inside an attribute selector. But the
            // SelectorParser will take care of that.
            if (node.selector.includes('&')) {
              let ast = SelectorParser.parse(node.selector)
              let changed = false

              walk(ast, (node) => {
                if (node.kind === 'selector' && node.value === '&') {
                  changed = true
                  node.value = ':scope'
                }
              })

              if (changed) {
                selectorStack.push([SelectorParser.toCss(ast), node.src, node.dst])
              } else {
                selectorStack.push([node.selector, node.src, node.dst])
              }
            }

            // No nesting markers, track as-is
            else {
              selectorStack.push([node.selector, node.src, node.dst])
            }
          }

          // Nested rule, ensure `&` is present in each selector. Then track the
          // selector.
          else {
            // A rule with just `&` can be replaced by its children. Let's
            // ignore this node and keep walking its children.
            if (node.selector === '&') {
              skipExit.add(node)
              return
            }

            let lastSelector = selectorStack[selectorStack.length - 1][0]
            let selector = segment(node.selector, ',')
              .map((selector) => {
                // Fast path: we know there isn't an `&` so we can prepend the
                // parent selector immediately.
                if (!selector.includes('&')) {
                  let lastAst = parseSelectorCache.get(lastSelector)
                  return `${lastAst.length === 1 && lastAst[0].kind === 'list' ? `:is(${lastSelector})` : lastSelector} ${selector}`
                }

                // Slow path: we need to replace the `&` with the parent
                // selector. A simple `replaceAll(…)` won't work because a `&`
                // could be escaped, or could be part of an attribute selector.
                //
                // Much safer to parse the selector and replace the `&` that way
                {
                  let ast = SelectorParser.parse(selector)
                  let changed = false
                  walk(ast, {
                    enter(node, ctx) {
                      if (node.kind !== 'selector' || node.value !== '&') return

                      changed = true

                      // Safest option: use `is(…)` semantics when
                      // substituting `&` for the parent selector.
                      node.value = `:is(${lastSelector})`

                      // We should always have a parent, so this shouldn't happen
                      if (ctx.parent === null) return

                      // Optimizations:
                      let parentAst = parseSelectorCache.get(lastSelector)

                      // 1. If we're dealing with multiple selectors, then we
                      //    know that the `:is(…)` needs to stay. Nothing to optimize.
                      if (parentAst.length === 1 && parentAst[0].kind === 'list') {
                        return // Keep `:is(…)` semantics
                      }

                      // 2. We know that `&` is standalone when it's inside of
                      //    a complex selector. E.g. `[before] & [after]`
                      if (ctx.parent.kind === 'complex') {
                        // `& [after]`
                        //
                        // `:is(…)` semantics are not required, because these
                        // are equivalent:
                        //
                        // - `:is(div) [after]`       → `div [after]`
                        // - `:is(.x) [after]`        → `.x [after]`
                        // - `:is([before]) [after]`  → `[before] [after]`
                        // - `:is(.a > .b) [after]`   → `.a > .b [after]`
                        if (ctx.index === 0) {
                          node.value = lastSelector
                          return
                        }

                        // `[before] &`
                        //
                        // `:is(…)` semantics are required if we're dealing
                        // with a complex parent selector. Otherwise the
                        // meaning of the selector could change:
                        //
                        // - `[before] :is(div)`      → `[before] div`
                        // - `[before] :is(.x)`       → `[before] .x`
                        // - `[before] :is([after])`  → `[before] [after]`
                        // - `[before] :is(.a > .b)`  → `[before] :is(.a > .b)` (!)
                        else if (ctx.index === ctx.siblings.length - 1) {
                          if (parentAst[0].kind === 'complex') {
                            return // Keep `:is(…)` semantics
                          }

                          node.value = lastSelector
                          return
                        }

                        // `[before] & [after]`
                        //
                        // `:is(…)` semantics are required if we're dealing
                        // with a complex parent selector. Otherwise the
                        // meaning of the selector could change:
                        //
                        // - `[before] :is(div) [after]`      → `[before] div [after]`
                        // - `[before] :is(.x) [after]`       → `[before] .x [after]`
                        // - `[before] :is(.a > .b) [after]`  → `[before] :is(.a > .b) [after]` (!)
                        else {
                          if (parentAst[0].kind === 'complex') {
                            return // Keep `:is(…)` semantics
                          }

                          node.value = lastSelector
                          return
                        }
                      }

                      // 3. We know that `&` is attached to some other
                      //    selector when it's inside of a compound selector.
                      //
                      //    E.g. `[before]&[after]`
                      //
                      //    We have to be careful that our parent, when it's
                      //    part of a complex selector, that the same rules apply
                      //
                      //    E.g.: `[before] &[after]`
                      //                    ^          current node
                      //                    ^^^^^^^^   compound selector
                      //           ^^^^^^^^^^^^^^^^^   complex selector
                      //
                      else if (ctx.parent.kind === 'compound') {
                        if (parentAst[0].kind === 'complex') {
                          let path = ctx.path()
                          let grandParent = path[path.length - 2]

                          // When our compound parent is part of a complex
                          // selector, and it's not the very first node, then we
                          // can't safely get rid of the `:is(…)` if the last
                          // selector is a complex selector as well, unless the
                          // `&` maps to a single selector or compound selector.
                          //
                          // ```css
                          // .foo .bar {            /* Complex selector */
                          //   .system &:focus {    /* Complex selector + compound selecto*/
                          //     --x: 1;
                          //   }
                          // }
                          // .foo:hover {           /* Compound selector */
                          //   .system &:focus {    /* Complex selector + compound selector */
                          //     --x: 2;
                          //   }
                          // }
                          // ```
                          //
                          // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
                          //
                          // ```css
                          // .system :is(.foo .bar):focus { /* Cannot drop the `:is(…)`, otherwise `.system` and `.foo` can be swapped in the DOM */
                          //   --x: 1;
                          // }
                          // .system .foo:hover:focus {
                          //   --x: 2;
                          // }
                          // ```
                          if (
                            grandParent &&
                            grandParent.kind === 'complex' &&
                            grandParent.nodes[0] !== ctx.parent
                          ) {
                            return // Keep `:is(…)` semantics
                          }
                        }

                        // `&*` and `&div` are invalid CSS so these should stay
                        // invalid. They should be written as `*&` and `div&` instead.
                        if (
                          ctx.siblings
                            .slice(ctx.index + 1)
                            .some(
                              (sibling) =>
                                SelectorParser.isUniversalSelector(sibling) ||
                                SelectorParser.isTypeSelector(sibling),
                            )
                        ) {
                          return // Keep `:is(…)` semantics
                        }

                        // `&[after]`
                        //
                        // `:is(…)` semantics are not required, because these
                        // are equivalent:
                        //
                        // - `:is(div)[after]`       → `div[after]`
                        // - `:is(.x)[after]`        → `.x[after]`
                        // - `:is([before])[after]`  → `[before][after]`
                        // - `:is(.a > .b)[after]`   → `.a > .b[after]`
                        if (ctx.index === 0) {
                          node.value = lastSelector
                          return
                        }

                        // `[before]&`
                        //
                        // `:is(…)` semantics are required if we're dealing with a
                        //
                        // - complex parent selector, to prevent changing the meaning of the selector
                        // - a universal selector, because `*` needs to be first
                        // - a type selector, because `div` needs to be first
                        //
                        // - `[before]:is(div)`      → `[before]:is(div)` (!)
                        // - `[before]:is(*)`        → `[before]:is(*)` (!)
                        // - `[before]:is(.a > .b)`  → `[before]:is(.a > .b)` (!)
                        // - `[before]:is(.x)`       → `[before].x`
                        else if (ctx.index === ctx.siblings.length - 1) {
                          if (
                            parentAst[0].kind === 'complex' ||
                            SelectorParser.isUniversalSelector(parentAst[0]) ||
                            SelectorParser.isTypeSelector(parentAst[0])
                          ) {
                            return // Keep `:is(…)` semantics
                          }

                          node.value = lastSelector
                          return
                        }

                        // `[before]&[after]`
                        //
                        // `:is(…)` semantics are required if we're dealing with a
                        //
                        // - complex parent selector, to prevent changing the meaning of the selector
                        // - a universal selector, because `*` needs to be first
                        // - a type selector, because `div` needs to be first
                        //
                        // - `[before]:is(div)[after]`      → `[before]:is(div)[after]` (!)
                        // - `[before]:is(*)[after]`        → `[before]:is(*)[after]` (!)
                        // - `[before]:is(.a > .b)[after]`  → `[before]:is(.a > .b)[after]` (!)
                        // - `[before]:is(.x)[after]`       → `[before].x[after]`
                        else {
                          if (
                            parentAst[0].kind === 'complex' ||
                            SelectorParser.isUniversalSelector(parentAst[0]) ||
                            SelectorParser.isTypeSelector(parentAst[0])
                          ) {
                            return // Keep `:is(…)` semantics
                          }

                          node.value = lastSelector
                          return
                        }
                      }

                      // 4. When the current node is a function argument (e.g.
                      //    `:not(&))`, then we can drop the `:is(…)` entirely.
                      //
                      //    The only exception is when the parent has multiple
                      //    selectors because then we would introduce multiple
                      //    arguments. Multiple selectors are already handled.
                      else if (ctx.parent.kind === 'function') {
                        node.value = lastSelector
                        return
                      }
                    },
                    exit(node, ctx) {
                      // Optimization: We can remove the universal selector `*` if
                      // they are part of a compound selector. E.g.:
                      //
                      // - `*:hover` → `:hover`
                      // - `*[attribute]` → `[attribute]`
                      //
                      // Except when the `*` is a namespace, e.g.: `*|div`,
                      // because `*|div` (any namespace) and `|div` (no
                      // namespace) have different meanings.
                      if (
                        ctx.index === 0 &&
                        ctx.siblings.length > 1 &&
                        ctx.parent?.kind === 'compound' &&
                        SelectorParser.isUniversalSelector(node)
                      ) {
                        let next = ctx.siblings[1]
                        if (next.kind === 'selector' && next.value.charCodeAt(0) === PIPE) {
                          return
                        }
                        return WalkAction.ReplaceSkip([])
                      }
                    },
                  })

                  if (changed) {
                    return SelectorParser.toCss(ast)
                  }

                  // It could be that `&` was not found as an actual selector,
                  // in that case we still have to prepend the parent selector.
                  let lastAst = parseSelectorCache.get(lastSelector)
                  return `${lastAst.length === 1 && lastAst[0].kind === 'list' ? `:is(${lastSelector})` : lastSelector} ${selector}`
                }
              })
              .join(', ')
            selectorStack.push([selector, node.src, node.dst])
          }

          // Once we hit a rule that has at least one declaration, then we can
          // stop handling the nested selectors.
          //
          // This ensures that browser devtools can at least show _something_
          // for a given rule. This also means that we can leverage CSS nesting
          // which is better for gzip results due to increased repetition.
          //
          // E.g.:
          //
          // ```css
          // .a {
          //   &[b] {
          //     color: red;
          //     &:hover {
          //       color: blue;
          //     }
          //   }
          // }
          // ```
          //
          // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
          //
          // ```css
          // .a[b] {          /* ← flattened */
          //   color: red;    /* ← saw a declaration, therefore */
          //   &:hover {      /* ← we keep this nested syntax */
          //     color: blue;
          //   }
          // }
          // ```
          if (node.nodes.some((child) => child.kind === 'declaration')) {
            // Emitting each child instead of the node itself because we do want
            // to flatten the current node and its selector that is already
            // pushed to the stack.
            for (let child of node.nodes) emit(child)
            return WalkAction.Skip
          }
          break
        }

        case 'at-rule': {
          nodes = null // Start a new level

          // `@layer` is hoistable, but when it's empty then we have to make
          // sure that we still emit it because this might influence the layer
          // order. We can't just get rid of it.
          if (node.nodes.length === 0 && !DROPPABLE_IF_EMPTY_AT_RULES.has(node.name)) {
            emit(node)
            skipExit.add(node)
            return WalkAction.Skip
          }

          // Hoist at-rules
          else if (HOISTABLE_AT_RULES.has(node.name)) {
            atRuleStack.push([node.name, node.params, node.src, node.dst])
          }

          // If we can't hoist them, emit them immediately as-is
          else {
            emit(node)
            skipExit.add(node)
            return WalkAction.Skip
          }
          break
        }

        case 'declaration':
        case 'comment': {
          emit(node)
          break
        }

        case 'context':
        case 'at-root':
          break

        default:
          node satisfies never
          break
      }
    },
    exit(node) {
      if (skipExit.delete(node)) return

      switch (node.kind) {
        case 'rule': {
          nodes = null
          selectorStack.pop()
          break
        }

        case 'at-rule': {
          nodes = null
          atRuleStack.pop()
          break
        }

        case 'declaration':
        case 'comment':
        case 'context':
        case 'at-root':
          break

        default:
          node satisfies never
          break
      }
    },
  })

  // Dedupe declarations that we've already seen before if they match the
  // `property`, `value` and `important` information.
  {
    for (let nodes of dedupeDeclarationsInNodes) {
      let seen = new Set()
      for (let i = nodes.length - 1; i >= 0; --i) {
        let node = nodes[i]
        if (node.kind !== 'declaration') continue

        let id = `${node.property}\0${node.value}\0${node.important}`

        if (seen.has(id)) nodes.splice(i, 1)
        else seen.add(id)
      }
    }
  }

  return result

  function emit(node: AstNode) {
    // Existing nodes are available, emit into those nodes
    if (nodes) {
      // Optimization: track used declarations in the current node.
      if (node.kind === 'declaration') {
        if (seenDeclarationProperties.has(node.property)) {
          dedupeDeclarationsInNodes.add(nodes)
        } else {
          seenDeclarationProperties.add(node.property)
        }
      }

      nodes.push(node)
      return
    }

    // Nothing available, setup a fresh node
    {
      // There are no parent rules or at-rules available, which means that we
      // can emit the node as-is.
      if (selectorStack.length === 0 && atRuleStack.length === 0) {
        let target = result
        let lastNode = target[target.length - 1]

        // Optimization: when the current and last node are the same, ignore the
        // new node entirely otherwise we will get unnecessary duplicate
        // results.
        //
        // We only care about at-rules with no body because some of them (such
        // as `@charset` or `@layer`) need to be emitted. A normal rule that's
        // empty doesn't need to be emitted. At-rules _with_ a body (such as
        // `@font-face` or `@keyframes`) can share the same prelude while
        // containing different bodies, so they must all be emitted.
        if (
          lastNode &&
          lastNode.kind === 'at-rule' &&
          node.kind === 'at-rule' &&
          lastNode.nodes.length === 0 &&
          node.nodes.length === 0 &&
          lastNode.name === node.name &&
          lastNode.params === node.params
        ) {
          return
        }

        result.push(node)
        return
      }

      // Track the new "parent" nodes
      {
        nodes = [node]

        // Clear out seen declarations from the previous work in progress nodes
        seenDeclarationProperties.clear()

        // Track new declaration
        if (node.kind === 'declaration') {
          seenDeclarationProperties.add(node.property)
        }
      }

      // Track the new root node that we build up to store in the final AST
      let root = null as AstNode | null

      let target = result
      let atRuleOffset = 0

      // Optimization: merge adjacent at-rules
      //
      // Figure out whether we can push our new node into a previous node that
      // was already emitted.
      //
      // We have to make sure that the order stays the same, so therefore we
      // only ever have to look at the last node that was emitted.
      {
        let lastNode = target[target.length - 1]
        if (lastNode && lastNode.kind === 'at-rule') {
          for (let i = 0; i < atRuleStack.length; i++) {
            let atRule = atRuleStack[i]
            if (!lastNode) break
            if (lastNode.kind !== 'at-rule') break
            if (lastNode.name !== atRule[0]) break
            if (lastNode.params !== atRule[1]) break

            atRuleOffset++
            target = lastNode.nodes
            lastNode = lastNode.nodes[lastNode.nodes.length - 1]
          }
        }
      }

      // Build up the rule
      if (selectorStack.length > 0) {
        let [selector, src, dst] = selectorStack[selectorStack.length - 1]

        // Optimization: merge adjacent rules with the same selector
        //
        // Figure out whether we can push into an existing rule.
        //
        // If we have some at-rules that we have to keep into account, then we
        // definitely can't.
        if (atRuleStack.length - atRuleOffset <= 0) {
          let lastNode = target[target.length - 1]
          if (lastNode && lastNode.kind === 'rule' && lastNode.selector === selector) {
            lastNode.nodes.push(...nodes)

            // Ensure that our current nodes points to the nodes of the
            // `lastNode`, otherwise we will lose information.
            nodes = lastNode.nodes

            // We appended a group that could contain declarations already in the
            // existing rule, so let the final dedupe pass handle it once.
            //
            // Note: we could loop over _all_ previous nodes to figure out if we
            // really want to dedupe this. But this could result in a bunch of
            // duplicate work if we have `n` nodes that we want to merge
            // together.
            dedupeDeclarationsInNodes.add(nodes)

            // We know that we don't have to handle any more at-rules, so we can
            // bail early since we just merged the nodes with the same selector.
            return
          }
        }

        // Can't push into existing node, create a new node
        root = rule(selector, nodes)
        if (src || dst) Object.assign(root, { src, dst })
      }

      // Wrap in at-rules, if we can push into an existing node then we can
      // ignore `offset` amount of nodes since the `root`/`nodes` will already
      // point to a nested node.
      for (let i = atRuleStack.length - 1; i >= atRuleOffset; --i) {
        let [name, params, src, dst] = atRuleStack[i]

        root = atRule(name, params, root ? [root] : nodes)
        if (src || dst) Object.assign(root, { src, dst })
      }

      // Track the root node in the AST
      if (root) {
        target.push(root)
      }

      // We didn't build up any new root, so we can move our node directly into
      // the target. This can happen when we emit a node that is not a
      // declaration or a comment.
      else {
        target.push(...nodes)
      }
    }
  }
}

// A set of at-rules that can be hoisted to the top without any repercussions.
// Typically at-rules that rely on the environment, not parent information and
// contain other rules/declarations.
const HOISTABLE_AT_RULES = new Set([
  '@container',
  '@layer',
  '@media',
  '@page',
  '@starting-style',
  '@supports',
  '@view-transition',
])

// A set of at-rules that can be dropped if they don't contain any nodes. We
// don't have the distinction between an at-rule with no body, or an at-rule
// with a body that is empty right now.
const DROPPABLE_IF_EMPTY_AT_RULES = new Set([
  '@container',
  '@media',
  '@page',
  '@starting-style',
  '@supports',
  '@view-transition',
])

export function toCss(ast: AstNode[], track?: boolean) {
  let pos = 0

  let source: Source = {
    file: null,
    code: '',
  }

  function stringify(node: AstNode, depth = 0): string {
    let css = ''
    let indent = '  '.repeat(depth)

    // Declaration
    if (node.kind === 'declaration') {
      css += `${indent}${node.property}: ${node.value}${node.important ? ' !important' : ''};\n`

      if (track) {
        // indent
        pos += indent.length

        // node.property
        let start = pos
        pos += node.property.length

        // `: `
        pos += 2

        // node.value
        pos += node.value?.length ?? 0

        // !important
        if (node.important) {
          pos += 11
        }

        let end = pos

        // `;\n`
        pos += 2

        node.dst = [source, start, end]
      }
    }

    // Rule
    else if (node.kind === 'rule') {
      css += `${indent}${node.selector} {\n`

      if (track) {
        // indent
        pos += indent.length

        // node.selector
        let start = pos
        pos += node.selector.length

        // ` `
        pos += 1

        let end = pos
        node.dst = [source, start, end]

        // `{\n`
        pos += 2
      }

      for (let child of node.nodes) {
        css += stringify(child, depth + 1)
      }

      css += `${indent}}\n`

      if (track) {
        // indent
        pos += indent.length

        // `}\n`
        pos += 2
      }
    }

    // AtRule
    else if (node.kind === 'at-rule') {
      // Print at-rules without nodes with a `;` instead of an empty block.
      //
      // E.g.:
      //
      // ```css
      // @layer base, components, utilities;
      // ```
      if (node.nodes.length === 0) {
        let css = `${indent}${node.name} ${node.params};\n`

        if (track) {
          // indent
          pos += indent.length

          // node.name
          let start = pos
          pos += node.name.length

          // ` `
          pos += 1

          // node.params
          pos += node.params.length
          let end = pos

          // `;\n`
          pos += 2

          node.dst = [source, start, end]
        }

        return css
      }

      css += `${indent}${node.name}${node.params ? ` ${node.params} ` : ' '}{\n`

      if (track) {
        // indent
        pos += indent.length

        // node.name
        let start = pos
        pos += node.name.length

        if (node.params) {
          // ` `
          pos += 1

          // node.params
          pos += node.params.length
        }

        // ` `
        pos += 1

        let end = pos
        node.dst = [source, start, end]

        // `{\n`
        pos += 2
      }

      for (let child of node.nodes) {
        css += stringify(child, depth + 1)
      }

      css += `${indent}}\n`

      if (track) {
        // indent
        pos += indent.length

        // `}\n`
        pos += 2
      }
    }

    // Comment
    else if (node.kind === 'comment') {
      css += `${indent}/*${node.value}*/\n`

      if (track) {
        // indent
        pos += indent.length

        // The comment itself. We do this instead of just the inside because
        // it seems more useful to have the entire comment span tracked.
        let start = pos
        pos += 2 + node.value.length + 2
        let end = pos

        node.dst = [source, start, end]

        // `\n`
        pos += 1
      }
    }

    // These should've been handled already by `optimizeAst` which
    // means we can safely ignore them here. We return an empty string
    // immediately to signal that something went wrong.
    else if (node.kind === 'context' || node.kind === 'at-root') {
      return ''
    }

    // Unknown
    else {
      node satisfies never
    }

    return css
  }

  let css = ''

  for (let node of ast) {
    css += stringify(node, 0)
  }

  source.code = css

  return css
}

function findNode(ast: AstNode[], fn: (node: AstNode) => boolean): AstNode[] | null {
  let foundPath: AstNode[] = []
  walk(ast, (node, ctx) => {
    if (fn(node)) {
      foundPath = ctx.path()
      foundPath.push(node)
      return WalkAction.Stop
    }
  })
  return foundPath
}

// Find out if a variable is either used directly or if any of the variables that depend on it are
// used
function isVariableUsed(
  variable: string,
  theme: Theme,
  variableDependencies: Map<string, Set<string>>,
  alreadySeenVariables: Set<string> = new Set(),
): boolean {
  // Break recursions when visiting a variable twice
  if (alreadySeenVariables.has(variable)) {
    return true
  } else {
    alreadySeenVariables.add(variable)
  }

  let options = theme.getOptions(variable)
  if (options & (ThemeOptions.STATIC | ThemeOptions.USED)) {
    return true
  } else {
    let dependencies = variableDependencies.get(variable) ?? []
    for (let dependency of dependencies) {
      if (isVariableUsed(dependency, theme, variableDependencies, alreadySeenVariables)) {
        return true
      }
    }
  }

  return false
}

function extractKeyframeNames(value: string): string[] {
  return value.split(/[\s,]+/)
}
