export type Location = {
  line: number
  column: number
}

export type Range = {
  start: Location
  end: Location
}

export type Rule = {
  kind: 'rule'
  selector: string
  nodes: AstNode[]
  source: Range[]
  destination: Range[]
}

export type Declaration = {
  kind: 'declaration'
  property: string
  value: string
  important: boolean
  source: Range[]
  destination: Range[]
}

export type Comment = {
  kind: 'comment'
  value: string
  source: Range[]
  destination: Range[]
}

export type AstNode = Rule | Declaration | Comment

export function rule(selector: string, nodes: AstNode[], source: Range[] = []): Rule {
  return {
    kind: 'rule',
    selector,
    nodes,
    source,
    destination: [],
  }
}

export function decl(property: string, value: string, source: Range[] = []): Declaration {
  return {
    kind: 'declaration',
    property,
    value,
    important: false,
    source,
    destination: [],
  }
}

export function comment(value: string, source: Range[] = []): Comment {
  return {
    kind: 'comment',
    value: value,
    source,
    destination: [],
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
      replaceWith(newNode: AstNode | AstNode[]): void
    },
  ) => void | WalkAction,
) {
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
    let status =
      visit(node, {
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

    if (node.kind === 'rule') {
      walk(node.nodes, visit)
    }
  }
}

export function toCss(ast: AstNode[], track?: boolean) {
  let atRoots: AstNode[] = []
  let seenAtProperties = new Set<string>()

  function stringifyAll(nodes: AstNode[], location: Location): string {
    let css = ''
    for (let child of nodes) {
      css += stringify(child, location, 0)
    }
    return css
  }

  function stringify(node: AstNode, location: Location, depth: number): string {
    let indent = '  '.repeat(depth)

    // Rule
    if (node.kind === 'rule') {
      // Pull out `@at-root` rules to append later
      if (node.selector === '@at-root') {
        for (let child of node.nodes) {
          atRoots.push(child)
        }
        return ''
      }

      if (node.selector === '@tailwind utilities') {
        let css = ''

        for (let child of node.nodes) {
          css += stringify(child, location, depth)
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
        node.destination = track
          ? [
              {
                start: { line: location.line, column: indent.length },
                end: { line: location.line, column: indent.length },
              },
            ]
          : []
        if (track) location.line += 1
        return `${indent}${node.selector};\n`
      }

      if (node.selector[0] === '@' && node.selector.startsWith('@property ') && depth === 0) {
        // Don't output duplicate `@property` rules
        if (seenAtProperties.has(node.selector)) {
          return ''
        }

        seenAtProperties.add(node.selector)
      }

      let css = `${indent}${node.selector} {\n`
      if (track) {
        node.destination = [
          {
            start: { line: location.line, column: indent.length },
            end: { line: location.line, column: indent.length },
          },
        ]
        location.line += 1
      }

      for (let child of node.nodes) {
        css += stringify(child, location, depth + 1)
      }

      css += `${indent}}\n`
      if (track) location.line += 1
      return css
    }

    // Comment
    else if (node.kind === 'comment') {
      if (track) {
        node.destination = [
          {
            start: { line: location.line, column: indent.length },
            end: { line: location.line, column: indent.length },
          },
        ]
        location.line += 1 + node.value.split('\n').length - 1
      }
      return `${indent}/*${node.value}*/\n`
    }

    // Declaration
    else if (node.property !== '--tw-sort' && node.value !== undefined && node.value !== null) {
      if (track) {
        node.destination = [
          {
            start: { line: location.line, column: indent.length },
            end: { line: location.line, column: indent.length },
          },
        ]
        location.line += 1 + node.value.split('\n').length - 1
      }
      return `${indent}${node.property}: ${node.value}${node.important ? '!important' : ''};\n`
    }

    return ''
  }

  let location = { line: 1, column: 0 }
  let css = ''

  css += stringifyAll(ast, location)
  css += stringifyAll(atRoots, location)

  return css
}
