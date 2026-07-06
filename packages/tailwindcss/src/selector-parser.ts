type Combinator =
  | ' ' // Descendant combinator
  | '>' // Child combinator
  | '+' // Next-sibling combinator
  | '~' // Subsequent-sibling combinator

export type SelectorListNode = {
  kind: 'list'
  nodes: SelectorAstNode[]
}

export type SelectorCombinatorNode = {
  kind: 'combinator'
  value: Combinator
}

export type SelectorComplexNode = {
  kind: 'complex'
  nodes: SelectorAstNode[]
}

export type SelectorCompoundNode = {
  kind: 'compound'
  nodes: SelectorAstNode[]
}

export type SelectorNode = {
  kind: 'selector'
  value: string
}

export type SelectorFunctionNode = {
  kind: 'function'
  value: string
  nodes: SelectorAstNode[]
}

export type SelectorValueNode = {
  kind: 'value'
  value: string
}

export type SelectorAstNode =
  | SelectorFunctionNode
  | SelectorCombinatorNode
  | SelectorComplexNode
  | SelectorCompoundNode
  | SelectorListNode
  | SelectorNode
  | SelectorValueNode

function combinator(value: Combinator): SelectorCombinatorNode {
  return {
    kind: 'combinator',
    value,
  }
}

function complex(nodes: SelectorAstNode[]): SelectorComplexNode {
  return {
    kind: 'complex',
    nodes,
  }
}

function compound(nodes: SelectorAstNode[]): SelectorCompoundNode {
  return {
    kind: 'compound',
    nodes,
  }
}

export function fun(value: string, nodes: SelectorAstNode[]): SelectorFunctionNode {
  return {
    kind: 'function',
    value,
    nodes,
  }
}

function list(nodes: SelectorAstNode[]): SelectorListNode {
  return {
    kind: 'list',
    nodes,
  }
}

export function selector(value: string): SelectorNode {
  return {
    kind: 'selector',
    value,
  }
}

function value(value: string): SelectorValueNode {
  return {
    kind: 'value',
    value,
  }
}

export function isUniversalSelector(node: SelectorAstNode): boolean {
  return node.kind === 'selector' && node.value.charCodeAt(0) === ASTERISK
}

export function isNestingSelector(node: SelectorAstNode): boolean {
  return node.kind === 'selector' && node.value.charCodeAt(0) === AMPERSAND
}

export function isClassSelector(node: SelectorAstNode): boolean {
  return node.kind === 'selector' && node.value.charCodeAt(0) === DOT
}

export function isIdSelector(node: SelectorAstNode): boolean {
  return node.kind === 'selector' && node.value.charCodeAt(0) === HASH
}

export function isPseudoSelector(node: SelectorAstNode): boolean {
  return node.kind === 'selector' && node.value.charCodeAt(0) === COLON
}

export function isAttributeSelector(node: SelectorAstNode): boolean {
  return node.kind === 'selector' && node.value.charCodeAt(0) === OPEN_BRACKET
}

export function isTypeSelector(node: SelectorAstNode): boolean {
  if (node.kind !== 'selector') return false

  switch (node.value.charCodeAt(0)) {
    case ASTERISK: // Universal selector
    case AMPERSAND: // Nesting selector
    case DOT: // Class selector
    case HASH: // ID selector
    case COLON: // Pseudo selector
    case OPEN_BRACKET: // Attribute selector
      return false

    // We don't fully verify whether this is actually a proper type selector,
    // but we assume it is one if it's not any of the other ones.
    default:
      return true
  }
}

export function cloneAstNode<T extends SelectorAstNode>(node: T): T {
  switch (node.kind) {
    case 'combinator':
    case 'selector':
    case 'value':
      return {
        kind: node.kind,
        value: node.value,
      } as T

    case 'complex':
    case 'compound':
    case 'list':
      return {
        kind: node.kind,
        nodes: node.nodes.map(cloneAstNode),
      } as T

    case 'function':
      return {
        kind: node.kind,
        value: node.value,
        nodes: node.nodes.map(cloneAstNode),
      } satisfies SelectorFunctionNode as T

    default:
      node satisfies never
      throw new Error(`Unknown node kind: ${(node as any).kind}`)
  }
}

export function toCss(ast: SelectorAstNode[], minify = false) {
  let css = ''
  for (let node of ast) {
    switch (node.kind) {
      case 'selector':
      case 'value': {
        css += node.value
        break
      }
      case 'combinator': {
        if (minify || node.value === ' ') {
          css += node.value
        } else {
          css += ` ${node.value} `
        }
        break
      }

      case 'function': {
        css += `${node.value}(${toCss(node.nodes, minify)})`
        break
      }
      case 'complex':
      case 'compound': {
        css += toCss(node.nodes, minify)
        break
      }
      case 'list': {
        css += node.nodes.map((node) => toCss([node], minify)).join(minify ? ',' : ', ')
        break
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
const DOT = 0x2e
const GREATER_THAN = 0x3e
const NEWLINE = 0x0a
const HASH = 0x23
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

  let target = ast

  let containsCombinator = false

  let contextStack: {
    target: SelectorAstNode[]
    currentList: SelectorListNode | null
    containsCombinator: boolean
  }[] = []

  let currentList: SelectorListNode | null = null

  let buffer = ''

  let peekChar

  function current(nodes = target): SelectorAstNode {
    return nodes.length === 1 ? nodes[0] : containsCombinator ? complex(nodes) : compound(nodes)
  }

  function append(node: SelectorAstNode) {
    let existing = target[target.length - 1]

    if (existing?.kind === 'compound') {
      existing.nodes.push(node)
    } else if (existing && existing.kind !== 'list' && existing.kind !== 'combinator') {
      target[target.length - 1] = compound([existing, node])
    } else {
      target.push(node)
    }
  }

  for (let i = 0; i < input.length; i++) {
    let currentChar = input.charCodeAt(i)

    switch (currentChar) {
      // Handle selector lists
      //
      // ```css
      // .foo, .bar {}
      //     ^
      // ```
      case COMMA: {
        // Flush remaining buffer as a selector
        if (buffer.length > 0) {
          append(selector(buffer))
          buffer = ''
        }

        // Skip whitespace
        for (; i + 1 < input.length; i++) {
          peekChar = input.charCodeAt(i + 1)
          if (peekChar !== NEWLINE && peekChar !== SPACE && peekChar !== TAB) {
            break
          }
        }

        // Add nodes to the current list
        if (currentList) {
          currentList.nodes.push(current())
          target = []
          containsCombinator = false
        }

        // Start a new list
        else {
          let nodes = target.splice(0)
          let item = current(nodes)
          let node = list([item])
          target.push(node)
          currentList = node
          target = []
          containsCombinator = false
        }

        break
      }

      // Handle combinators
      //
      // E.g.:
      //
      // ```css
      // .foo .bar
      //     ^
      //
      // .foo > .bar
      //     ^^^
      // ```
      case GREATER_THAN:
      case NEWLINE:
      case SPACE:
      case PLUS:
      case TAB:
      case TILDE: {
        // Flush remaining buffer as a selector
        if (buffer.length > 0) {
          append(selector(buffer))
          buffer = ''
        }

        // Look ahead and find the end of the combinator
        let start = i
        let end = i + 1
        for (; end < input.length; end++) {
          peekChar = input.charCodeAt(end)
          if (
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

        let value = input.slice(start, end).trim()
        if (
          value === '' &&
          (target.length === 0 || end >= input.length || input.charCodeAt(end) === COMMA)
        ) {
          break
        }

        target.push(combinator((value === '' ? ' ' : value) as Combinator))
        containsCombinator = true

        break
      }

      // Start of a function call
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

        // If the function is not one of the following, we combine all its
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

          // Find the closing bracket
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

          let contents = input.slice(start, end)

          // `:nth-child(…)` and `:nth-last-child(…)` can contain an
          // `of <complex-selector-list>` clause. The selector list must be
          // parsed (e.g. to be able to substitute `&`), but the `An+B` part
          // is not a selector so it stays an opaque value node. E.g.:
          //
          // ```css
          // :nth-child(2n + 1 of .foo, .bar)
          //            ^^^^^^^^^^ value
          //                       ^^^^^^^^^^ selector list
          // ```
          if (node.value === ':nth-child' || node.value === ':nth-last-child') {
            let idx = contents.indexOf('of ')
            if (idx !== -1) {
              node.nodes.push(
                value(
                  contents.slice(0, idx + 3), // value `2n + 1 of `
                ),
                ...parse(
                  contents.slice(idx + 3), // `.foo, .bar`
                ),
              )
              buffer = ''
              i = end

              append(node)

              break
            }
          }

          node.nodes.push(value(contents))
          buffer = ''
          i = end

          append(node)

          break
        }

        append(node)
        contextStack.push({ target, currentList, containsCombinator })
        target = node.nodes
        containsCombinator = false
        currentList = null

        break
      }

      // End of a function call
      //
      // E.g.:
      //
      // ```css
      // foo(bar, baz)
      //             ^
      // ```
      case CLOSE_PAREN: {
        // Flush remaining buffer as a selector
        if (buffer.length > 0) {
          append(selector(buffer))
          buffer = ''
        }

        if (currentList) {
          currentList.nodes.push(current())
        } else if (containsCombinator) {
          target.splice(0, target.length, complex(target.splice(0)))
        }

        let context = contextStack.pop()
        target = context?.target ?? ast
        currentList = context?.currentList ?? null
        containsCombinator = context?.containsCombinator ?? false

        break
      }

      // Split compound selectors
      //
      // E.g.:
      //
      // ```css
      // .foo.bar
      //     ^
      // ```
      case DOT:
      case COLON:
      case HASH: {
        if (currentChar === COLON && buffer === ':') {
          buffer += input[i]
          break
        }

        // Handle everything before the combinator as a selector and start a new
        // selector
        if (buffer.length > 0) {
          append(selector(buffer))
        }
        buffer = input[i]
        break
      }

      // Start of an attribute selector
      //
      // NOTE: Right now we don't care about the individual parts of the
      // attribute selector, we just want to find the matching closing bracket.
      //
      // If we need more information from inside the attribute selector in the
      // future, then we can use the `AttributeSelectorParser` here (and even
      // inline it if needed)
      case OPEN_BRACKET: {
        // Flush remaining buffer as a selector
        if (buffer.length > 0) {
          append(selector(buffer))
          buffer = ''
        }

        let start = i
        let nesting = 0

        // Find the closing bracket
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

        append(selector(input.slice(start, i + 1)))
        break
      }

      // Start of a string
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
        //                          ^     ^         -> These are not the end of the string
        // ```
        for (let j = i + 1; j < input.length; j++) {
          peekChar = input.charCodeAt(j)
          // Current character is a `\` therefore the next character is escaped
          if (peekChar === BACKSLASH) {
            j += 1
          }

          // End of the string
          else if (peekChar === currentChar) {
            i = j
            break
          }
        }

        // Adjust `buffer` to include the string
        buffer += input.slice(start, i + 1)
        break
      }

      // Nesting `&` is always a new selector
      // Universal `*` is always a new selector
      case AMPERSAND:
      case ASTERISK: {
        // Flush remaining buffer as a selector
        if (buffer.length > 0) {
          append(selector(buffer))
          buffer = ''
        }

        // Handle the `&` or `*` as a selector on its own
        append(selector(input[i]))
        break
      }

      // Escaped characters
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

  // Collect the remainder as a selector
  if (buffer.length > 0) {
    append(selector(buffer))
  }

  if (currentList) {
    currentList.nodes.push(current())
  } else if (containsCombinator) {
    target.splice(0, target.length, complex(target.splice(0)))
  }

  return ast
}
