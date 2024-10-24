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

const KNOWN_DASHED_FUNCTIONS = ['anchor-size']
const DASHED_FUNCTIONS_REGEX = new RegExp(`(${KNOWN_DASHED_FUNCTIONS.join('|')})\\(`, 'g')

export function hasMathFn(input: string) {
  return input.indexOf('(') !== -1 && MATH_FUNCTIONS.some((fn) => input.includes(`${fn}(`))
}

export function addWhitespaceAroundMathOperators(input: string) {
  // Bail early if there are no math functions in the input
  if (!MATH_FUNCTIONS.some((fn) => input.includes(fn))) {
    return input
  }

  // Replace known functions with a placeholder
  let hasKnownFunctions = false
  if (KNOWN_DASHED_FUNCTIONS.some((fn) => input.includes(fn))) {
    DASHED_FUNCTIONS_REGEX.lastIndex = 0
    input = input.replace(DASHED_FUNCTIONS_REGEX, (_, fn) => {
      hasKnownFunctions = true
      return `$${KNOWN_DASHED_FUNCTIONS.indexOf(fn)}$(`
    })
  }

  let result = ''
  let formattable: boolean[] = []

  for (let i = 0; i < input.length; i++) {
    let char = input[i]

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

      // If we're preceded by an operator don't add spaces
      if (prev === '+' || prev === '*' || prev === '/' || prev === '-') {
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

      // Add spaces around the operator
      else {
        result += ` ${char} `
      }
    }

    // Skip over `to-zero` when in a math function.
    //
    // This is specifically to handle this value in the round(…) function:
    //
    // ```
    // round(to-zero, 1px)
    //       ^^^^^^^
    // ```
    //
    // This is because the first argument is optionally a keyword and `to-zero`
    // contains a hyphen and we want to avoid adding spaces inside it.
    else if (formattable[0] && input.startsWith('to-zero', i)) {
      let start = i
      i += 7
      result += input.slice(start, i + 1)
    }

    // Handle all other characters
    else {
      result += char
    }
  }

  if (hasKnownFunctions) {
    return result.replace(/\$(\d+)\$/g, (fn, idx) => KNOWN_DASHED_FUNCTIONS[idx] ?? fn)
  }

  return result
}
