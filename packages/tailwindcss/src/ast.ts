import type { Location, TrackLocations } from './track-locations'

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

  let start = { line, column }

  for (let i = 0; i < value.length; ++i) {
    if (value.charCodeAt(i) === 0x0a) {
      // Add the number of lines the comment spans
      line += 1
      column = 0
    } else {
      // Keep track of the column for accurate end locations
      column += 1
    }
  }

  let end = { line, column }

  location.line = line
  location.column = column

  return { start, end }
}

export function toCss(ast: AstNode[], track?: TrackLocations) {
  let atRoots: AstNode[] = []
  let seenAtProperties = new Set<string>()
  let location = { line: 1, column: 0 }

  function stringify(node: AstNode, depth = 0, location: Location): string {
    let css = ''
    let indent = '  '.repeat(depth)

    function write(node: AstNode, str: string) {
      // Make sure the CSS is indented correctly
      css += indent
      location.column += indent.length

      // Write the line of CSS (comment, declaration, selector, etc…)
      css += str

      // Track the start and end of the CSS
      track?.dst(node, span(str, location))

      // Add another line after the end
      css += `\n`
      location.line += 1
      location.column = 0
    }

    // Rule
    if (node.kind === 'rule') {
      // Pull out `@at-root` rules to append later
      if (node.selector === '@at-root') {
        for (let child of node.nodes) {
          atRoots.push(child)
        }
        return css
      }

      if (node.selector === '@tailwind utilities') {
        for (let child of node.nodes) {
          css += stringify(child, depth, location)
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
        // Make sure the CSS is indented correctly
        location.column += indent.length

        // Track the start and end of the CSS
        track?.dst(node, span(`${node.selector};`, location))

        // Track new line at the end
        location.line += 1
        location.column = 0

        return `${indent}${node.selector};\n`
      }

      if (node.selector[0] === '@' && node.selector.startsWith('@property ') && depth === 0) {
        // Don't output duplicate `@property` rules
        if (seenAtProperties.has(node.selector)) {
          return ''
        }

        seenAtProperties.add(node.selector)
      }

      write(node, `${node.selector} {`)

      for (let child of node.nodes) {
        css += stringify(child, depth + 1, location)
      }

      write(node, `}`)
    }

    // Comment
    else if (node.kind === 'comment') {
      write(node, `/*${node.value}*/`)
    }

    // Declaration
    else if (node.property !== '--tw-sort' && node.value !== undefined && node.value !== null) {
      write(node, `${node.property}: ${node.value}${node.important ? '!important' : ''};`)
    }

    return css
  }

  function stringifyAst(nodes: AstNode[], location: Location) {
    let css = ''
    for (let node of nodes) {
      let result = stringify(node, 0, location)
      if (result !== '') {
        css += result
      }
    }

    return css
  }

  let css = ''

  css += stringifyAst(ast, location)
  css += stringifyAst(atRoots, location)

  return css
}
