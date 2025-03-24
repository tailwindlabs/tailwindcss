const BACKSLASH = 0x5c
const OPEN_CURLY = 0x7b
const CLOSE_CURLY = 0x7d
const OPEN_PAREN = 0x28
const CLOSE_PAREN = 0x29
const OPEN_BRACKET = 0x5b
const CLOSE_BRACKET = 0x5d
const DOUBLE_QUOTE = 0x22
const SINGLE_QUOTE = 0x27
const SEMICOLON = 0x3b

// This is a shared buffer that is used to keep track of the current nesting level
// of parens, brackets, and braces. It is used to determine if a character is at
// the top-level of a string. This is a performance optimization to avoid memory
// allocations on every call to `segment`.
const closingBracketStack = new Uint8Array(256)

/**
 * Determine if a given string might be a valid arbitrary value.
 *
 * Unbalanced parens, brackets, and braces are not allowed. Additionally, a
 * top-level `;` is not allowed.
 *
 * This function is very similar to `segment` but `segment` cannot be used
 * because we'd need to split on a bracket stack character.
 */
export function isValidArbitrary(input: string) {
  // SAFETY: We can use an index into a shared buffer because this function is
  // synchronous, non-recursive, and runs in a single-threaded environment.
  let stackPos = 0
  let len = input.length

  for (let idx = 0; idx < len; idx++) {
    let char = input.charCodeAt(idx)

    switch (char) {
      case BACKSLASH:
        // The next character is escaped, so we skip it.
        idx += 1
        break
      // Strings should be handled as-is until the end of the string. No need to
      // worry about balancing parens, brackets, or curlies inside a string.
      case SINGLE_QUOTE:
      case DOUBLE_QUOTE:
        // Ensure we don't go out of bounds.
        while (++idx < len) {
          let nextChar = input.charCodeAt(idx)

          // The next character is escaped, so we skip it.
          if (nextChar === BACKSLASH) {
            idx += 1
            continue
          }

          if (nextChar === char) {
            break
          }
        }
        break
      case OPEN_PAREN:
        closingBracketStack[stackPos] = CLOSE_PAREN
        stackPos++
        break
      case OPEN_BRACKET:
        closingBracketStack[stackPos] = CLOSE_BRACKET
        stackPos++
        break
      case OPEN_CURLY:
        // NOTE: We intentionally do not consider `{` to move the stack pointer
        // because a candidate like `[&{color:red}]:flex` should not be valid.
        break
      case CLOSE_BRACKET:
      case CLOSE_CURLY:
      case CLOSE_PAREN:
        if (stackPos === 0) return false

        if (stackPos > 0 && char === closingBracketStack[stackPos - 1]) {
          // SAFETY: The buffer does not need to be mutated because the stack is
          // only ever read from or written to its current position. Its current
          // position is only ever incremented after writing to it. Meaning that
          // the buffer can be dirty for the next use and still be correct since
          // reading/writing always starts at position `0`.
          stackPos--
        }
        break
      case SEMICOLON:
        if (stackPos === 0) return false
        break
    }
  }

  return true
}
