import {
  atRule,
  comment,
  decl,
  rule,
  type AstNode,
  type AtRule,
  type Comment,
  type Declaration,
  type Rule,
} from './ast'

const BACKSLASH = 0x5c
const SLASH = 0x2f
const ASTERISK = 0x2a
const DOUBLE_QUOTE = 0x22
const SINGLE_QUOTE = 0x27
const COLON = 0x3a
const SEMICOLON = 0x3b
const LINE_BREAK = 0x0a
const SPACE = 0x20
const TAB = 0x09
const OPEN_CURLY = 0x7b
const CLOSE_CURLY = 0x7d
const OPEN_PAREN = 0x28
const CLOSE_PAREN = 0x29
const OPEN_BRACKET = 0x5b
const CLOSE_BRACKET = 0x5d
const DASH = 0x2d
const AT_SIGN = 0x40
const EXCLAMATION_MARK = 0x21

export function parse(input: string) {
  if (input[0] === '\uFEFF') input = input.slice(1)
  input = input.replaceAll('\r\n', '\n')

  let ast: AstNode[] = []
  let licenseComments: Comment[] = []

  let stack: (Rule | null)[] = []

  let parent = null as Rule | null
  let node = null as AstNode | null

  let buffer = ''
  let closingBracketStack = ''

  let peekChar

  for (let i = 0; i < input.length; i++) {
    let currentChar = input.charCodeAt(i)

    // Current character is a `\` therefore the next character is escaped,
    // consume it together with the next character and continue.
    //
    // E.g.:
    //
    // ```css
    // .hover\:foo:hover {}
    //       ^
    // ```
    //
    if (currentChar === BACKSLASH) {
      buffer += input.slice(i, i + 2)
      i += 1
    }

    // Start of a comment.
    //
    // E.g.:
    //
    // ```css
    // /* Example */
    // ^^^^^^^^^^^^^
    // .foo {
    //  color: red; /* Example */
    //              ^^^^^^^^^^^^^
    // }
    // .bar {
    //  color: /* Example */ red;
    //         ^^^^^^^^^^^^^
    // }
    // ```
    else if (currentChar === SLASH && input.charCodeAt(i + 1) === ASTERISK) {
      let start = i

      for (let j = i + 2; j < input.length; j++) {
        peekChar = input.charCodeAt(j)

        // Current character is a `\` therefore the next character is escaped.
        if (peekChar === BACKSLASH) {
          j += 1
        }

        // End of the comment
        else if (peekChar === ASTERISK && input.charCodeAt(j + 1) === SLASH) {
          i = j + 1
          break
        }
      }

      let commentString = input.slice(start, i + 1)

      // Collect all license comments so that we can hoist them to the top of
      // the AST.
      if (commentString.charCodeAt(2) === EXCLAMATION_MARK) {
        licenseComments.push(comment(commentString.slice(2, -2)))
      }
    }

    // Start of a string.
    else if (currentChar === SINGLE_QUOTE || currentChar === DOUBLE_QUOTE) {
      let start = i

      // We need to ensure that the closing quote is the same as the opening
      // quote.
      //
      // E.g.:
      //
      // ```css
      // .foo {
      //   content: "This is a string with a 'quote' in it";
      //                                     ^     ^         -> These are not the end of the string.
      // }
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

        // End of the line without ending the string but with a `;` at the end.
        //
        // E.g.:
        //
        // ```css
        // .foo {
        //   content: "This is a string with a;
        //                                    ^ Missing "
        // }
        // ```
        else if (peekChar === SEMICOLON && input.charCodeAt(j + 1) === LINE_BREAK) {
          throw new Error(
            `Unterminated string: ${input.slice(start, j + 1) + String.fromCharCode(currentChar)}`,
          )
        }

        // End of the line without ending the string.
        //
        // E.g.:
        //
        // ```css
        // .foo {
        //   content: "This is a string with a
        //                                    ^ Missing "
        // }
        // ```
        else if (peekChar === LINE_BREAK) {
          throw new Error(
            `Unterminated string: ${input.slice(start, j) + String.fromCharCode(currentChar)}`,
          )
        }
      }

      // Adjust `buffer` to include the string.
      buffer += input.slice(start, i + 1)
    }

    // Skip whitespace if the next character is also whitespace. This allows us
    // to reduce the amount of whitespace in the AST.
    else if (
      (currentChar === SPACE || currentChar === LINE_BREAK || currentChar === TAB) &&
      (peekChar = input.charCodeAt(i + 1)) &&
      (peekChar === SPACE || peekChar === LINE_BREAK || peekChar === TAB)
    ) {
      continue
    }

    // Replace new lines with spaces.
    else if (currentChar === LINE_BREAK) {
      if (buffer.length === 0) continue

      peekChar = buffer.charCodeAt(buffer.length - 1)
      if (peekChar !== SPACE && peekChar !== LINE_BREAK && peekChar !== TAB) {
        buffer += ' '
      }
    }

    // Start of a custom property.
    //
    // Custom properties are very permissive and can contain almost any
    // character, even `;` and `}`. Therefore we have to make sure that we are
    // at the correct "end" of the custom property by making sure everything is
    // balanced.
    else if (currentChar === DASH && input.charCodeAt(i + 1) === DASH && buffer.length === 0) {
      let closingBracketStack = ''

      let start = i
      let colonIdx = -1

      for (let j = i + 2; j < input.length; j++) {
        peekChar = input.charCodeAt(j)

        // Current character is a `\` therefore the next character is escaped.
        if (peekChar === BACKSLASH) {
          j += 1
        }

        // Start of a comment.
        else if (peekChar === SLASH && input.charCodeAt(j + 1) === ASTERISK) {
          for (let k = j + 2; k < input.length; k++) {
            peekChar = input.charCodeAt(k)
            // Current character is a `\` therefore the next character is escaped.
            if (peekChar === BACKSLASH) {
              k += 1
            }

            // End of the comment
            else if (peekChar === ASTERISK && input.charCodeAt(k + 1) === SLASH) {
              j = k + 1
              break
            }
          }
        }

        // End of the "property" of the property-value pair.
        else if (colonIdx === -1 && peekChar === COLON) {
          colonIdx = buffer.length + j - start
        }

        // End of the custom property.
        else if (peekChar === SEMICOLON && closingBracketStack.length === 0) {
          buffer += input.slice(start, j)
          i = j
          break
        }

        // Start of a block.
        else if (peekChar === OPEN_PAREN) {
          closingBracketStack += ')'
        } else if (peekChar === OPEN_BRACKET) {
          closingBracketStack += ']'
        } else if (peekChar === OPEN_CURLY) {
          closingBracketStack += '}'
        }

        // End of the custom property if didn't use a `;` to end the custom
        // property.
        //
        // E.g.:
        //
        // ```css
        // .foo {
        //   --custom: value
        //                  ^
        // }
        // ```
        else if (
          (peekChar === CLOSE_CURLY || input.length - 1 === j) &&
          closingBracketStack.length === 0
        ) {
          i = j - 1
          buffer += input.slice(start, j)
          break
        }

        // End of a block.
        else if (
          peekChar === CLOSE_PAREN ||
          peekChar === CLOSE_BRACKET ||
          peekChar === CLOSE_CURLY
        ) {
          if (
            closingBracketStack.length > 0 &&
            input[j] === closingBracketStack[closingBracketStack.length - 1]
          ) {
            closingBracketStack = closingBracketStack.slice(0, -1)
          }
        }
      }

      let declaration = parseDeclaration(buffer, colonIdx)
      if (!declaration) throw new Error(`Invalid custom property, expected a value`)

      if (parent) {
        parent.nodes.push(declaration)
      } else {
        ast.push(declaration)
      }

      buffer = ''
    }

    // End of a body-less at-rule.
    //
    // E.g.:
    //
    // ```css
    // @charset "UTF-8";
    //                 ^
    // ```
    else if (currentChar === SEMICOLON && buffer.charCodeAt(0) === AT_SIGN) {
      node = parseAtRule(buffer)

      // At-rule is nested inside of a rule, attach it to the parent.
      if (parent) {
        parent.nodes.push(node)
      }

      // We are the root node which means we are done with the current node.
      else {
        ast.push(node)
      }

      // Reset the state for the next node.
      buffer = ''
      node = null
    }

    // End of a declaration.
    //
    // E.g.:
    //
    // ```css
    // .foo {
    //   color: red;
    //             ^
    // }
    // ```
    //
    else if (
      currentChar === SEMICOLON &&
      closingBracketStack[closingBracketStack.length - 1] !== ')'
    ) {
      let declaration = parseDeclaration(buffer)
      if (!declaration) {
        if (buffer.length === 0) throw new Error('Unexpected semicolon')
        throw new Error(`Invalid declaration: \`${buffer.trim()}\``)
      }

      if (parent) {
        parent.nodes.push(declaration)
      } else {
        ast.push(declaration)
      }

      buffer = ''
    }

    // Start of a block.
    else if (
      currentChar === OPEN_CURLY &&
      closingBracketStack[closingBracketStack.length - 1] !== ')'
    ) {
      closingBracketStack += '}'

      // At this point `buffer` should resemble a selector or an at-rule.
      node = rule(buffer.trim())

      // Attach the rule to the parent in case it's nested.
      if (parent) {
        parent.nodes.push(node)
      }

      // Push the parent node to the stack, so that we can go back once the
      // nested nodes are done.
      stack.push(parent)

      // Make the current node the new parent, so that nested nodes can be
      // attached to it.
      parent = node

      // Reset the state for the next node.
      buffer = ''
      node = null
    }

    // End of a block.
    else if (
      currentChar === CLOSE_CURLY &&
      closingBracketStack[closingBracketStack.length - 1] !== ')'
    ) {
      if (closingBracketStack === '') {
        throw new Error('Missing opening {')
      }

      closingBracketStack = closingBracketStack.slice(0, -1)

      // When we hit a `}` and `buffer` is filled in, then it means that we did
      // not complete the previous node yet. This means that we hit a
      // declaration without a `;` at the end.
      if (buffer.length > 0) {
        // This can happen for nested at-rules.
        //
        // E.g.:
        //
        // ```css
        // @layer foo {
        //   @tailwind utilities
        //                      ^
        // }
        // ```
        if (buffer.charCodeAt(0) === AT_SIGN) {
          node = parseAtRule(buffer)

          // At-rule is nested inside of a rule, attach it to the parent.
          if (parent) {
            parent.nodes.push(node)
          }

          // We are the root node which means we are done with the current node.
          else {
            ast.push(node)
          }

          // Reset the state for the next node.
          buffer = ''
          node = null
        }

        // But it can also happen for declarations.
        //
        // E.g.:
        //
        // ```css
        // .foo {
        //   color: red
        //             ^
        // }
        // ```
        else {
          // Split `buffer` into a `property` and a `value`. At this point the
          // comments are already removed which means that we don't have to worry
          // about `:` inside of comments.
          let colonIdx = buffer.indexOf(':')

          // Attach the declaration to the parent.
          if (parent) {
            let node = parseDeclaration(buffer, colonIdx)
            if (!node) throw new Error(`Invalid declaration: \`${buffer.trim()}\``)

            parent.nodes.push(node)
          }
        }
      }

      // We are done with the current node, which means we can go up one level
      // in the stack.
      let grandParent = stack.pop() ?? null

      // We are the root node which means we are done and continue with the next
      // node.
      if (grandParent === null && parent) {
        ast.push(parent)
      }

      // Go up one level in the stack.
      parent = grandParent

      // Reset the state for the next node.
      buffer = ''
      node = null
    }

    // `(`
    else if (currentChar === OPEN_PAREN) {
      closingBracketStack += ')'
      buffer += '('
    }

    // `)`
    else if (currentChar === CLOSE_PAREN) {
      if (closingBracketStack[closingBracketStack.length - 1] !== ')') {
        throw new Error('Missing opening (')
      }

      closingBracketStack = closingBracketStack.slice(0, -1)
      buffer += ')'
    }

    // Any other character is part of the current node.
    else {
      // Skip whitespace at the start of a new node.
      if (
        buffer.length === 0 &&
        (currentChar === SPACE || currentChar === LINE_BREAK || currentChar === TAB)
      ) {
        continue
      }

      buffer += String.fromCharCode(currentChar)
    }
  }

  // If we have a leftover `buffer` that happens to start with an `@` then it
  // means that we have an at-rule that is not terminated with a semicolon at
  // the end of the input.
  if (buffer.charCodeAt(0) === AT_SIGN) {
    ast.push(parseAtRule(buffer))
  }

  // When we are done parsing then everything should be balanced. If we still
  // have a leftover `parent`, then it means that we have an unterminated block.
  if (closingBracketStack.length > 0 && parent) {
    if (parent.kind === 'rule') {
      throw new Error(`Missing closing } at ${parent.selector}`)
    }
    if (parent.kind === 'at-rule') {
      throw new Error(`Missing closing } at ${parent.name} ${parent.params}`)
    }
  }

  if (licenseComments.length > 0) {
    return (licenseComments as AstNode[]).concat(ast)
  }

  return ast
}

export function parseAtRule(buffer: string, nodes: AstNode[] = []): AtRule {
  // Assumption: The smallest at-rule in CSS right now is `@page`, this means
  //             that we can always skip the first 5 characters and start at the
  //             sixth (at index 5).
  //
  // There is a chance someone is using a shorter at-rule, in that case we have
  // to adjust this number back to 2, e.g.: `@x`.
  //
  // This issue can only occur if somebody does the following things:
  //
  // 1. Uses a shorter at-rule than `@page`
  // 2. Disables Lightning CSS from `@tailwindcss/postcss` (because Lightning
  //    CSS doesn't handle custom at-rules properly right now)
  // 3. Sandwiches the `@tailwindcss/postcss` plugin between two other plugins
  //    that can handle the shorter at-rule
  //
  // Let's use the more common case as the default and we can adjust this
  // behavior if necessary.
  for (let i = 5 /* '@page'.length */; i < buffer.length; i++) {
    let currentChar = buffer.charCodeAt(i)
    if (currentChar === SPACE || currentChar === OPEN_PAREN) {
      let name = buffer.slice(0, i).trim()
      let params = buffer.slice(i).trim()
      return atRule(name, params, nodes)
    }
  }

  return atRule(buffer.trim(), '', nodes)
}

function parseDeclaration(
  buffer: string,
  colonIdx: number = buffer.indexOf(':'),
): Declaration | null {
  if (colonIdx === -1) return null
  let importantIdx = buffer.indexOf('!important', colonIdx + 1)
  return decl(
    buffer.slice(0, colonIdx).trim(),
    buffer.slice(colonIdx + 1, importantIdx === -1 ? buffer.length : importantIdx).trim(),
    importantIdx !== -1,
  )
}
