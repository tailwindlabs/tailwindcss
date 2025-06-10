const MATH_FUNCTIONS = [
  'calc',
  'min',
  'max',
  'clamp',
  'mod',
  'rem',
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'atan2',
  'pow',
  'sqrt',
  'hypot',
  'log',
  'exp',
  'round',
]

export function hasMathFn(input: string) {
  return input.indexOf('(') !== -1 && MATH_FUNCTIONS.some((fn) => input.includes(`${fn}(`))
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
    let char = input[i]
    let charCode = char.charCodeAt(0)

    // Track if we see a number followed by a unit, then we know for sure that
    // this is not a function call.
    if (charCode >= 48 && charCode <= 57) {
      valuePos = i
    }

    // If we saw a number before, and we see normal a-z character, then we
    // assume this is a value such as `123px`
    else if (valuePos !== null && charCode >= 97 && charCode <= 122) {
      valuePos = i
    }

    // Once we see something else, we reset the value position
    else {
      lastValuePos = valuePos
      valuePos = null
    }

    // Determine if we're inside a math function
    if (char === '(') {
      result += char

      // Scan backwards to determine the function name. This assumes math
      // functions are named with lowercase alphanumeric characters.
      let start = i

      for (let j = i - 1; j >= 0; j--) {
        let inner = input.charCodeAt(j)

        if (inner >= 48 && inner <= 57) {
          start = j // 0-9
        } else if (inner >= 97 && inner <= 122) {
          start = j // a-z
        } else {
          break
        }
      }

      let fn = input.slice(start, i)

      // This is a known math function so start formatting
      if (MATH_FUNCTIONS.includes(fn)) {
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
    else if (char === ')') {
      result += char
      formattable.shift()
    }

    // Add spaces after commas in math functions
    else if (char === ',' && formattable[0]) {
      result += `, `
      continue
    }

    // Skip over consecutive whitespace
    else if (char === ' ' && formattable[0] && result[result.length - 1] === ' ') {
      continue
    }

    // Add whitespace around operators inside math functions
    else if ((char === '+' || char === '*' || char === '/' || char === '-') && formattable[0]) {
      let trimmed = result.trimEnd()
      let prev = trimmed[trimmed.length - 1]
      let prevCode = prev.charCodeAt(0)
      let prevPrevCode = trimmed.charCodeAt(trimmed.length - 2)

      let next = input[i + 1]
      let nextCode = next?.charCodeAt(0)

      // Do not add spaces for scientific notation, e.g.: `-3.4e-2`
      if ((prev === 'e' || prev === 'E') && prevPrevCode >= 48 && prevPrevCode <= 57) {
        result += char
        continue
      }

      // If we're preceded by an operator don't add spaces
      else if (prev === '+' || prev === '*' || prev === '/' || prev === '-') {
        result += char
        continue
      }

      // If we're at the beginning of an argument don't add spaces
      else if (prev === '(' || prev === ',') {
        result += char
        continue
      }

      // Add spaces only after the operator if we already have spaces before it
      else if (input[i - 1] === ' ') {
        result += `${char} `
      }

      // Add spaces around the operator, if...
      else if (
        // Previous is a digit
        (prevCode >= 48 && prevCode <= 57) ||
        // Next is a digit
        (nextCode >= 48 && nextCode <= 57) ||
        // Previous is end of a function call (or parenthesized expression)
        prev === ')' ||
        // Next is start of a parenthesized expression
        next === '(' ||
        // Next is an operator
        next === '+' ||
        next === '*' ||
        next === '/' ||
        next === '-' ||
        // Previous position was a value (+ unit)
        (lastValuePos !== null && lastValuePos === i - 1)
      ) {
        result += ` ${char} `
      }

      // Everything else
      else {
        result += char
      }
    }

    // Handle all other characters
    else {
      result += char
    }
  }

  return result
}
