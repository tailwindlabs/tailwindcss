const LOWER_A = 0x61
const LOWER_Z = 0x7a
const UPPER_A = 0x41
const UPPER_Z = 0x5a
const LOWER_E = 0x65
const UPPER_E = 0x45
const ZERO = 0x30
const NINE = 0x39
const ADD = 0x2b
const SUB = 0x2d
const MUL = 0x2a
const DIV = 0x2f
const OPEN_PAREN = 0x28
const CLOSE_PAREN = 0x29
const COMMA = 0x2c
const SPACE = 0x20
const PERCENT = 0x25
const UNDERSCORE = 0x5f
const BACKSLASH = 0x5c
const DOUBLE_QUOTE = 0x22
const SINGLE_QUOTE = 0x27

const MATH_FUNCTIONS = [
  'abs',
  'acos',
  'asin',
  'atan',
  'atan2',
  'calc',
  'clamp',
  'cos',
  'exp',
  'hypot',
  'log',
  'max',
  'min',
  'mod',
  'pow',
  'rem',
  'round',
  'sign',
  'sin',
  'sqrt',
  'tan',
]

const MATH_FUNCTIONS_SET = new Set(MATH_FUNCTIONS)

// Characters that can be part of a CSS identifier: `a-z`, `A-Z`, `0-9`, `-`,
// `_` and non-ASCII characters.
function isIdentChar(char: number) {
  return (
    (char >= LOWER_A && char <= LOWER_Z) ||
    (char >= UPPER_A && char <= UPPER_Z) ||
    (char >= ZERO && char <= NINE) ||
    char === SUB ||
    char === UNDERSCORE ||
    char >= 0x80
  )
}

export function hasMathFn(input: string) {
  let paren = input.indexOf('(')

  while (paren !== -1) {
    // Scan backwards to the start of the function name. A math function name
    // only counts when it's the whole name, so `--my-calc(…)` is not `calc(…)`.
    // Function names are case-insensitive, so `CALC(…)` is `calc(…)`.
    let start = paren
    while (start > 0 && isIdentChar(input.charCodeAt(start - 1))) start--

    if (start < paren && MATH_FUNCTIONS_SET.has(input.slice(start, paren).toLowerCase())) {
      return true
    }

    paren = input.indexOf('(', paren + 1)
  }

  return false
}

// Whether the math function name that starts at `start` is the start of a
// function call. A `-` before it can be an operator (`1px-min(…)`) or a sign
// (`-min(…)`), but not part of a custom function name like `--my-calc(…)`.
function isMathFnStart(input: string, start: number) {
  if (start === 0) return true

  let prev = input.charCodeAt(start - 1)
  if (prev !== SUB) return !isIdentChar(prev)

  let identStart = start - 1
  while (identStart > 0 && isIdentChar(input.charCodeAt(identStart - 1))) identStart--

  return !(input.charCodeAt(identStart) === SUB && input.charCodeAt(identStart + 1) === SUB)
}

export function addWhitespaceAroundMathOperators(input: string) {
  // Bail early if there are no math functions in the input
  if (!MATH_FUNCTIONS.some((fn) => input.includes(fn))) {
    return input
  }

  let result = ''
  let formattable: boolean[] = []

  let valuePos = null
  let lastValuePos = null

  for (let i = 0; i < input.length; i++) {
    let char = input.charCodeAt(i)

    // Track if we see a number followed by a unit, then we know for sure that
    // this is not a function call.
    if (char >= ZERO && char <= NINE) {
      valuePos = i
    }

    // If we saw a number before, and we see normal a-z character, then we
    // assume this is a value such as `123px`
    else if (
      valuePos !== null &&
      (char === PERCENT ||
        (char >= LOWER_A && char <= LOWER_Z) ||
        (char >= UPPER_A && char <= UPPER_Z))
    ) {
      valuePos = i
    }

    // Once we see something else, we reset the value position
    else {
      lastValuePos = valuePos
      valuePos = null
    }

    // The next character is escaped, so we skip it.
    if (char === BACKSLASH) {
      result += input.slice(i, i + 2)
      i += 1
      continue
    }

    // Strings should be handled as-is until the end of the string
    if (char === SINGLE_QUOTE || char === DOUBLE_QUOTE) {
      let start = i

      while (++i < input.length) {
        let nextChar = input.charCodeAt(i)

        // The next character is escaped, so we skip it.
        if (nextChar === BACKSLASH) {
          i += 1
          continue
        }

        if (nextChar === char) {
          break
        }
      }

      result += input.slice(start, i + 1)
      continue
    }

    // Determine if we're inside a math function
    if (char === OPEN_PAREN) {
      result += input[i]

      // Scan backwards to determine the function name. This assumes math
      // functions are named with alphanumeric characters.
      let start = i

      for (let j = i - 1; j >= 0; j--) {
        let inner = input.charCodeAt(j)

        if (inner >= ZERO && inner <= NINE) {
          start = j // 0-9
        } else if (inner >= LOWER_A && inner <= LOWER_Z) {
          start = j // a-z
        } else if (inner >= UPPER_A && inner <= UPPER_Z) {
          start = j // A-Z
        } else {
          break
        }
      }

      let fn = input.slice(start, i)

      // This is a known math function so start formatting. Function names are
      // case-insensitive, so `Calc(…)` is `calc(…)`.
      if (MATH_FUNCTIONS_SET.has(fn.toLowerCase()) && isMathFnStart(input, start)) {
        formattable.unshift(true)
        continue
      }

      // We've encountered nested parens inside a math function, record that and
      // keep formatting until we've closed all parens.
      else if (formattable[0] && fn === '') {
        formattable.unshift(true)
        continue
      }

      // This is not a known math function so don't format it
      formattable.unshift(false)
      continue
    }

    // We've exited the function so format according to the parent function's
    // type.
    else if (char === CLOSE_PAREN) {
      result += input[i]
      formattable.shift()
    }

    // Add spaces after commas in math functions
    else if (char === COMMA && formattable[0]) {
      result += `, `
      continue
    }

    // Skip over consecutive whitespace
    else if (char === SPACE && formattable[0] && result.charCodeAt(result.length - 1) === SPACE) {
      continue
    }

    // Add whitespace around operators inside math functions
    else if ((char === ADD || char === MUL || char === DIV || char === SUB) && formattable[0]) {
      let trimmed = result.trimEnd()
      let prev = trimmed.charCodeAt(trimmed.length - 1)
      let prevPrev = trimmed.charCodeAt(trimmed.length - 2)
      let next = input.charCodeAt(i + 1)

      // Do not add spaces for scientific notation, e.g.: `-3.4e-2`
      if ((prev === LOWER_E || prev === UPPER_E) && prevPrev >= ZERO && prevPrev <= NINE) {
        result += input[i]
        continue
      }

      // If we're preceded by an operator don't add spaces
      else if (prev === ADD || prev === MUL || prev === DIV || prev === SUB) {
        result += input[i]
        continue
      }

      // If we're at the beginning of an argument don't add spaces
      else if (prev === OPEN_PAREN || prev === COMMA) {
        result += input[i]
        continue
      }

      // Add spaces only after the operator if we already have spaces before it
      else if (input.charCodeAt(i - 1) === SPACE) {
        result += `${input[i]} `
      }

      // Add spaces around the operator, if...
      else if (
        // Previous is a digit
        (prev >= ZERO && prev <= NINE) ||
        // Next is a digit
        (next >= ZERO && next <= NINE) ||
        // Previous is end of a function call (or parenthesized expression)
        prev === CLOSE_PAREN ||
        // Next is start of a parenthesized expression
        next === OPEN_PAREN ||
        // Next is an operator
        next === ADD ||
        next === MUL ||
        next === DIV ||
        next === SUB ||
        // Previous position was a value (+ unit)
        (lastValuePos !== null && lastValuePos === i - 1)
      ) {
        result += ` ${input[i]} `
      }

      // Everything else
      else {
        result += input[i]
      }
    }

    // Handle all other characters
    else {
      result += input[i]
    }
  }

  return result
}
