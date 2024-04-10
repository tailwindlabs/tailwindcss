import * as Token from '../tokens'

// This is a shared buffer that is used to keep track of the current nesting level
// of parens, brackets, and braces. It is used to determine if a character is at
// the top-level of a string. This is a performance optimization to avoid memory
// allocations on every call to `segment`.
const closingBracketStack = new Uint8Array(256)

/**
 * This splits a string on a top-level character.
 *
 * Regex doesn't support recursion (at least not the JS-flavored version),
 * so we have to use a tiny state machine to keep track of paren placement.
 *
 * Expected behavior using commas:
 * var(--a, 0 0 1px rgb(0, 0, 0)), 0 0 1px rgb(0, 0, 0)
 *        ┬              ┬  ┬    ┬
 *        x              x  x    ╰──────── Split because top-level
 *        ╰──────────────┴──┴───────────── Ignored b/c inside >= 1 levels of parens
 */
export function segment(input: string, separator: string) {
  // SAFETY: We can use an index into a shared buffer because this function is
  // synchronous, non-recursive, and runs in a single-threaded envionment.
  let stackPos = 0
  let parts: string[] = []
  let lastPos = 0

  let separatorCode = separator.charCodeAt(0)

  for (let idx = 0; idx < input.length; idx++) {
    let char = input.charCodeAt(idx)

    if (stackPos === 0 && char === separatorCode) {
      parts.push(input.slice(lastPos, idx))
      lastPos = idx + 1
      continue
    }

    switch (char) {
      case Token.BACKSLASH:
        // The next character is escaped, so we skip it.
        idx += 1
        break
      case Token.OPEN_PAREN:
        closingBracketStack[stackPos] = Token.CLOSE_PAREN
        stackPos++
        break
      case Token.OPEN_BRACKET:
        closingBracketStack[stackPos] = Token.CLOSE_BRACKET
        stackPos++
        break
      case Token.OPEN_CURLY:
        closingBracketStack[stackPos] = Token.CLOSE_CURLY
        stackPos++
        break
      case Token.CLOSE_BRACKET:
      case Token.CLOSE_CURLY:
      case Token.CLOSE_PAREN:
        if (stackPos > 0 && char === closingBracketStack[stackPos - 1]) {
          // SAFETY: The buffer does not need to be mutated because the stack is
          // only ever read from or written to its current position. Its current
          // position is only ever incremented after writing to it. Meaning that
          // the buffer can be dirty for the next use and still be correct since
          // reading/writing always starts at position `0`.
          stackPos--
        }
        break
    }
  }

  parts.push(input.slice(lastPos))

  return parts
}
