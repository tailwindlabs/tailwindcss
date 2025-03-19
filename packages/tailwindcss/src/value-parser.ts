export type ValueWordNode = {
  kind: 'word'
  value: string
}

export type ValueFunctionNode = {
  kind: 'function'
  value: string
  nodes: ValueAstNode[]
}

export type ValueSeparatorNode = {
  kind: 'separator'
  value: string
}

export type ValueAstNode = ValueWordNode | ValueFunctionNode | ValueSeparatorNode
type ValueParentNode = ValueFunctionNode | null

function word(value: string): ValueWordNode {
  return {
    kind: 'word',
    value,
  }
}

function fun(value: string, nodes: ValueAstNode[]): ValueFunctionNode {
  return {
    kind: 'function',
    value: value,
    nodes,
  }
}

function separator(value: string): ValueSeparatorNode {
  return {
    kind: 'separator',
    value,
  }
}

export const enum ValueWalkAction {
  /** Continue walking, which is the default */
  Continue,

  /** Skip visiting the children of this node */
  Skip,

  /** Stop the walk entirely */
  Stop,
}

export function walk(
  ast: ValueAstNode[],
  visit: (
    node: ValueAstNode,
    utils: {
      parent: ValueParentNode
      replaceWith(newNode: ValueAstNode | ValueAstNode[]): void
    },
  ) => void | ValueWalkAction,
  parent: ValueParentNode = null,
) {
  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]
    let replacedNode = false
    let replacedNodeOffset = 0
    let status =
      visit(node, {
        parent,
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
          }
        },
      }) ?? ValueWalkAction.Continue

    // We want to visit or skip the newly replaced node(s), which start at the
    // current index (i). By decrementing the index here, the next loop will
    // process this position (containing the replaced node) again.
    if (replacedNode) {
      if (status === ValueWalkAction.Continue) {
        i--
      } else {
        i += replacedNodeOffset - 1
      }
      continue
    }

    // Stop the walk entirely
    if (status === ValueWalkAction.Stop) return ValueWalkAction.Stop

    // Skip visiting the children of this node
    if (status === ValueWalkAction.Skip) continue

    if (node.kind === 'function') {
      if (walk(node.nodes, visit, node) === ValueWalkAction.Stop) {
        return ValueWalkAction.Stop
      }
    }
  }
}

export function toCss(ast: ValueAstNode[]) {
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

const BACKSLASH = 0x5c
const CLOSE_PAREN = 0x29
const COLON = 0x3a
const COMMA = 0x2c
const DOUBLE_QUOTE = 0x22
const EQUALS = 0x3d
const GREATER_THAN = 0x3e
const LESS_THAN = 0x3c
const NEWLINE = 0x0a
const OPEN_PAREN = 0x28
const SINGLE_QUOTE = 0x27
const SLASH = 0x2f
const SPACE = 0x20
const TAB = 0x09

export function parse(input: string) {
  input = input.replaceAll('\r\n', '\n')

  let ast: ValueAstNode[] = []

  let stack: (ValueFunctionNode | null)[] = []

  let parent = null as ValueFunctionNode | null

  let buffer = ''

  let peekChar

  for (let i = 0; i < input.length; i++) {
    let currentChar = input.charCodeAt(i)

    switch (currentChar) {
      // Current character is a `\` therefore the next character is escaped,
      // consume it together with the next character and continue.
      case BACKSLASH: {
        buffer += input[i] + input[i + 1]
        i++
        break
      }

      // Space and commas are bundled into separators
      //
      // E.g.:
      //
      // ```css
      // foo(bar, baz)
      //        ^^
      // ```
      case COLON:
      case COMMA:
      case EQUALS:
      case GREATER_THAN:
      case LESS_THAN:
      case NEWLINE:
      case SLASH:
      case SPACE:
      case TAB: {
        // 1. Handle everything before the separator as a word
        // Handle everything before the closing paren as a word
        if (buffer.length > 0) {
          let node = word(buffer)
          if (parent) {
            parent.nodes.push(node)
          } else {
            ast.push(node)
          }
          buffer = ''
        }

        // 2. Look ahead and find the end of the separator
        let start = i
        let end = i + 1
        for (; end < input.length; end++) {
          peekChar = input.charCodeAt(end)
          if (
            peekChar !== COLON &&
            peekChar !== COMMA &&
            peekChar !== EQUALS &&
            peekChar !== GREATER_THAN &&
            peekChar !== LESS_THAN &&
            peekChar !== NEWLINE &&
            peekChar !== SLASH &&
            peekChar !== SPACE &&
            peekChar !== TAB
          ) {
            break
          }
        }
        i = end - 1

        let node = separator(input.slice(start, end))
        if (parent) {
          parent.nodes.push(node)
        } else {
          ast.push(node)
        }

        break
      }

      // Start of a string.
      case SINGLE_QUOTE:
      case DOUBLE_QUOTE: {
        let start = i

        // We need to ensure that the closing quote is the same as the opening
        // quote.
        //
        // E.g.:
        //
        // ```css
        // "This is a string with a 'quote' in it"
        //                          ^     ^         -> These are not the end of the string.
        // ```
        for (let j = i + 1; j < input.length; j++) {
          peekChar = input.charCodeAt(j)
          // Current character is a `\` therefore the next character is escaped.
          if (peekChar === BACKSLASH) {
            j += 1
          }

          // End of the string.
          else if (peekChar === currentChar) {
            i = j
            break
          }
        }

        // Adjust `buffer` to include the string.
        buffer += input.slice(start, i + 1)
        break
      }

      // Start of a function call.
      //
      // E.g.:
      //
      // ```css
      // foo(bar, baz)
      //    ^
      // ```
      case OPEN_PAREN: {
        let node = fun(buffer, [])
        buffer = ''

        if (parent) {
          parent.nodes.push(node)
        } else {
          ast.push(node)
        }
        stack.push(node)
        parent = node

        break
      }

      // End of a function call.
      //
      // E.g.:
      //
      // ```css
      // foo(bar, baz)
      //             ^
      // ```
      case CLOSE_PAREN: {
        let tail = stack.pop()

        // Handle everything before the closing paren a word
        if (buffer.length > 0) {
          let node = word(buffer)
          tail!.nodes.push(node)
          buffer = ''
        }

        if (stack.length > 0) {
          parent = stack[stack.length - 1]
        } else {
          parent = null
        }

        break
      }

      // Everything else will be collected in the buffer
      default: {
        buffer += String.fromCharCode(currentChar)
      }
    }
  }

  // Collect the remainder as a word
  if (buffer.length > 0) {
    ast.push(word(buffer))
  }

  return ast
}
