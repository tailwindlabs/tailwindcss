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

/**
 * Convert `_` to ` `, except for escaped underscores `\_` they should be
 * converted to `_` instead.
 */
function convertUnderscoresToWhitespace(input: string) {
  let output = ''
  for (let i = 0; i < input.length; i++) {
    let char = input[i]

    // Escaped underscore
    if (char === '\\' && input[i + 1] === '_') {
      output += '_'
      i += 1
    }

    // Unescaped underscore
    else if (char === '_') {
      output += ' '
    }

    // All other characters
    else {
      output += char
    }
  }

  return output
}
