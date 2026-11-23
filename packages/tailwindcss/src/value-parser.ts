import {
  findFunctionNameStart,
  isDashed,
  normalizeFunctionName,
} from './utils/normalize-function-name'

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

export function word(value: string): ValueWordNode {
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
const DASH = 0x2d
const DOUBLE_QUOTE = 0x22
const EQUALS = 0x3d
const GREATER_THAN = 0x3e
const LESS_THAN = 0x3c
const LOWER_A = 0x61
const LOWER_Z = 0x7a
const NEWLINE = 0x0a
const NINE = 0x39
const NON_ASCII = 0x80
const OPEN_PAREN = 0x28
const SINGLE_QUOTE = 0x27
const SLASH = 0x2f
const SPACE = 0x20
const TAB = 0x09
const UNDERSCORE = 0x5f
const UPPER_A = 0x41
const UPPER_Z = 0x5a
const ZERO = 0x30

// Function names are ASCII case-insensitive, e.g. `CALC(…)` is `calc(…)`. We
// lowercase them, so the rest of the code can compare them as-is. Dashed
// functions, like `--my-fn(…)`, are case-sensitive, so they stay as written.
//
// The value is everything before the `(`, so it can have more than the name in
// it. E.g. in a raw arbitrary value like `Spin_CALC(…)`, the `_` becomes a
// space later. So we only lowercase the part after the last `_`. For CSS, that
// is the same function name, because the name is case-insensitive.
function normalizeFunctionNameInValue(value: string): string {
  // The start of the identifier at the end of the value, e.g. the `--my_fn` in
  // `1+--my_fn`, and the start of its part after the last `_`.
  let identStart = 0
  let partStart = 0
  let hasUpperCase = false

  for (let i = 0; i < value.length; i++) {
    let char = value.charCodeAt(i)

    // Uppercase letters are part of the identifier
    if (char >= UPPER_A && char <= UPPER_Z) {
      hasUpperCase = true
    }

    // An escaped character is part of the identifier, e.g. `\_` in `--my\_fn`
    else if (char === BACKSLASH) {
      char = value.charCodeAt(++i)
      if (char >= UPPER_A && char <= UPPER_Z) hasUpperCase = true
    }

    // The part after the last `_` starts here
    else if (char === UNDERSCORE) {
      partStart = i + 1
      hasUpperCase = false
    }

    // Any other character that is not part of an identifier ends it
    else if (
      !(char >= LOWER_A && char <= LOWER_Z) &&
      !(char >= ZERO && char <= NINE) &&
      char !== DASH &&
      char < NON_ASCII
    ) {
      identStart = i + 1
      partStart = i + 1
      hasUpperCase = false
    }
  }

  if (!hasUpperCase) return value

  // The name can start after a number, e.g. the `theme` in `100PX-theme(…)`
  let nameStart = findFunctionNameStart(value, partStart, value.length)

  // Dashed functions are case-sensitive, e.g. `--MY-FN(…)`, `--my_FN(…)`, or
  // `a_--MY-FN(…)` in a raw arbitrary value.
  if (isDashed(value, identStart) || isDashed(value, nameStart)) return value

  let name = value.slice(nameStart)
  let normalizedName = normalizeFunctionName(name)
  if (normalizedName === name) return value

  return value.slice(0, nameStart) + normalizedName
}

export function parse(input: string) {
  input = input.replaceAll('\r\n', '\n')

  let ast: ValueAstNode[] = []

  let stack: (ValueFunctionNode | null)[] = []

  let parent = null as ValueFunctionNode | null

  let buffer = ''

  // Whether the `buffer` has an uppercase letter in it. Most function names are
  // lowercase already, so we only have to normalize the others.
  let bufferHasUpperCase = false

  let peekChar

  for (let i = 0; i < input.length; i++) {
    let currentChar = input.charCodeAt(i)

    switch (currentChar) {
      // Current character is a `\` therefore the next character is escaped,
      // consume it together with the next character and continue.
      case BACKSLASH: {
        peekChar = input.charCodeAt(i + 1)
        if (peekChar >= UPPER_A && peekChar <= UPPER_Z) bufferHasUpperCase = true

        buffer += input[i] + input[i + 1]
        i++
        break
      }

      // Typically for math operators, they have to have spaces around them. But
      // there are situations in `theme(colors.red.500/10)` where we use `/`
      // without spaces. Let's make sure this is a separate word as well.
      case SLASH: {
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
          bufferHasUpperCase = false
        }

        // 2. Track the `/` as a word on its own
        let node = word(input[i])
        if (parent) {
          parent.nodes.push(node)
        } else {
          ast.push(node)
        }

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
          bufferHasUpperCase = false
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
        let node = fun(bufferHasUpperCase ? normalizeFunctionNameInValue(buffer) : buffer, [])
        buffer = ''
        bufferHasUpperCase = false

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
          tail?.nodes.push(node)
          buffer = ''
          bufferHasUpperCase = false
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
        if (currentChar >= UPPER_A && currentChar <= UPPER_Z) bufferHasUpperCase = true
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
