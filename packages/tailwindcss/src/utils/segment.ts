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
const closingBracketStack = new Uint8Array(256)
const OPEN_PAREN = '('.charCodeAt(0)
const OPEN_BRACKET = '['.charCodeAt(0)
const OPEN_BRACE = '{'.charCodeAt(0)
const CLOSE_PAREN = ')'.charCodeAt(0)
const CLOSE_BRACKET = ']'.charCodeAt(0)
const CLOSE_BRACE = '}'.charCodeAt(0)
const BACKSLASH = '\\'.charCodeAt(0)

export function segment(input: string, separator: string) {
  // Since JavaScript is single-threaded, using a shared buffer
  // is more efficient and should still be safe.
  let stackPointer = 0
  let parts: string[] = []
  let lastPos = 0

  let separatorCode = separator.charCodeAt(0)

  for (let idx = 0; idx < input.length; idx++) {
    let char = input.charCodeAt(idx)

    if (stackPointer === 0 && char === separatorCode) {
      parts.push(input.slice(lastPos, idx))
      lastPos = idx + 1
      continue
    }

    switch (char) {
      case BACKSLASH:
        // The next character is escaped, so we skip it.
        idx += 1
        break
      case OPEN_PAREN:
        closingBracketStack[stackPointer] = CLOSE_PAREN
        stackPointer++
        break
      case OPEN_BRACKET:
        closingBracketStack[stackPointer] = CLOSE_BRACKET
        stackPointer++
        break
      case OPEN_BRACE:
        closingBracketStack[stackPointer] = CLOSE_BRACE
        stackPointer++
        break
      case CLOSE_BRACKET:
      case CLOSE_BRACE:
      case CLOSE_PAREN:
        if (stackPointer > 0 && char === closingBracketStack[stackPointer - 1]) {
          // No need to mutate the buffer here, as it can stay dirty for the next use
          stackPointer--
        }
        break
    }
  }

  parts.push(input.slice(lastPos))

  return parts
}
