import { fun, separator, word, type AstNode, type FunctionNode } from './ast'

const BACKSLASH = 0x5c
const CLOSE_PAREN = 0x29
const COLON = 0x3a
const COMMA = 0x2c
const DOUBLE_QUOTE = 0x22
const OPEN_PAREN = 0x28
const SINGLE_QUOTE = 0x27
const SPACE = 0x20

export function parse(input: string) {
  input = input.replaceAll('\r\n', '\n')

  let ast: AstNode[] = []

  let stack: (FunctionNode | null)[] = []

  let parent = null as FunctionNode | null

  let buffer = ''

  let peekChar

  for (let i = 0; i < input.length; i++) {
    let currentChar = input.charCodeAt(i)

    switch (currentChar) {
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
      case SPACE: {
        // 1. Handle everything before the separator as a word
        // Handle everything before the closing paren a word
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
          if (peekChar !== COLON && peekChar !== COMMA && peekChar !== SPACE) {
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
      default:
        buffer += String.fromCharCode(currentChar)
    }
  }

  // Collect the remainder as a word
  if (buffer.length > 0) {
    ast.push(word(buffer))
  }

  return ast
}
