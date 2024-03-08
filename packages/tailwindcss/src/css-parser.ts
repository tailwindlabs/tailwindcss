import { comment, rule, type AstNode, type Comment, type Declaration, type Rule } from './ast'

export function parse(input: string) {
  input = input.replaceAll('\r\n', '\n')

  let ast: AstNode[] = []
  let licenseComments: Comment[] = []

  let stack: (Rule | null)[] = []

  let parent = null as Rule | null
  let node = null as AstNode | null

  let current = ''
  let closingBracketStack = ''

  for (let i = 0; i < input.length; i++) {
    let char = input[i]

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
    if (char === '\\') {
      current += input.slice(i, i + 2)
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
    else if (char === '/' && input[i + 1] === '*') {
      let start = i

      for (let j = i + 2; j < input.length; j++) {
        // Current character is a `\` therefore the next character is escaped.
        if (input[j] === '\\') {
          j += 1
        }

        // End of the comment
        else if (input[j] === '*' && input[j + 1] === '/') {
          i = j + 1
          break
        }
      }

      let commentString = input.slice(start, i + 1)

      // Collect all license comments so that we can hoist them to the top of
      // the AST.
      if (commentString[2] === '!') {
        licenseComments.push(comment(commentString.slice(2, -2)))
      }
    }

    // Start of a string.
    else if (char === '"' || char === "'") {
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
        // Current character is a `\` therefore the next character is escaped.
        if (input[j] === '\\') {
          j += 1
        }

        // End of the string.
        else if (input[j] === char) {
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
        else if (input[j] === ';' && input[j + 1] === '\n') {
          throw new Error(`Unterminated string: ${input.slice(start, j + 1) + char}`)
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
        else if (input[j] === '\n') {
          throw new Error(`Unterminated string: ${input.slice(start, j) + char}`)
        }
      }

      // Adjust `current` to include the string.
      current += input.slice(start, i + 1)
    }

    // Skip whitespace if the next character is also whitespace. This allows us
    // to reduce the amount of whitespace in the AST.
    else if (
      (char === ' ' || char === '\n' || char === '\t') &&
      (input[i + 1] === ' ' || input[i + 1] === '\n' || input[i + 1] === '\t')
    ) {
      continue
    }

    // Start of a custom property.
    //
    // Custom properties are very permissive and can contain almost any
    // character, even `;` and `}`. Therefore we have to make sure that we are
    // at the correct "end" of the custom property by making sure everything is
    // balanced.
    else if (char === '-' && input[i + 1] === '-' && current.length === 0) {
      let closingBracketStack = ''

      let start = i
      let colonIdx = -1

      for (let j = i + 2; j < input.length; j++) {
        // Current character is a `\` therefore the next character is escaped.
        if (input[j] === '\\') {
          j += 1
        }

        // Start of a comment.
        else if (input[j] === '/' && input[j + 1] === '*') {
          for (let k = j + 2; k < input.length; k++) {
            // Current character is a `\` therefore the next character is escaped.
            if (input[k] === '\\') {
              k += 1
            }

            // End of the comment
            else if (input[k] === '*' && input[k + 1] === '/') {
              j = k + 1
              break
            }
          }
        }

        // End of the "property" of the property-value pair.
        else if (colonIdx === -1 && input[j] === ':') {
          colonIdx = current.length + j - start
        }

        // End of the custom property.
        else if (input[j] === ';' && closingBracketStack.length === 0) {
          current += input.slice(start, j)
          i = j
          break
        }

        // Start of a block.
        else if (input[j] === '(') {
          closingBracketStack += ')'
        } else if (input[j] === '[') {
          closingBracketStack += ']'
        } else if (input[j] === '{') {
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
        else if ((input[j] === '}' || input.length - 1 === j) && closingBracketStack.length === 0) {
          i = j - 1
          current += input.slice(start, j)
          break
        }

        // End of a block.
        else if (input[j] === ')' || input[j] === ']' || input[j] === '}') {
          if (
            closingBracketStack.length > 0 &&
            input[j] === closingBracketStack[closingBracketStack.length - 1]
          ) {
            closingBracketStack = closingBracketStack.slice(0, -1)
          }
        }
      }

      let declaration = parseDeclaration(current, colonIdx)
      if (parent) {
        parent.nodes.push(declaration)
      } else {
        ast.push(declaration)
      }

      current = ''
    }

    // End of a body-less at-rule.
    //
    // E.g.:
    //
    // ```css
    // @charset "UTF-8";
    //                 ^
    // ```
    else if (char === ';' && current[0] === '@') {
      node = rule(current, [])

      // At-rule is nested inside of a rule, attach it to the parent.
      if (parent) {
        parent.nodes.push(node)
      }

      // We are the root node which means we are done with the current node.
      else {
        ast.push(node)
      }

      // Reset the state for the next node.
      current = ''
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
    else if (char === ';') {
      let declaration = parseDeclaration(current)
      if (parent) {
        parent.nodes.push(declaration)
      } else {
        ast.push(declaration)
      }

      current = ''
    }

    // Start of a block.
    else if (char === '{') {
      closingBracketStack += '}'

      // At this point `current` should resemble a selector or an at-rule.
      node = rule(current.trim(), [])

      // Attach the rule to the parent in case it's nested.
      if (parent) {
        parent.nodes.push(node)
      }

      // Push the current node to the stack and make it the new parent.
      stack.push(parent)
      parent = node

      // Reset the state for the next node.
      current = ''
      node = null
    }

    // End of a block.
    else if (char === '}') {
      if (closingBracketStack === '') {
        throw new Error('Missing opening {')
      }

      closingBracketStack = closingBracketStack.slice(0, -1)

      // When we hit a `}` and `current` is filled in, then it means that we did
      // not complete the previous node yet. This means that we hit a
      // declaration without a `;` at the end.
      if (current.length > 0) {
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
        if (current[0] === '@') {
          node = rule(current.trim(), [])

          // At-rule is nested inside of a rule, attach it to the parent.
          if (parent) {
            parent.nodes.push(node)
          }

          // We are the root node which means we are done with the current node.
          else {
            ast.push(node)
          }

          // Reset the state for the next node.
          current = ''
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
          // Split `current` into a `property` and a `value`. At this point the
          // comments are already removed which means that we don't have to worry
          // about `:` inside of comments.
          let colonIdx = current.indexOf(':')

          // Attach the declaration to the parent.
          if (parent) {
            let importantIdx = current.indexOf('!important', colonIdx + 1)
            parent.nodes.push({
              kind: 'declaration',
              property: current.slice(0, colonIdx).trim(),
              value: current
                .slice(colonIdx + 1, importantIdx === -1 ? current.length : importantIdx)
                .trim(),
              important: importantIdx !== -1,
            } satisfies Declaration)
          }
        }
      }

      // We are done with the current node, which means we can go up one level
      // in the stack.
      let grandParent = stack.pop() ?? null

      // We are the root node which means we are done and contine with the next
      // node.
      if (grandParent === null && parent) {
        ast.push(parent)
      }

      // Go up one level in the stack.
      parent = grandParent

      // Reset the state for the next node.
      current = ''
      node = null
    }

    // Any other character is part of the current node.
    else {
      // Skip whitespace at the start of a new node.
      if (current.length === 0 && (char === ' ' || char === '\n' || char === '\t')) {
        continue
      }

      current += char
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

function parseDeclaration(current: string, colonIdx: number = current.indexOf(':')): Declaration {
  let importantIdx = current.indexOf('!important', colonIdx + 1)
  return {
    kind: 'declaration',
    property: current.slice(0, colonIdx).trim(),
    value: current.slice(colonIdx + 1, importantIdx === -1 ? current.length : importantIdx).trim(),
    important: importantIdx !== -1,
  }
}
