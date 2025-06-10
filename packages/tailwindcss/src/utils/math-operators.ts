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

// List of known keywords that can be used in math functions
const KNOWN_DASHED_KEYWORDS = ['fit-content', 'min-content', 'max-content', 'to-zero']
const DASHED_KEYWORDS_REGEX = new RegExp(`(${KNOWN_DASHED_KEYWORDS.join('|')})`, 'g')

const KNOWN_DASHED_FUNCTIONS = ['anchor-size', 'calc-size']
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
  let resumeAtIdx = 0

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
      let prevprevCode = trimmed.charCodeAt(trimmed.length - 2)

      // Do not add spaces for scientific notation, e.g.: `-3.4e-2`
      if ((prev === 'e' || prev === 'E') && prevprevCode >= 48 && prevprevCode <= 57) {
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

      // Add spaces around the operator
      else {
        result += ` ${char} `
      }
    }

    // Skip over hyphenated keywords when in a math function.
    //
    // This is specifically to handle this value in the round(…) function:
    //
    // ```
    // round(to-zero, 1px)
    //       ^^^^^^^
    // ```
    //
    // Or when using `fit-content`, `min-content` or `max-content` in a math
    // function:
    //
    // ```
    // min(fit-content, calc(100dvh - 4rem) - calc(50dvh - -2px))
    //     ^^^^^^^^^^^
    // ```
    else if (formattable[0] && i >= resumeAtIdx) {
      DASHED_KEYWORDS_REGEX.lastIndex = 0
      let match = DASHED_KEYWORDS_REGEX.exec(input.slice(i))
      if (match === null) {
        // No match at all, we can skip this check entirely for the rest of the
        // string because we known nothing else will match.
        resumeAtIdx = input.length
        result += char
        continue
      }

      // Match must be at the start of the string, otherwise track the index
      // to resume at.
      if (match.index !== 0) {
        resumeAtIdx = i + match.index
        result += char
        continue
      }

      let keyword = match[1]
      let start = i
      i += keyword.length
      result += input.slice(start, i + 1)

      // If the keyword is followed by a `,`, it means we're in a math function.
      // Adding a space for pretty-printing purposes.
      if (input[i] === ',') result += ' '
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
