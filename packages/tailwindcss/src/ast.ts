export type Rule = {
  kind: 'rule'
  selector: string
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
  context: Record<string, string>
  nodes: AstNode[]
}

export type AtRoot = {
  kind: 'at-root'
  nodes: AstNode[]
}

export type AstNode = Rule | Declaration | Comment | Context | AtRoot

export function rule(selector: string, nodes: AstNode[]): Rule {
  return {
    kind: 'rule',
    selector,
    nodes,
  }
}

export function decl(property: string, value: string | undefined): Declaration {
  return {
    kind: 'declaration',
    property,
    value,
    important: false,
  }
}

export function comment(value: string): Comment {
  return {
    kind: 'comment',
    value: value,
  }
}

export function context(context: Record<string, string>, nodes: AstNode[]): Context {
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

export enum WalkAction {
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
      context: Record<string, string>
    },
  ) => void | WalkAction,
  parent: AstNode | null = null,
  context: Record<string, string> = {},
) {
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]

    // We want context nodes to be transparent in walks. This means that
    // whenever we encounter one, we immediately walk through its children and
    // furthermore we also don't update the parent.
    if (node.kind === 'context') {
      walk(node.nodes, visit, parent, { ...context, ...node.context })
      continue
    }

    let status =
      visit(node, {
        parent,
        replaceWith(newNode) {
          ast.splice(i, 1, ...(Array.isArray(newNode) ? newNode : [newNode]))
          // We want to visit the newly replaced node(s), which start at the
          // current index (i). By decrementing the index here, the next loop
          // will process this position (containing the replaced node) again.
          i--
        },
        context,
      }) ?? WalkAction.Continue

    // Stop the walk entirely
    if (status === WalkAction.Stop) return

    // Skip visiting the children of this node
    if (status === WalkAction.Skip) continue

    if (node.kind === 'rule') {
      walk(node.nodes, visit, node, context)
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
      context: Record<string, string>
      replaceWith(newNode: AstNode[]): void
    },
  ) => void,
  parentPath: AstNode[] = [],
  context: Record<string, string> = {},
) {
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
    let path = [...parentPath, node]
    let parent = parentPath.at(-1) ?? null

    if (node.kind === 'rule') {
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

export function toCss(ast: AstNode[]) {
  let atRoots: string = ''
  let seenAtProperties = new Set<string>()
  let propertyFallbacksRoot: Declaration[] = []
  let propertyFallbacksUniversal: Declaration[] = []

  function stringify(node: AstNode, depth = 0): string {
    let css = ''
    let indent = '  '.repeat(depth)

    // Rule
    if (node.kind === 'rule') {
      if (node.selector === '@tailwind utilities') {
        for (let child of node.nodes) {
          css += stringify(child, depth)
        }
        return css
      }

      // Print at-rules without nodes with a `;` instead of an empty block.
      //
      // E.g.:
      //
      // ```css
      // @layer base, components, utilities;
      // ```
      if (node.selector[0] === '@' && node.nodes.length === 0) {
        return `${indent}${node.selector};\n`
      }

      if (node.selector[0] === '@' && node.selector.startsWith('@property ') && depth === 0) {
        // Don't output duplicate `@property` rules
        if (seenAtProperties.has(node.selector)) {
          return ''
        }

        // Collect fallbacks for `@property` rules for Firefox support
        // We turn these into rules on `:root` or `*` and some pseudo-elements
        // based on the value of `inherits``
        let property = node.selector.replace(/@property\s*/g, '')
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

        seenAtProperties.add(node.selector)
      }

      css += `${indent}${node.selector} {\n`
      for (let child of node.nodes) {
        css += stringify(child, depth + 1)
      }
      css += `${indent}}\n`
    }

    // Comment
    else if (node.kind === 'comment') {
      css += `${indent}/*${node.value}*/\n`
    }

    // Context Node
    else if (node.kind === 'context') {
      for (let child of node.nodes) {
        css += stringify(child, depth)
      }
    }

    // AtRoot Node
    else if (node.kind === 'at-root') {
      for (let child of node.nodes) {
        atRoots += stringify(child, 0)
      }
      return css
    }

    // Declaration
    else if (node.property !== '--tw-sort' && node.value !== undefined && node.value !== null) {
      css += `${indent}${node.property}: ${node.value}${node.important ? ' !important' : ''};\n`
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

  let fallbackAst = []

  if (propertyFallbacksRoot.length) {
    fallbackAst.push(rule(':root', propertyFallbacksRoot))
  }

  if (propertyFallbacksUniversal.length) {
    fallbackAst.push(rule('*, ::before, ::after, ::backdrop', propertyFallbacksUniversal))
  }

  let fallback = ''

  if (fallbackAst.length) {
    fallback = stringify(
      rule('@supports (-moz-orient: inline)', [rule('@layer base', fallbackAst)]),
    )
  }

  return `${css}${fallback}${atRoots}`
}
