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
const AMPERSAND = 0x26
const ASTERISK = 0x2a

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
        buffer = input[i]
        break
      }

      // Start of an attribute selector.
      //
      // NOTE: Right now we don't care about the individual parts of the
      // attribute selector, we just want to find the matching closing bracket.
      //
      // If we need more information from inside the attribute selector in the
      // future, then we can use the `AttributeSelectorParser` here (and even
      // inline it if needed)
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

      // Nesting `&` is always a new selector.
      // Universal `*` is always a new selector.
      case AMPERSAND:
      case ASTERISK: {
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

        // 2. Handle the `&` or `*` as a selector on its own
        if (parent) {
          parent.nodes.push(selector(input[i]))
        } else {
          ast.push(selector(input[i]))
        }
        break
      }

      // Escaped characters.
      case BACKSLASH: {
        buffer += input[i] + input[i + 1]
        i += 1
        break
      }

      // Everything else will be collected in the buffer
      default: {
        buffer += input[i]
      }
    }
  }

  // Collect the remainder as a word
  if (buffer.length > 0) {
    ast.push(selector(buffer))
  }

  return ast
}
