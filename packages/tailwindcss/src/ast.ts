import { parseAtRule } from './css-parser'

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
  parentPath: AstNode[] = [],
  context: Record<string, string | boolean> = {},
) {
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
    let path = [...parentPath, node]
    let parent = parentPath.at(-1) ?? null

    // We want context nodes to be transparent in walks. This means that
    // whenever we encounter one, we immediately walk through its children and
    // furthermore we also don't update the parent.
    if (node.kind === 'context') {
      if (
        walk(node.nodes, visit, parentPath, { ...context, ...node.context }) === WalkAction.Stop
      ) {
        return WalkAction.Stop
      }
      continue
    }

    let status =
      visit(node, {
        parent,
        context,
        path,
        replaceWith(newNode) {
          ast.splice(i, 1, ...(Array.isArray(newNode) ? newNode : [newNode]))
          // We want to visit the newly replaced node(s), which start at the
          // current index (i). By decrementing the index here, the next loop
          // will process this position (containing the replaced node) again.
          i--
        },
      }) ?? WalkAction.Continue

    // Stop the walk entirely
    if (status === WalkAction.Stop) return WalkAction.Stop

    // Skip visiting the children of this node
    if (status === WalkAction.Skip) continue

    if (node.kind === 'rule' || node.kind === 'at-rule') {
      if (walk(node.nodes, visit, path, context) === WalkAction.Stop) {
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
  parentPath: AstNode[] = [],
  context: Record<string, string | boolean> = {},
) {
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
    let path = [...parentPath, node]
    let parent = parentPath.at(-1) ?? null

    if (node.kind === 'rule' || node.kind === 'at-rule') {
      walkDepth(node.nodes, visit, path, context)
    } else if (node.kind === 'context') {
      walkDepth(node.nodes, visit, parentPath, { ...context, ...node.context })
      continue
    }

    visit(node, {
      parent,
      context,
      path,
      replaceWith(newNode) {
        ast.splice(i, 1, ...newNode)

        // Skip over the newly inserted nodes (being depth-first it doesn't make sense to visit them)
        i += newNode.length - 1
      },
    })
  }
}

// Optimize the AST for printing where all the special nodes that require custom
// handling are handled such that the printing is a 1-to-1 transformation.
export function optimizeAst(ast: AstNode[]) {
  let atRoots: AstNode[] = []
  let seenAtProperties = new Set<string>()
  let propertyFallbacksRoot: Declaration[] = []
  let propertyFallbacksUniversal: Declaration[] = []

  function transform(
    node: AstNode,
    parent: Extract<AstNode, { nodes: AstNode[] }>['nodes'],
    depth = 0,
  ) {
    // Declaration
    if (node.kind === 'declaration') {
      if (node.property === '--tw-sort' || node.value === undefined || node.value === null) {
        return
      }
      parent.push(node)
    }

    // Rule
    else if (node.kind === 'rule') {
      let copy = { ...node, nodes: [] }
      for (let child of node.nodes) {
        transform(child, copy.nodes, depth + 1)
      }
      parent.push(copy)
    }

    // AtRule `@property`
    else if (node.kind === 'at-rule' && node.name === '@property' && depth === 0) {
      // Don't output duplicate `@property` rules
      if (seenAtProperties.has(node.params)) {
        return
      }

      // Collect fallbacks for `@property` rules for Firefox support
      // We turn these into rules on `:root` or `*` and some pseudo-elements
      // based on the value of `inherits``
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

      seenAtProperties.add(node.params)

      let copy = { ...node, nodes: [] }
      for (let child of node.nodes) {
        transform(child, copy.nodes, depth + 1)
      }
      parent.push(copy)
    }

    // AtRule
    else if (node.kind === 'at-rule') {
      let copy = { ...node, nodes: [] }
      for (let child of node.nodes) {
        transform(child, copy.nodes, depth + 1)
      }
      parent.push(copy)
    }

    // AtRoot
    else if (node.kind === 'at-root') {
      for (let child of node.nodes) {
        let newParent: AstNode[] = []
        transform(child, newParent, 0)
        for (let child of newParent) {
          atRoots.push(child)
        }
      }
    }

    // Context
    else if (node.kind === 'context') {
      for (let child of node.nodes) {
        transform(child, parent, depth)
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
    transform(node, newAst, 0)
  }

  // Fallbacks
  {
    let fallbackAst = []

    if (propertyFallbacksRoot.length > 0) {
      fallbackAst.push(rule(':root', propertyFallbacksRoot))
    }

    if (propertyFallbacksUniversal.length > 0) {
      fallbackAst.push(rule('*, ::before, ::after, ::backdrop', propertyFallbacksUniversal))
    }

    if (fallbackAst.length > 0) {
      newAst.push(
        atRule('@supports', '(-moz-orient: inline)', [atRule('@layer', 'base', fallbackAst)]),
      )
    }
  }

  return newAst.concat(atRoots)
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
