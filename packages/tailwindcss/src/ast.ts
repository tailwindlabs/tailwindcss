import { Polyfills } from '.'
import { parseAtRule } from './css-parser'
import type { DesignSystem } from './design-system'
import type { Source, SourceLocation } from './source-maps/source'
import { Theme, ThemeOptions } from './theme'
import { DefaultMap } from './utils/default-map'
import { segment } from './utils/segment'
import { extractUsedVariables } from './utils/variables'
import * as ValueParser from './value-parser'

const AT_SIGN = 0x40

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

export const enum WalkAction {
  /** Continue walking, which is the default */
  Continue,

  /** Skip visiting the children of this node */
  Skip,

  /** Stop the walk entirely */
  Stop,
}

export function walk(
  ast: AstNode[],
  visit: (
    node: AstNode,
    utils: {
      parent: AstNode | null
      replaceWith(newNode: AstNode | AstNode[]): void
      context: Record<string, string | boolean>
      path: AstNode[]
    },
  ) => void | WalkAction,
  path: AstNode[] = [],
  context: Record<string, string | boolean> = {},
) {
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
    let parent = path[path.length - 1] ?? null

    // We want context nodes to be transparent in walks. This means that
    // whenever we encounter one, we immediately walk through its children and
    // furthermore we also don't update the parent.
    if (node.kind === 'context') {
      if (walk(node.nodes, visit, path, { ...context, ...node.context }) === WalkAction.Stop) {
        return WalkAction.Stop
      }
      continue
    }

    path.push(node)
    let replacedNode = false
    let replacedNodeOffset = 0
    let status =
      visit(node, {
        parent,
        context,
        path,
        replaceWith(newNode) {
          if (replacedNode) return
          replacedNode = true

          if (Array.isArray(newNode)) {
            if (newNode.length === 0) {
              ast.splice(i, 1)
              replacedNodeOffset = 0
            } else if (newNode.length === 1) {
              ast[i] = newNode[0]
              replacedNodeOffset = 1
            } else {
              ast.splice(i, 1, ...newNode)
              replacedNodeOffset = newNode.length
            }
          } else {
            ast[i] = newNode
            replacedNodeOffset = 1
          }
        },
      }) ?? WalkAction.Continue
    path.pop()

    // We want to visit or skip the newly replaced node(s), which start at the
    // current index (i). By decrementing the index here, the next loop will
    // process this position (containing the replaced node) again.
    if (replacedNode) {
      if (status === WalkAction.Continue) {
        i--
      } else {
        i += replacedNodeOffset - 1
      }
      continue
    }

    // Stop the walk entirely
    if (status === WalkAction.Stop) return WalkAction.Stop

    // Skip visiting the children of this node
    if (status === WalkAction.Skip) continue

    if ('nodes' in node) {
      path.push(node)
      let result = walk(node.nodes, visit, path, context)
      path.pop()

      if (result === WalkAction.Stop) {
        return WalkAction.Stop
      }
    }
  }
}

// This is a depth-first traversal of the AST
export function walkDepth(
  ast: AstNode[],
  visit: (
    node: AstNode,
    utils: {
      parent: AstNode | null
      path: AstNode[]
      context: Record<string, string | boolean>
      replaceWith(newNode: AstNode[]): void
    },
  ) => void,
  path: AstNode[] = [],
  context: Record<string, string | boolean> = {},
) {
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
    let parent = path[path.length - 1] ?? null

    if (node.kind === 'rule' || node.kind === 'at-rule') {
      path.push(node)
      walkDepth(node.nodes, visit, path, context)
      path.pop()
    } else if (node.kind === 'context') {
      walkDepth(node.nodes, visit, path, { ...context, ...node.context })
      continue
    }

    path.push(node)
    visit(node, {
      parent,
      context,
      path,
      replaceWith(newNode) {
        if (Array.isArray(newNode)) {
          if (newNode.length === 0) {
            ast.splice(i, 1)
          } else if (newNode.length === 1) {
            ast[i] = newNode[0]
          } else {
            ast.splice(i, 1, ...newNode)
          }
        } else {
          ast[i] = newNode
        }

        // Skip over the newly inserted nodes (being depth-first it doesn't make sense to visit them)
        i += newNode.length - 1
      },
    })
    path.pop()
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
        for (let keyframeName of extractKeyframeNames(node.value))
          usedKeyframeNames.add(keyframeName)
      }

      // Create fallback values for usages of the `color-mix(…)` function that reference variables
      // found in the theme config.
      if (polyfills & Polyfills.ColorMix && node.value.includes('color-mix(')) {
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

      // Keep the last decl when there are exact duplicates. Keeping the *first* one might
      // not be correct when given nested rules where a rule sits between declarations.
      let seen: Record<string, AstNode[]> = {}
      let toRemove = new Set<AstNode>()

      // Keep track of all nodes that produce a given declaration
      for (let child of nodes) {
        if (child.kind !== 'declaration') continue

        let key = `${child.property}:${child.value}:${child.important}`
        seen[key] ??= []
        seen[key].push(child)
      }

      // And remove all but the last of each
      for (let key in seen) {
        for (let i = 0; i < seen[key].length - 1; ++i) {
          toRemove.add(seen[key][i])
        }
      }

      if (toRemove.size > 0) {
        nodes = nodes.filter((node) => !toRemove.has(node))
      }

      if (nodes.length === 0) return

      // Rules with `&` as the selector should be flattened
      if (node.selector === '&') {
        parent.push(...nodes)
      } else {
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
        copy.name === '@import'
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
        ValueParser.walk(ast, (node, { replaceWith }) => {
          if (node.kind !== 'function' || node.value !== 'color-mix') return

          let containsUnresolvableVars = false
          let containsCurrentcolor = false
          ValueParser.walk(node.nodes, (node, { replaceWith }) => {
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

            replaceWith({ kind: 'word', value: inlinedColor })
          })

          if (containsUnresolvableVars || containsCurrentcolor) {
            let separatorIndex = node.nodes.findIndex(
              (node) => node.kind === 'separator' && node.value.trim().includes(','),
            )
            if (separatorIndex === -1) return
            let firstColorValue =
              node.nodes.length > separatorIndex ? node.nodes[separatorIndex + 1] : null
            if (!firstColorValue) return
            replaceWith(firstColorValue)
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
        let colorMixQuery = rule('@supports (color: color-mix(in lab, red, red))', [
          // Keep the original declaration behind a `@supports` rule and ensure
          // it remains scoped to the current selector by wrapping it in `&`.
          rule('&', [declaration]),
        ])
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

  // Flatten nested style-rule selectors globally so stringify produces
  // standards-compliant CSS without nesting. This must run after we insert
  // polyfills that depend on the original parent/child arrays created during
  // transformation, otherwise we would be mutating stale arrays.
  newAst = flattenAst(newAst)

  return newAst
}

export function flattenAst(ast: AstNode[]): AstNode[] {
  function splitSelectors(sel: string): string[] {
    return segment(sel, ',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  function isRelative(child: string): boolean {
    let s = child.trim()
    return s.startsWith('>') || s.startsWith('+') || s.startsWith('~')
  }

  function normalizeSpaces(s: string): string {
    return s.replace(/\s+/g, ' ').trim()
  }

  function normalizePseudoElements(s: string): string {
    // Move known pseudo-elements to the end of the last compound selector
    let parts = s.split(/(\s*[>+~]\s*)/)
    let last = parts[parts.length - 1]
    let pseudos: string[] = []
    last = last.replace(
      /:{1,2}(before|after|first-letter|first-line|marker|backdrop|details-content)\b/g,
      (m) => {
        pseudos.push(m)
        return ''
      },
    )
    if (pseudos.length > 0) parts[parts.length - 1] = `${last}${pseudos.join('')}`
    return parts.join('')
  }

  function combine(parentList: string[] | null, childList: string[]): string[] {
    if (!parentList || parentList.length === 0) return childList.map(normalizeSpaces)

    let out: string[] = []
    for (let p of parentList) {
      for (let c of childList) {
        let combined: string
        if (c.includes('&')) {
          combined = normalizeSpaces(c.replaceAll('&', p))
        } else if (isRelative(c)) {
          combined = normalizeSpaces(`${p} ${c}`)
        } else {
          combined = normalizeSpaces(`${p} ${c}`)
        }
        out.push(normalizePseudoElements(combined))
      }
    }
    return out
  }

  function flatten(nodes: AstNode[], parentSelectors: string[] | null): AstNode[] {
    let result: AstNode[] = []

    for (let node of nodes) {
      if (node.kind === 'rule') {
        let selfList = splitSelectors(node.selector)
        let current = parentSelectors
          ? combine(parentSelectors, selfList)
          : selfList.map(normalizeSpaces)

        let bufferDecls: AstNode[] = []
        let flush = () => {
          if (bufferDecls.length === 0) return
          for (let sel of current) {
            result.push({
              kind: 'rule',
              selector: normalizePseudoElements(sel),
              nodes: bufferDecls.slice(),
            })
          }
          bufferDecls = []
        }

        for (let child of node.nodes) {
          if (child.kind === 'declaration' || child.kind === 'comment') {
            bufferDecls.push(child)
            continue
          }

          // We hit a nested block; flush accumulated decls first to preserve order
          flush()

          if (child.kind === 'rule') {
            result.push(...flatten([child], current))
          } else if (child.kind === 'at-rule') {
            // Ensure declarations inside nested at-rules remain scoped to the
            // current selector by first wrapping them in a synthetic rule and
            // then flattening. This prevents emitting invalid CSS like
            // `@media{ color:red }` without a selector.
            let inner = flatten([styleRule('&', child.nodes)], current)
            if (
              inner.length > 0 ||
              child.name === '@layer' ||
              child.name === '@charset' ||
              child.name === '@custom-media' ||
              child.name === '@namespace' ||
              child.name === '@import'
            ) {
              result.push({ ...child, nodes: inner })
            }
          }
        }

        // Flush remaining decls after processing nested children
        flush()
      } else if (node.kind === 'at-rule') {
        let inner = flatten(node.nodes, parentSelectors)
        if (
          inner.length > 0 ||
          node.name === '@layer' ||
          node.name === '@charset' ||
          node.name === '@custom-media' ||
          node.name === '@namespace' ||
          node.name === '@import'
        ) {
          result.push({ ...node, nodes: inner })
        }
      } else {
        result.push(node)
      }
    }

    return result
  }

  function dedupeDecls(nodes: AstNode[]): AstNode[] {
    let seen = new Set<string>()
    let out: AstNode[] = []
    for (let n of nodes) {
      if (n.kind !== 'declaration') {
        out.push(n)
        continue
      }
      let key = `${n.property}\u0001${n.value ?? ''}\u0001${n.important ? '!' : ''}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push(n)
    }
    return out
  }

  function mergeRules(nodes: AstNode[]): AstNode[] {
    let result: AstNode[] = []
    // Only merge rules within contiguous segments so we don't reorder
    // content across at-rule boundaries (e.g. keep rules before/after
    // an intervening @supports or @media block separate).
    let bySelector = new Map<string, StyleRule>()

    for (let node of nodes) {
      if (node.kind === 'rule') {
        let existing = bySelector.get(node.selector)
        if (existing) {
          existing.nodes = dedupeDecls(existing.nodes.concat(node.nodes))
          continue
        }
        let copy: StyleRule = { ...node, nodes: dedupeDecls(node.nodes.slice()) }
        bySelector.set(copy.selector, copy)
        result.push(copy)
      } else if (node.kind === 'at-rule') {
        let mergedChildren = mergeRules(node.nodes)
        result.push({ ...node, nodes: mergedChildren })
        // Reset the merge cache across at-rule boundaries to preserve
        // ordering of selectors before/after the block.
        bySelector = new Map()
      } else {
        result.push(node)
      }
    }

    return result
  }

  function canRecombine(nodes: AstNode[]): boolean {
    for (let n of nodes) {
      if (n.kind !== 'declaration' && n.kind !== 'comment') return false
    }
    return true
  }

  function fingerprint(nodes: AstNode[]): string | null {
    if (!canRecombine(nodes)) return null
    let parts: string[] = []
    for (let n of nodes) {
      if (n.kind === 'declaration') {
        parts.push(`d\u0001${n.property}\u0001${n.value ?? ''}\u0001${n.important ? '!' : ''}`)
      } else if (n.kind === 'comment') {
        parts.push(`c\u0001${n.value}`)
      }
    }
    return parts.join('\u0002')
  }

  function recombineAdjacentRules(nodes: AstNode[]): AstNode[] {
    let out: AstNode[] = []
    for (let node of nodes) {
      if (node.kind === 'at-rule') {
        let mergedChildren = recombineAdjacentRules(node.nodes)

        // Merge adjacent conditional at-rules with identical name/params
        // to reduce duplication like:
        //   @media foo { … }
        //   @media foo { … }
        // becomes:
        //   @media foo { … … }
        function canMergeAtRule(name: string) {
          return name === '@media' || name === '@supports' || name === '@container'
        }

        if (
          out.length > 0 &&
          out[out.length - 1].kind === 'at-rule' &&
          (out[out.length - 1] as AtRule).name === node.name &&
          (out[out.length - 1] as AtRule).params === node.params &&
          canMergeAtRule(node.name)
        ) {
          let prev = out[out.length - 1] as AtRule
          prev.nodes = recombineAdjacentRules(prev.nodes.concat(mergedChildren))
          continue
        }

        out.push({ ...node, nodes: mergedChildren })
        continue
      }

      if (node.kind !== 'rule') {
        out.push(node)
        continue
      }

      let fp = fingerprint(node.nodes)
      if (
        fp &&
        out.length > 0 &&
        out[out.length - 1].kind === 'rule' &&
        fingerprint((out[out.length - 1] as StyleRule).nodes) === fp
      ) {
        let prev = out[out.length - 1] as StyleRule
        prev.selector = `${prev.selector}, ${node.selector}`
        continue
      }

      out.push(node)
    }
    return out
  }

  let flattened = flatten(ast, null)
  let merged = mergeRules(flattened)
  let recombined = recombineAdjacentRules(merged)
  return recombined
}

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
  walk(ast, (node, { path }) => {
    if (fn(node)) {
      foundPath = [...path]
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
