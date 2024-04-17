import { addWhitespaceAroundMathOperators } from './math-operators'

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

const BACKSLASH = 0x5c
const UNDERSCORE = 0x5f

/**
 * Convert `_` to ` `, except for escaped underscores `\_` they should be
 * converted to `_` instead.
 */
function convertUnderscoresToWhitespace(input: string) {
  let output = ''
  for (let idx = 0; idx < input.length; idx++) {
    let char = input.charCodeAt(idx)

    // Escaped underscore
    if (char === BACKSLASH && input.charCodeAt(idx + 1) === UNDERSCORE) {
      output += '_'
      idx += 1
    }

    // Unescaped underscore
    else if (char === UNDERSCORE) {
      output += ' '
    }

    // All other characters
    else {
      output += input[idx]
    }
  }

  return output
}
