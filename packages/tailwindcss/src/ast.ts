export type Location = {
  /** The line number for this location, one-based */
  line: number

  /** The column number for this location, one-based */
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

function span(value: string, location: Location) {
  let line = location.line
  let column = location.column

  let start = { line: line + 1, column: column + 1 }

  // Skip the first character as it's already accounted for by the current value
  // of `location`
  for (let i = 1; i < value.length; ++i) {
    if (value.charCodeAt(i) === 0x0a) {
      // Add the number of lines the comment spans
      line += 1
      column = 0
      i += 1 // Skip the first character of the next line
    } else {
      // Keep track of the column for accurate end locations
      column += 1
    }
  }

  let end = { line: line + 1, column: column + 1 }

  location.line = line
  location.column = column

  return { start, end }
}

export function toCss(ast: AstNode[], track?: boolean) {
  let atRoots: AstNode[] = []
  let seenAtProperties = new Set<string>()
  let indents: Record<number, string> = {}

  function stringifyAll(nodes: AstNode[], location: Location): string {
    let css = ''
    for (let child of nodes) {
      css += stringify(child, location, 0)
    }
    return css
  }

  function stringify(node: AstNode, location: Location, depth: number): string {
    let indent = (indents[depth] ??= '  '.repeat(depth))

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
        let css = ''

        css += indent
        location.column += indent.length

        let str = ''
        str += node.selector
        str += ';'

        css += str
        node.destination = track ? [span(str, location)] : []

        css += '\n'
        location.line += 1
        location.column = 0

        return css
      }

      if (node.selector[0] === '@' && node.selector.startsWith('@property ') && depth === 0) {
        // Don't output duplicate `@property` rules
        if (seenAtProperties.has(node.selector)) {
          return ''
        }

        seenAtProperties.add(node.selector)
      }

      let css = ''

      css += indent
      location.column += indent.length

      let head = ''
      head += node.selector
      head += ' '

      css += head

      node.destination = track ? [span(head, location)] : []

      css += '{'
      css += '\n'
      location.line += 1
      location.column = 0

      for (let child of node.nodes) {
        css += stringify(child, location, depth + 1)
      }

      css += indent
      location.column += indent.length

      let tail = ''
      tail += '}'

      css += tail
      // node.destination = track ? [...node.destination, span(tail, location)] : []

      css += '\n'
      location.line += 1
      location.column = 0

      return css
    }

    // Comment
    else if (node.kind === 'comment') {
      let css = ''

      css += indent
      location.column += indent.length

      let str = ''
      str += '/*'
      str += node.value
      str += '*/'

      css += str
      node.destination = track ? [span(str, location)] : []

      css += '\n'
      location.line += 1
      location.column = 0

      return css
    }

    // Declaration
    else if (node.property !== '--tw-sort' && node.value !== undefined && node.value !== null) {
      let css = ''

      css += indent
      location.column += indent.length

      let str = ''
      str += node.property
      str += ': '
      str += node.value
      str += node.important ? ' !important' : ''
      str += ';'
      css += str

      node.destination = track ? [span(str, location)] : []

      css += '\n'
      location.line += 1
      location.column = 0

      return css
    }

    return ''
  }

  let location = { line: 0, column: 0 }
  let css = ''

  css += stringifyAll(ast, location)
  css += stringifyAll(atRoots, location)

  return css
}
