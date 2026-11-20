import * as ValueParser from '../value-parser'
import { walk, WalkAction } from '../walk'
import { addWhitespaceAroundMathOperators } from './math-operators'
import { findFunctionNameStart, isDashed, normalizeFunctionName } from './normalize-function-name'
import { normalizeUrlScheme } from './normalize-url-scheme'
import { toAsciiLowerCase } from './to-ascii-lower-case'

const BACKSLASH = 0x5c
const DASH = 0x2d
const DOUBLE_QUOTE = 0x22
const LOWER_A = 0x61
const LOWER_Z = 0x7a
const NINE = 0x39
const NON_ASCII = 0x80
const OPEN_PAREN = 0x28
const SINGLE_QUOTE = 0x27
const UPPER_A = 0x41
const UPPER_Z = 0x5a
const ZERO = 0x30

const HAS_UPPER_CASE = /[A-Z]/

// A number with an optional exponent and unit, e.g. `10PX`, `-.5EM` or `1E3`.
// The unit has to start with a letter, so a dashed unit, like the `--Foo` in
// `10--Foo`, is not part of it.
const NUMBER_WITH_UNIT = /^[+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?(?:[a-z][a-z\d-]*)?$/i

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
 * Lowercase the names of the functions in a raw arbitrary value, e.g. the `URL`
 * in `bg-[URL(…)]`. Function names are ASCII case-insensitive, except for
 * dashed functions, like `--my-fn(…)`. See `normalizeFunctionName`.
 *
 * This has to happen before we validate the value, because we treat a `url(…)`
 * differently than other functions. E.g. we keep each `_` in a `url(…)`, so
 * `URL(my_image.png)` has to be a `url(…)` too.
 *
 * An `_` becomes a space later, so the name in `Spin_CALC(…)` is `CALC`. But a
 * `\_` is a literal `_`, so `--my\_FN(…)` is the dashed function `--my_FN`.
 */
export function normalizeFunctionNames(input: string): string {
  // There are definitely no functions in the input, or no uppercase letters in
  // their names, so bail early
  if (input.indexOf('(') === -1 || !HAS_UPPER_CASE.test(input)) return input

  let result = ''
  let lastIdx = 0

  // The start of the current name, or -1
  let nameStart = -1
  let hasUpperCase = false

  for (let i = 0; i < input.length; i++) {
    let char = input.charCodeAt(i)

    // Uppercase letters are part of a name
    if (char >= UPPER_A && char <= UPPER_Z) {
      if (nameStart === -1) nameStart = i
      hasUpperCase = true
    }

    // The end of a function name
    else if (char === OPEN_PAREN) {
      if (hasUpperCase) {
        // The name can start after a number, e.g. the `theme` in `100PX-theme(…)`
        let start = findFunctionNameStart(input, nameStart, i)

        // Dashed functions are case-sensitive, e.g. `--MY-FN(…)`
        if (!isDashed(input, start)) {
          let name = input.slice(start, i)
          let normalizedName = normalizeFunctionName(name)
          if (normalizedName !== name) {
            result += input.slice(lastIdx, start) + normalizedName
            lastIdx = i
          }
        }
      }

      nameStart = -1
      hasUpperCase = false
    }

    // An escaped character is part of a name, e.g. the `\_` in `--my\_fn`
    else if (char === BACKSLASH) {
      if (nameStart === -1) nameStart = i
      char = input.charCodeAt(++i)
      if (char >= UPPER_A && char <= UPPER_Z) hasUpperCase = true
    }

    // Skip over strings, e.g. the `FN(` in `'FN('` is not a function
    else if (char === SINGLE_QUOTE || char === DOUBLE_QUOTE) {
      let end = i + 1
      while (end < input.length && input.charCodeAt(end) !== char) {
        // Skip over the escaped character, e.g. the `\'` in `'a\'b'`
        if (input.charCodeAt(end) === BACKSLASH) end += 1
        end += 1
      }
      i = end

      nameStart = -1
      hasUpperCase = false
    }

    // Other characters that are part of a name
    else if (
      (char >= LOWER_A && char <= LOWER_Z) ||
      (char >= ZERO && char <= NINE) ||
      char === DASH ||
      char >= NON_ASCII
    ) {
      if (nameStart === -1) nameStart = i
    }

    // Any other character ends the name, including `_`
    else {
      nameStart = -1
      hasUpperCase = false
    }
  }

  // Nothing changed
  if (lastIdx === 0) return input

  return result + input.slice(lastIdx)
}

/**
 * Lowercase the exponents and units of the numbers in a decoded value, e.g.
 * `10PX` becomes `10px`, and `1E3` becomes `1e3`. They are ASCII
 * case-insensitive, but we infer the type of a value with lowercase units.
 *
 * Strings, `url(…)`s and identifiers stay as written, e.g. `'10PX'`,
 * `url(/10PX.png)` and `spacing.10PX`. So do dashed units, like `10--Foo`.
 *
 * Only use this for the value of a declaration. E.g. in `data-[size=10PX]`,
 * the `10PX` is an attribute value, which is case-sensitive.
 */
export function normalizeUnits(input: string): string {
  // There are definitely no uppercase letters in numbers, so bail early. Most
  // values have no uppercase letters at all, and a regex sees that sooner.
  if (!HAS_UPPER_CASE.test(input) || !hasUpperCaseInNumber(input)) return input

  let ast = ValueParser.parse(input)
  let changed = false

  walk(ast, (node) => {
    // The contents of a `url(…)` are a URL, e.g. `url(/10PX.png)`
    if (node.kind === 'function' && node.value === 'url') return WalkAction.Skip

    if (node.kind === 'word' && NUMBER_WITH_UNIT.test(node.value)) {
      let value = toAsciiLowerCase(node.value)
      if (value !== node.value) {
        node.value = value
        changed = true
      }
    }
  })

  return changed ? ValueParser.toCss(ast) : input
}

/**
 * Lowercase the scheme of each `url(…)` in a decoded value, e.g.
 * `url(HTTPS://example.com/A.png)` becomes `url(https://example.com/A.png)`.
 * The rest of a URL stays as written. See `normalizeUrlScheme`.
 *
 * Only use this for the value of a declaration, like `normalizeUnits`.
 */
export function normalizeUrlSchemes(input: string): string {
  // There are definitely no URLs in the input, or no uppercase letters in their
  // schemes, so bail early
  if (input.indexOf('url(') === -1 || !HAS_UPPER_CASE.test(input)) return input

  let ast = ValueParser.parse(input)
  let changed = false

  walk(ast, (node) => {
    if (node.kind !== 'function' || node.value !== 'url') return

    // The URL can be a string, e.g. `url('HTTPS://example.com/A.png')`
    let url = ValueParser.toCss(node.nodes)
    let quote = url[0] === '"' || url[0] === "'" ? url[0] : ''
    let normalizedUrl = quote + normalizeUrlScheme(url.slice(quote.length))

    if (normalizedUrl !== url) {
      node.nodes = [ValueParser.word(normalizedUrl)]
      changed = true
    }

    return WalkAction.Skip
  })

  return changed ? ValueParser.toCss(ast) : input
}

/**
 * Whether an uppercase letter comes after a digit, with only lowercase letters,
 * digits and `-` between them. E.g. the `P` in `10PX`, the `E` in `1E3` or the
 * `X` in `10pX`. Each number with an uppercase letter in it has one.
 *
 * This is a loop instead of a regex like `/\d[a-z\d-]*[A-Z]/`, because that
 * regex takes quadratic time on a long run of digits.
 */
function hasUpperCaseInNumber(input: string): boolean {
  let afterDigit = false

  for (let i = 0; i < input.length; i++) {
    let char = input.charCodeAt(i)

    if (char >= UPPER_A && char <= UPPER_Z) {
      if (afterDigit) return true
    } else if (char >= ZERO && char <= NINE) {
      afterDigit = true
    } else if ((char < LOWER_A || char > LOWER_Z) && char !== DASH) {
      afterDigit = false
    }
  }

  return false
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
