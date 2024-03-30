import { comment, rule, type AstNode, type Comment, type Declaration, type Rule } from './ast'

const BACK_SLASH = '\\'.charCodeAt(0)
const SLASH = '/'.charCodeAt(0)
const ASTERISK = '*'.charCodeAt(0)
const DOUBLE_QUOTE = '"'.charCodeAt(0)
const SINGLE_QUOTE = "'".charCodeAt(0)
const COLON = ':'.charCodeAt(0)
const SEMICOLON = ';'.charCodeAt(0)
const LINE_BREAK = '\n'.charCodeAt(0)
const SPACE = ' '.charCodeAt(0)
const TAB = '\t'.charCodeAt(0)
const OPEN_CURLY_BRACKET = '{'.charCodeAt(0)
const CLOSE_CURLY_BRACKET = '}'.charCodeAt(0)
const OPEN_PARENTHESIS = '('.charCodeAt(0)
const CLOSE_PARENTHESIS = ')'.charCodeAt(0)
const OPEN_BRACKET = '['.charCodeAt(0)
const CLOSE_BRACKET = ']'.charCodeAt(0)
const DASH = '-'.charCodeAt(0)
const AT_SIGN = '@'.charCodeAt(0)
const EXCLAMATION_MARK = '!'.charCodeAt(0)

export function parse(input: string) {
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
    if (currentChar === BACK_SLASH) {
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
        if (peekChar === BACK_SLASH) {
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
        if (peekChar === BACK_SLASH) {
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
        if (peekChar === BACK_SLASH) {
          j += 1
        }

        // Start of a comment.
        else if (peekChar === SLASH && input.charCodeAt(j + 1) === ASTERISK) {
          for (let k = j + 2; k < input.length; k++) {
            peekChar = input.charCodeAt(k)
            // Current character is a `\` therefore the next character is escaped.
            if (peekChar === BACK_SLASH) {
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
        else if (peekChar === OPEN_PARENTHESIS) {
          closingBracketStack += ')'
        } else if (peekChar === OPEN_BRACKET) {
          closingBracketStack += ']'
        } else if (peekChar === OPEN_CURLY_BRACKET) {
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
          (peekChar === CLOSE_CURLY_BRACKET || input.length - 1 === j) &&
          closingBracketStack.length === 0
        ) {
          i = j - 1
          buffer += input.slice(start, j)
          break
        }

        // End of a block.
        else if (
          peekChar === CLOSE_PARENTHESIS ||
          peekChar === CLOSE_BRACKET ||
          peekChar === CLOSE_CURLY_BRACKET
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
      node = rule(buffer, [])

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
    else if (currentChar === SEMICOLON) {
      let declaration = parseDeclaration(buffer)
      if (parent) {
        parent.nodes.push(declaration)
      } else {
        ast.push(declaration)
      }

      buffer = ''
    }

    // Start of a block.
    else if (currentChar === OPEN_CURLY_BRACKET) {
      closingBracketStack += '}'

      // At this point `buffer` should resemble a selector or an at-rule.
      node = rule(buffer.trim(), [])

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
    else if (currentChar === CLOSE_CURLY_BRACKET) {
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
          node = rule(buffer.trim(), [])

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
            let importantIdx = buffer.indexOf('!important', colonIdx + 1)
            parent.nodes.push({
              kind: 'declaration',
              property: buffer.slice(0, colonIdx).trim(),
              value: buffer
                .slice(colonIdx + 1, importantIdx === -1 ? buffer.length : importantIdx)
                .trim(),
              important: importantIdx !== -1,
            } satisfies Declaration)
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

  // When we are done parsing then everything should be balanced. If we still
  // have a leftover `parent`, then it means that we have an unterminated block.
  if (closingBracketStack.length > 0 && parent) {
    throw new Error(`Missing closing } at ${parent.selector}`)
  }

  if (licenseComments.length > 0) {
    return (licenseComments as AstNode[]).concat(ast)
  }

  return ast
}

function parseDeclaration(buffer: string, colonIdx: number = buffer.indexOf(':')): Declaration {
  let importantIdx = buffer.indexOf('!important', colonIdx + 1)
  return {
    kind: 'declaration',
    property: buffer.slice(0, colonIdx).trim(),
    value: buffer.slice(colonIdx + 1, importantIdx === -1 ? buffer.length : importantIdx).trim(),
    important: importantIdx !== -1,
  }
}
