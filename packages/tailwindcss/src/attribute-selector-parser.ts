const TAB = 9
const LINE_BREAK = 10
const CARRIAGE_RETURN = 13
const SPACE = 32
const DOUBLE_QUOTE = 34
const DOLLAR = 36
const SINGLE_QUOTE = 39
const ASTERISK = 42
const EQUALS = 61
const UPPER_I = 73
const UPPER_S = 83
const BACKSLASH = 92
const CARET = 94
const LOWER_I = 105
const LOWER_S = 115
const PIPE = 124
const TILDE = 126
const LOWER_A = 97
const LOWER_Z = 122
const UPPER_A = 65
const UPPER_Z = 90
const ZERO = 48
const NINE = 57
const DASH = 45
const UNDERSCORE = 95

interface AttributeSelector {
  attribute: string
  operator: '=' | '~=' | '|=' | '^=' | '$=' | '*=' | null
  quote: '"' | "'" | null
  value: string | null
  sensitivity: 'i' | 's' | null
}

export function parse(input: string): AttributeSelector | null {
  // Must start with `[` and end with `]`
  if (input[0] !== '[' || input[input.length - 1] !== ']') {
    return null
  }

  let i = 1
  let start = i
  let end = input.length - 1

  // Skip whitespace, e.g.: [   data-foo]
  //                         ^^^
  while (isAsciiWhitespace(input.charCodeAt(i))) i++

  // Attribute name, e.g.: [data-foo]
  //                        ^^^^^^^^
  {
    start = i
    for (; i < end; i++) {
      let currentChar = input.charCodeAt(i)
      // Skip escaped character
      if (currentChar === BACKSLASH) {
        i++
        continue
      }
      if (currentChar >= UPPER_A && currentChar <= UPPER_Z) continue
      if (currentChar >= LOWER_A && currentChar <= LOWER_Z) continue
      if (currentChar >= ZERO && currentChar <= NINE) continue
      if (currentChar === DASH || currentChar === UNDERSCORE) continue
      break
    }

    // Must have at least one character in the attribute name
    if (start === i) {
      return null
    }
  }
  let attribute = input.slice(start, i)

  // Skip whitespace, e.g.: [data-foo   =value]
  //                                 ^^^
  while (isAsciiWhitespace(input.charCodeAt(i))) i++

  // At the end, e.g.: `[data-foo]`
  if (i === end) {
    return {
      attribute,
      operator: null,
      quote: null,
      value: null,
      sensitivity: null,
    }
  }

  // Operator, e.g.: [data-foo*=value]
  //                          ^^
  let operator = null
  let currentChar = input.charCodeAt(i)
  if (currentChar === EQUALS) {
    operator = '='
    i++
  } else if (
    (currentChar === TILDE ||
      currentChar === PIPE ||
      currentChar === CARET ||
      currentChar === DOLLAR ||
      currentChar === ASTERISK) &&
    input.charCodeAt(i + 1) === EQUALS
  ) {
    operator = input[i] + '='
    i += 2
  } else {
    return null // Invalid operator
  }

  // Skip whitespace, e.g.: [data-foo*=   value]
  //                                   ^^^
  while (isAsciiWhitespace(input.charCodeAt(i))) i++

  // At the end, that means that we have an operator but no valid, which is
  // invalid, e.g.: `[data-foo*=]`
  if (i === end) {
    return null
  }

  // Value, e.g.: [data-foo*=value]
  //                         ^^^^^
  let value = ''

  // Quoted value, e.g.: [data-foo*="value"]
  //                                ^^^^^^^
  let quote = null
  currentChar = input.charCodeAt(i)
  if (currentChar === SINGLE_QUOTE || currentChar === DOUBLE_QUOTE) {
    quote = input[i] as '"' | "'"
    i++

    start = i
    for (let j = i; j < end; j++) {
      let current = input.charCodeAt(j)
      // Found ending quote
      if (current === currentChar) {
        i = j + 1
      }

      // Skip escaped character
      else if (current === BACKSLASH) {
        j++
      }
    }

    value = input.slice(start, i - 1)
  }

  // Unquoted value, e.g.: [data-foo*=value]
  //                                  ^^^^^
  else {
    start = i
    // Keep going until we find whitespace or the end
    while (i < end && !isAsciiWhitespace(input.charCodeAt(i))) i++
    value = input.slice(start, i)
  }

  // Skip whitespace, e.g.: [data-foo*=value   ]
  //                                        ^^^
  while (isAsciiWhitespace(input.charCodeAt(i))) i++

  // At the end, e.g.: `[data-foo=value]`
  if (i === end) {
    return {
      attribute,
      operator: operator as '=' | '~=' | '|=' | '^=' | '$=' | '*=',
      quote: quote as '"' | "'" | null,
      value,
      sensitivity: null,
    }
  }

  // Sensitivity, e.g.: [data-foo=value i]
  //                                    ^
  let sensitivity = null
  {
    switch (input.charCodeAt(i)) {
      case LOWER_I:
      case UPPER_I: {
        sensitivity = 'i'
        i++
        break
      }

      case LOWER_S:
      case UPPER_S: {
        sensitivity = 's'
        i++
        break
      }

      default:
        return null // Invalid sensitivity
    }
  }

  // Skip whitespace, e.g.: [data-foo=value i   ]
  //                                         ^^^
  while (isAsciiWhitespace(input.charCodeAt(i))) i++

  // We must be at the end now, if not, then there is an additional character
  // after the sensitivity which is invalid, e.g.: [data-foo=value iX]
  //                                                                ^
  if (i !== end) {
    return null
  }

  // Fully done
  return {
    attribute,
    operator: operator as '=' | '~=' | '|=' | '^=' | '$=' | '*=',
    quote: quote as '"' | "'" | null,
    value,
    sensitivity: sensitivity as 'i' | 's' | null,
  }
}

function isAsciiWhitespace(code: number): boolean {
  switch (code) {
    case SPACE:
    case TAB:
    case LINE_BREAK:
    case CARRIAGE_RETURN:
      return true

    default:
      return false
  }
}
