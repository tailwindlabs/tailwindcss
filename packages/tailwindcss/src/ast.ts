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
  return ast
    .map(function stringify(node: AstNode): string {
      let css = ''

      // Rule
      if (node.kind === 'rule') {
        // Pull out `@at-root` rules to append later
        if (node.selector === '@at-root') {
          for (let child of node.nodes) {
            atRoots.push(stringify(child))
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
          return `${node.selector};`
        }

        css += `${node.selector}{`
        for (let child of node.nodes) {
          css += stringify(child)
        }
        css += '}'
      }

      // Comment
      else if (node.kind === 'comment') {
        css += `/*${node.value}*/\n`
      }

      // Declaration
      else if (node.property !== '--tw-sort' && node.value !== undefined && node.value !== null) {
        css += `${node.property}:${node.value}${node.important ? '!important' : ''};`
      }

      return css
    })
    .concat(atRoots)
    .join('\n')
}
