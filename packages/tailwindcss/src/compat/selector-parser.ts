export type SelectorCombinatorNode = {
  kind: 'combinator'
  value: string
}

export type SelectorFunctionNode = {
  kind: 'function'
  value: string
  nodes: SelectorAstNode[]
}

export type SelectorNode = {
  kind: 'selector'
  value: string
}

export type SelectorValueNode = {
  kind: 'value'
  value: string
}

export type SelectorSeparatorNode = {
  kind: 'separator'
  value: string
}

export type SelectorAstNode =
  | SelectorCombinatorNode
  | SelectorFunctionNode
  | SelectorNode
  | SelectorSeparatorNode
  | SelectorValueNode
type SelectorParentNode = SelectorFunctionNode | null

function combinator(value: string): SelectorCombinatorNode {
  return {
    kind: 'combinator',
    value,
  }
}

function fun(value: string, nodes: SelectorAstNode[]): SelectorFunctionNode {
  return {
    kind: 'function',
    value: value,
    nodes,
  }
}

function selector(value: string): SelectorNode {
  return {
    kind: 'selector',
    value,
  }
}

function separator(value: string): SelectorSeparatorNode {
  return {
    kind: 'separator',
    value,
  }
}

function value(value: string): SelectorValueNode {
  return {
    kind: 'value',
    value,
  }
}

export const enum SelectorWalkAction {
  /** Continue walking, which is the default */
  Continue,

  /** Skip visiting the children of this node */
  Skip,

  /** Stop the walk entirely */
  Stop,
}

export function walk(
  ast: SelectorAstNode[],
  visit: (
    node: SelectorAstNode,
    utils: {
      parent: SelectorParentNode
      replaceWith(newNode: SelectorAstNode | SelectorAstNode[]): void
    },
  ) => void | SelectorWalkAction,
  parent: SelectorParentNode = null,
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
            replacedNodeOffset = 1
          }
        },
      }) ?? SelectorWalkAction.Continue

    // We want to visit or skip the newly replaced node(s), which start at the
    // current index (i). By decrementing the index here, the next loop will
    // process this position (containing the replaced node) again.
    if (replacedNode) {
      if (status === SelectorWalkAction.Continue) {
        i--
      } else {
        i += replacedNodeOffset - 1
      }
      continue
    }

    // Stop the walk entirely
    if (status === SelectorWalkAction.Stop) return SelectorWalkAction.Stop

    // Skip visiting the children of this node
    if (status === SelectorWalkAction.Skip) continue

    if (node.kind === 'function') {
      if (walk(node.nodes, visit, node) === SelectorWalkAction.Stop) {
        return SelectorWalkAction.Stop
      }
    }
  }
}

export function toCss(ast: SelectorAstNode[]) {
  let css = ''
  for (const node of ast) {
    switch (node.kind) {
      case 'combinator':
      case 'selector':
      case 'separator':
      case 'value': {
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
const CLOSE_BRACKET = 0x5d
const CLOSE_PAREN = 0x29
const COLON = 0x3a
const COMMA = 0x2c
const DOUBLE_QUOTE = 0x22
const FULL_STOP = 0x2e
const GREATER_THAN = 0x3e
const NEWLINE = 0x0a
const NUMBER_SIGN = 0x23
const OPEN_BRACKET = 0x5b
const OPEN_PAREN = 0x28
const PLUS = 0x2b
const SINGLE_QUOTE = 0x27
const SPACE = 0x20
const TAB = 0x09
const TILDE = 0x7e

export function parse(input: string) {
  input = input.replaceAll('\r\n', '\n')

  let ast: SelectorAstNode[] = []

  let stack: (SelectorFunctionNode | null)[] = []

  let parent = null as SelectorFunctionNode | null

  let buffer = ''

  let peekChar

  for (let i = 0; i < input.length; i++) {
    let currentChar = input.charCodeAt(i)

    switch (currentChar) {
      // E.g.:
      //
      // ```css
      // .foo .bar
      //     ^
      //
      // .foo > .bar
      //     ^^^
      // ```
      case COMMA:
      case GREATER_THAN:
      case NEWLINE:
      case SPACE:
      case PLUS:
      case TAB:
      case TILDE: {
        // 1. Handle everything before the combinator as a selector
        if (buffer.length > 0) {
          let node = selector(buffer)
          if (parent) {
            parent.nodes.push(node)
          } else {
            ast.push(node)
          }
          buffer = ''
        }

        // 2. Look ahead and find the end of the combinator
        let start = i
        let end = i + 1
        for (; end < input.length; end++) {
          peekChar = input.charCodeAt(end)
          if (
            peekChar !== COMMA &&
            peekChar !== GREATER_THAN &&
            peekChar !== NEWLINE &&
            peekChar !== SPACE &&
            peekChar !== PLUS &&
            peekChar !== TAB &&
            peekChar !== TILDE
          ) {
            break
          }
        }
        i = end - 1

        let contents = input.slice(start, end)
        let node = contents.trim() === ',' ? separator(contents) : combinator(contents)
        if (parent) {
          parent.nodes.push(node)
        } else {
          ast.push(node)
        }

        break
      }

      // Start of a function call.
      //
      // E.g.:
      //
      // ```css
      // .foo:not(.bar)
      //         ^
      // ```
      case OPEN_PAREN: {
        let node = fun(buffer, [])
        buffer = ''

        // If the function is not one of the following, we combine all it's
        // contents into a single value node
        if (
          node.value !== ':not' &&
          node.value !== ':where' &&
          node.value !== ':has' &&
          node.value !== ':is'
        ) {
          // Find the end of the function call
          let start = i + 1
          let nesting = 0

          // Find the closing bracket.
          for (let j = i + 1; j < input.length; j++) {
            peekChar = input.charCodeAt(j)
            if (peekChar === OPEN_PAREN) {
              nesting++
              continue
            }
            if (peekChar === CLOSE_PAREN) {
              if (nesting === 0) {
                i = j
                break
              }
              nesting--
            }
          }
          let end = i

          node.nodes.push(value(input.slice(start, end)))
          buffer = ''
          i = end

          if (parent) {
            parent.nodes.push(node)
          } else {
            ast.push(node)
          }

          break
        }

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

        // Handle everything before the closing paren a selector
        if (buffer.length > 0) {
          let node = selector(buffer)
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

      // Split compound selectors.
      //
      // E.g.:
      //
      // ```css
      // .foo.bar
      //     ^
      // ```
      case FULL_STOP:
      case COLON:
      case NUMBER_SIGN: {
        // Handle everything before the combinator as a selector and
        // start a new selector
        if (buffer.length > 0) {
          let node = selector(buffer)
          if (parent) {
            parent.nodes.push(node)
          } else {
            ast.push(node)
          }
        }
        buffer = String.fromCharCode(currentChar)
        break
      }

      // Start of an attribute selector.
      case OPEN_BRACKET: {
        // Handle everything before the combinator as a selector
        if (buffer.length > 0) {
          let node = selector(buffer)
          if (parent) {
            parent.nodes.push(node)
          } else {
            ast.push(node)
          }
        }
        buffer = ''

        let start = i
        let nesting = 0

        // Find the closing bracket.
        for (let j = i + 1; j < input.length; j++) {
          peekChar = input.charCodeAt(j)
          if (peekChar === OPEN_BRACKET) {
            nesting++
            continue
          }
          if (peekChar === CLOSE_BRACKET) {
            if (nesting === 0) {
              i = j
              break
            }
            nesting--
          }
        }

        // Adjust `buffer` to include the string.
        buffer += input.slice(start, i + 1)
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

      // Escaped characters.
      case BACKSLASH: {
        let nextChar = input.charCodeAt(i + 1)
        buffer += String.fromCharCode(currentChar) + String.fromCharCode(nextChar)
        i += 1
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
    ast.push(selector(buffer))
  }

  return ast
}
