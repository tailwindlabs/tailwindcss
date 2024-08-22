export type WordNode = {
  kind: 'word'
  value: string
}

export type FunctionNode = {
  kind: 'function'
  value: string
  nodes: AstNode[]
}

export type SeparatorNode = {
  kind: 'separator'
  value: string
}

export type AstNode = WordNode | FunctionNode | SeparatorNode

export function word(value: string): WordNode {
  return {
    kind: 'word',
    value,
  }
}

export function fun(value: string, nodes: AstNode[]): FunctionNode {
  return {
    kind: 'function',
    value: value,
    nodes,
  }
}

export function separator(value: string): SeparatorNode {
  return {
    kind: 'separator',
    value,
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
    },
  ) => void | WalkAction,
  parent: AstNode | null = null,
) {
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
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
      }) ?? WalkAction.Continue

    // Stop the walk entirely
    if (status === WalkAction.Stop) return

    // Skip visiting the children of this node
    if (status === WalkAction.Skip) continue

    if (node.kind === 'function') {
      walk(node.nodes, visit, node)
    }
  }
}

export function toCss(ast: AstNode[]) {
  let css = ''
  for (const node of ast) {
    switch (node.kind) {
      case 'word':
      case 'separator': {
        css += node.value
        break
      }
      case 'function': {
        css += node.value + '(' + toCss(node.nodes) + ')'
      }
    }
  }
  return css
}
