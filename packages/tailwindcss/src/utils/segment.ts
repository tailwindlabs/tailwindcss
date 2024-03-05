/**
 * This splits a string on a top-level character.
 *
 * Regex doesn't support recursion (at least not the JS-flavored version).
 * So we have to use a tiny state machine to keep track of paren placement.
 *
 * Expected behavior using commas:
 * var(--a, 0 0 1px rgb(0, 0, 0)), 0 0 1px rgb(0, 0, 0)
 *        ┬              ┬  ┬    ┬
 *        x              x  x    ╰──────── Split because top-level
 *        ╰──────────────┴──┴───────────── Ignored b/c inside >= 1 levels of parens
 */
export function segment(input: string, separator: string) {
  // Stack of characters to close open brackets. Appending to a string because
  // it's faster than an array of strings.
  let closingBracketStack = ''
  let parts: string[] = []
  let lastPos = 0

  for (let idx = 0; idx < input.length; idx++) {
    let char = input[idx]

    if (closingBracketStack.length === 0 && char === separator) {
      parts.push(input.slice(lastPos, idx))
      lastPos = idx + 1
      continue
    }

    switch (char) {
      case '\\':
        // The next character is escaped, so we skip it.
        idx += 1
        break
      case '(':
        closingBracketStack += ')'
        break
      case '[':
        closingBracketStack += ']'
        break
      case '{':
        closingBracketStack += '}'
        break
      case ')':
      case ']':
      case '}':
        if (
          closingBracketStack.length > 0 &&
          char === closingBracketStack[closingBracketStack.length - 1]
        ) {
          closingBracketStack = closingBracketStack.slice(0, closingBracketStack.length - 1)
        }
        break
    }
  }

  parts.push(input.slice(lastPos))

  return parts
}
