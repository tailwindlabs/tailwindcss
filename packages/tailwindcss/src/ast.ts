import { Polyfills } from '.'
import { parseAtRule } from './css-parser'
import type { DesignSystem } from './design-system'
import { Theme, ThemeOptions } from './theme'
import { DefaultMap } from './utils/default-map'
import { extractUsedVariables } from './utils/variables'
import * as ValueParser from './value-parser'

const AT_SIGN = 0x40

export type StyleRule = {
  kind: 'rule'
  selector: string
  nodes: AstNode[]
}

export type AtRule = {
  kind: 'at-rule'
  name: string
  params: string
  nodes: AstNode[]
}

export type Declaration = {
  kind: 'declaration'
  property: string
  value: string | undefined
  important: boolean
}

export type Comment = {
  kind: 'comment'
  value: string
}

export type Context = {
  kind: 'context'
  context: Record<string, string | boolean>
  nodes: AstNode[]
}

export type AtRoot = {
  kind: 'at-root'
  nodes: AstNode[]
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
      // Rules with `&` as the selector should be flattened
      if (node.selector === '&') {
        for (let child of node.nodes) {
          let nodes: AstNode[] = []
          transform(child, nodes, context, depth + 1)
          if (nodes.length > 0) {
            parent.push(...nodes)
          }
        }
      }

      //
      else {
        let copy = { ...node, nodes: [] }
        for (let child of node.nodes) {
          transform(child, copy.nodes, context, depth + 1)
        }
        if (copy.nodes.length > 0) {
          parent.push(copy)
        }
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

        if (inherits) {
          propertyFallbacksRoot.push(decl(property, initialValue ?? 'initial'))
        } else {
          propertyFallbacksUniversal.push(decl(property, initialValue ?? 'initial'))
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
        let colorMixQuery = rule('@supports (color: color-mix(in lab, red, red))', [declaration])
        parent.splice(idx, 1, fallback, colorMixQuery)
      }
    }
  }

  if (polyfills & Polyfills.AtProperty) {
    let fallbackAst = []

    if (propertyFallbacksRoot.length > 0) {
      fallbackAst.push(rule(':root, :host', propertyFallbacksRoot))
    }

    if (propertyFallbacksUniversal.length > 0) {
      fallbackAst.push(rule('*, ::before, ::after, ::backdrop', propertyFallbacksUniversal))
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

      newAst.splice(
        firstValidNodeIndex < 0 ? newAst.length : firstValidNodeIndex,
        0,
        atRule('@layer', 'properties', []),
      )

      newAst.push(
        rule('@layer properties', [
          atRule(
            '@supports',
            // We can't write a supports query for `@property` directly so we have to test for
            // features that are added around the same time in Mozilla and Safari.
            '((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b))))',
            fallbackAst,
          ),
        ]),
      )
    }
  }

  return newAst
}

export function toCss(ast: AstNode[]) {
  function stringify(node: AstNode, depth = 0): string {
    let css = ''
    let indent = '  '.repeat(depth)

    // Declaration
    if (node.kind === 'declaration') {
      css += `${indent}${node.property}: ${node.value}${node.important ? ' !important' : ''};\n`
    }

    // Rule
    else if (node.kind === 'rule') {
      css += `${indent}${node.selector} {\n`
      for (let child of node.nodes) {
        css += stringify(child, depth + 1)
      }
      css += `${indent}}\n`
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
        return `${indent}${node.name} ${node.params};\n`
      }

      css += `${indent}${node.name}${node.params ? ` ${node.params} ` : ' '}{\n`
      for (let child of node.nodes) {
        css += stringify(child, depth + 1)
      }
      css += `${indent}}\n`
    }

    // Comment
    else if (node.kind === 'comment') {
      css += `${indent}/*${node.value}*/\n`
    }

    // These should've been handled already by `prepareAstForPrinting` which
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
    let result = stringify(node)
    if (result !== '') {
      css += result
    }
  }

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
