import { addWhitespaceAroundMathOperators } from './math-operators'

const BACKSLASH = 0x5c
const UNDERSCORE = 0x5f
const DASH = 0x2d
const DOUBLE_QUOTE = 0x22
const SINGLE_QUOTE = 0x27
const LOWER_A = 0x61
const LOWER_Z = 0x7a
const UPPER_A = 0x41
const UPPER_Z = 0x5a
const ZERO = 0x30
const NINE = 0x39

export function decodeArbitraryValue(input: string): string {
  // We do not want to normalize anything inside of a url() because if we
  // replace `_` with ` `, then it will very likely break the url.
  if (input.startsWith('url(')) {
    return input
  }

  input = convertUnderscoresToWhitespace(input)
  input = addWhitespaceAroundMathOperators(input)

  return input
}

/**
 * Convert underscores `_` to whitespace ` `
 *
 * Except for:
 *
 * - Escaped underscores `\_`, these are converted to underscores `_`
 * - Dashed idents `--foo_bar`, these are left as-is
 *
 * Inside strings, dashed idents are considered to be normal strings without any
 * special meaning, so the `_` in "dashed idents" are converted to whitespace.
 */
function convertUnderscoresToWhitespace(input: string) {
  let output = ''
  let len = input.length

  for (let idx = 0; idx < len; idx++) {
    let char = input.charCodeAt(idx)

    // Escaped character, consume the next character as-is
    if (char === BACKSLASH) {
      output += input[++idx]
    }

    // Underscores are converted to whitespace
    else if (char === UNDERSCORE) {
      output += ' '
    }

    // Start of a dashed ident, consume the ident as-is
    else if (char === DASH && input.charCodeAt(idx + 1) === DASH) {
      let start = idx

      // Skip the first two dashes, we already know they are there
      idx += 2

      char = input.charCodeAt(idx)
      while (
        (char >= LOWER_A && char <= LOWER_Z) ||
        (char >= UPPER_A && char <= UPPER_Z) ||
        (char >= ZERO && char <= NINE) ||
        char === DASH ||
        char === UNDERSCORE ||
        char === BACKSLASH
      ) {
        // Escaped value, consume the next character as-is
        if (char === BACKSLASH) {
          // In theory, we can also escape a unicode code point where 1 to 6 hex
          // digits are allowed after the \. However, each hex digit is also a
          // valid ident character, so we can just consume the next character
          // as-is and go to the next character.
          idx += 1
        }

        // Next character
        char = input.charCodeAt(++idx)
      }

      output += input.slice(start, idx)

      // The last character was not a valid ident character, so we need to back
      // up one character.
      idx -= 1
    }

    // Start of a string
    else if (char === SINGLE_QUOTE || char === DOUBLE_QUOTE) {
      let quote = input[idx++]

      // Keep the quote
      output += quote

      // Consume to the end of the string, but replace any non-escaped
      // underscores with spaces.
      while (idx < len && input.charCodeAt(idx) !== char) {
        // Escaped character, consume the next character as-is
        if (input.charCodeAt(idx) === BACKSLASH) {
          output += input[++idx]
        }

        // Unescaped underscore
        else if (input.charCodeAt(idx) === UNDERSCORE) {
          output += ' '
        }

        // All other characters
        else {
          output += input[idx]
        }

        idx += 1
      }

      // Keep the end quote
      output += quote
    }

    // All other characters
    else {
      output += input[idx]
    }
  }

  return output
}
