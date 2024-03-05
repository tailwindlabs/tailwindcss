export type Rule = {
  kind: 'rule'
  selector: string
  nodes: AstNode[]
}

export type Declaration = {
  kind: 'declaration'
  property: string
  value: string
  important: boolean
}

export type Comment = {
  kind: 'comment'
  value: string
}

export type AstNode = Rule | Declaration | Comment

export function rule(selector: string, nodes: AstNode[]): Rule {
  return {
    kind: 'rule',
    selector,
    nodes,
  }
}

export function decl(property: string, value: string): Declaration {
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

export function walk(
  ast: AstNode[],
  visit: (
    node: AstNode,
    utils: {
      replaceWith(newNode: AstNode | AstNode[]): void
    },
  ) => void | false,
) {
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
    let shouldContinue = visit(node, {
      replaceWith(newNode) {
        ast.splice(i, 1, ...(Array.isArray(newNode) ? newNode : [newNode]))
        // We want to visit the newly replaced node(s), which start at the current
        // index (i). By decrementing the index here, the next loop will process
        // this position (containing the replaced node) again.
        i--
      },
    })

    if (shouldContinue === false) return

    if (node.kind === 'rule') {
      walk(node.nodes, visit)
    }
  }
}

export function toCss(ast: AstNode[]) {
  let atRoots: string[] = []

  let seenAtProperties = new Set<string>()

  function stringify(node: AstNode, depth = 0): string {
    let css = ''
    let indent = '  '.repeat(depth)

    // Rule
    if (node.kind === 'rule') {
      // Pull out `@at-root` rules to append later
      if (node.selector === '@at-root') {
        for (let child of node.nodes) {
          atRoots.push(stringify(child, 0))
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

    // Declaration
    else if (node.property !== '--tw-sort' && node.value !== undefined && node.value !== null) {
      css += `${indent}${node.property}: ${node.value}${node.important ? '!important' : ''};\n`
    }

    return css
  }

  return ast
    .map((node) => stringify(node))
    .concat(atRoots)
    .join('')
}
