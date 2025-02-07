import * as ValueParser from '../value-parser'
import { addWhitespaceAroundMathOperators } from './math-operators'

export function decodeArbitraryValue(input: string): string {
  // There are definitely no functions in the input, so bail early
  if (input.indexOf('(') === -1) {
    return convertUnderscoresToWhitespace(input)
  }

  let ast = ValueParser.parse(input)
  recursivelyDecodeArbitraryValues(ast)
  input = ValueParser.toCss(ast)

  input = addWhitespaceAroundMathOperators(input)

  return input
}

/**
 * Convert `_` to ` `, except for escaped underscores `\_` they should be
 * converted to `_` instead.
 */
function convertUnderscoresToWhitespace(input: string, skipUnderscoreToSpace = false) {
  let output = ''
  for (let i = 0; i < input.length; i++) {
    let char = input[i]

    // Escaped underscore
    if (char === '\\' && input[i + 1] === '_') {
      output += '_'
      i += 1
    }

    // Unescaped underscore
    else if (char === '_' && !skipUnderscoreToSpace) {
      output += ' '
    }

    // All other characters
    else {
      output += char
    }
  }

  return output
}

function recursivelyDecodeArbitraryValues(ast: ValueParser.ValueAstNode[]) {
  for (let node of ast) {
    switch (node.kind) {
      case 'function': {
        if (node.value === 'url' || node.value.endsWith('_url')) {
          // Don't decode underscores in url() but do decode the function name
          node.value = convertUnderscoresToWhitespace(node.value)
          break
        }

        if (
          node.value === 'var' ||
          node.value.endsWith('_var') ||
          node.value === 'theme' ||
          node.value.endsWith('_theme')
        ) {
          node.value = convertUnderscoresToWhitespace(node.value)
          for (let i = 0; i < node.nodes.length; i++) {
            // Don't decode underscores to spaces in the first argument of var()
            if (i == 0 && node.nodes[i].kind === 'word') {
              node.nodes[i].value = convertUnderscoresToWhitespace(node.nodes[i].value, true)
              continue
            }
            recursivelyDecodeArbitraryValues([node.nodes[i]])
          }
          break
        }

        node.value = convertUnderscoresToWhitespace(node.value)
        recursivelyDecodeArbitraryValues(node.nodes)
        break
      }
      case 'separator':
      case 'word': {
        node.value = convertUnderscoresToWhitespace(node.value)
        break
      }
      default:
        never(node)
    }
  }
}

function never(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}
