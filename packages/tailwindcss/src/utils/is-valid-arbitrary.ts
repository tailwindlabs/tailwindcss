const BACKSLASH = 0x5c
const OPEN_CURLY = 0x7b
const CLOSE_CURLY = 0x7d
const OPEN_PAREN = 0x28
const CLOSE_PAREN = 0x29
const OPEN_BRACKET = 0x5b
const CLOSE_BRACKET = 0x5d
const DOUBLE_QUOTE = 0x22
const SINGLE_QUOTE = 0x27
const SEMICOLON = 0x3b
const SLASH = 0x2f
const ASTERISK = 0x2a
const LINE_FEED = 0x0a
const CARRIAGE_RETURN = 0x0d
const FORM_FEED = 0x0c
const LOWER_A = 0x61
const LOWER_Z = 0x7a
const UPPER_A = 0x41
const UPPER_Z = 0x5a
const ZERO = 0x30
const NINE = 0x39
const DASH = 0x2d
const SPACE = 0x20
const TAB = 0x09
const UNDERSCORE = 0x5f
const HASH = 0x23
const AT_SIGN = 0x40
const COLON = 0x3a

// This is a shared buffer that is used to keep track of the current nesting level
// of parens, brackets, and braces. It is used to determine if a character is at
// the top-level of a string. This is a performance optimization to avoid memory
// allocations on every call to `segment`.
const closingBracketStack = new Uint8Array(256)

/**
 * Determine if a given string might be a valid arbitrary value.
 *
 * Unbalanced parens, brackets, and braces are not allowed. Additionally, a
 * top-level `;` is not allowed, and neither is `/*` outside of a string.
 *
 * Set `isDeclarationValue` when the input becomes the value of a declaration,
 * like `bg-[…]` or `[color:…]`. Then a `/*` is allowed in an unquoted `url(…)`
 * too, e.g. `bg-[url(/a/*.png)]`.
 *
 * Values that contain `</style` are not allowed either. The generated CSS can
 * be inlined in a `<style>` element, and `</style` would end that element.
 *
 * This function is very similar to `segment` but `segment` cannot be used
 * because we'd need to split on a bracket stack character.
 */
export function isValidArbitrary(input: string, isDeclarationValue = false) {
  // SAFETY: We can use an index into a shared buffer because this function is
  // synchronous, non-recursive, and runs in a single-threaded environment.
  let stackPos = 0
  let len = input.length

  // The stack position of a function that `decodeArbitraryValue` keeps each
  // `_` in, also in nested functions, or -1. E.g.: a lowercase `url(…)`.
  let keepUnderscoresUntil = -1

  // If the current word has an escape in it. CSS decodes escapes in function
  // names, so `u\72l(…)` is a `url(…)`. No candidate needs that, so we reject
  // a function name with an escape in it.
  let escapeInWord = false

  for (let idx = 0; idx < len; idx++) {
    let char = input.charCodeAt(idx)

    switch (char) {
      case BACKSLASH: {
        let next = input.charCodeAt(idx + 1)

        // CSS reads `\/` as an escaped `/`, but PostCSS does not. So `\/*`
        // starts a comment there.
        if (next === SLASH && input.charCodeAt(idx + 2) === ASTERISK) return false

        // `\_` is a literal `_` in a candidate, not a CSS escape. E.g.:
        // `w-[--my\_fn(1px)]` calls the `--my_fn` function.
        if (next !== UNDERSCORE) escapeInWord = true

        // The next character is escaped, so we skip it.
        idx += 1

        // A hex escape has up to 6 hex digits, and one whitespace after them
        // is part of it. An `_` becomes that whitespace later. E.g.: `u\72_l`
        // is `url`.
        if (isHexDigit(next)) {
          let end = idx + 6
          while (idx + 1 < end && isHexDigit(input.charCodeAt(idx + 1))) idx++

          let after = input.charCodeAt(idx + 1)
          if (
            after === UNDERSCORE ||
            after === SPACE ||
            after === TAB ||
            after === LINE_FEED ||
            after === CARRIAGE_RETURN ||
            after === FORM_FEED
          ) {
            idx++
          }
        }
        break
      }
      // Strings should be handled as-is until the end of the string. No need to
      // worry about balancing parens, brackets, or curlies inside a string.
      case SINGLE_QUOTE:
      case DOUBLE_QUOTE:
        // Ensure we don't go out of bounds.
        while (++idx < len) {
          let nextChar = input.charCodeAt(idx)

          // The next character is escaped, so we skip it.
          if (nextChar === BACKSLASH) {
            idx += 1
            continue
          }

          if (nextChar === char) {
            break
          }

          // An unescaped newline ends a string in CSS, so the rest of the
          // input is not inside of a string anymore. E.g.: `content-['a\n/*']`
          if (nextChar === LINE_FEED || nextChar === CARRIAGE_RETURN || nextChar === FORM_FEED) {
            return false
          }
        }

        // A string without a closing quote is invalid. Otherwise, a quote can
        // pair up with a quote in the CSS around it. E.g.: `[a':'/*']` becomes
        // `a': '/*';`, and the `/*` is not inside of a string anymore.
        if (idx >= len) return false
        break
      case OPEN_PAREN: {
        if (escapeInWord) return false

        let keepsUnderscores = keepsUnderscoresAt(input, idx)

        // CSS reads an unquoted `url(…)` as a single token that ends at the
        // first `)`. A quote in it does not start a string, so we reject it,
        // and a `(` too. E.g.: `url(foo'bar)/*')` would start a comment after
        // the first `)`.
        //
        // An `_` becomes a space, except in a lowercase `url(…)` or a function
        // name that ends in `_url`. So `URL(_'a.png')` is a quoted
        // `URL( 'a.png')`, but `url(_'a.png')`, `url('a',URL(_'b'))` and
        // `--my\_url(URL(_'b'))` keep the `_`.
        let underscoreIsSpace = !keepsUnderscores && keepUnderscoresUntil === -1
        if (isUrlFunctionAt(input, idx) && !startsWithQuote(input, idx, underscoreIsSpace)) {
          // A `/*` in the `url(…)` is not a comment in CSS. But PostCSS reads
          // fewer forms as a `url(…)`, and a `/*` in the other forms starts a
          // comment there. E.g.: `URL(/a/*.png)` or `a,url(/a/*.png)`.
          let allowComment =
            isDeclarationValue && isPostCssUrlAt(input, idx, keepUnderscoresUntil === -1)

          while (++idx < len) {
            let nextChar = input.charCodeAt(idx)

            // The next character is escaped, so we skip it. But PostCSS reads
            // `\/*` as a comment, if it does not read this as a `url(…)`.
            if (nextChar === BACKSLASH) {
              if (
                !allowComment &&
                input.charCodeAt(idx + 1) === SLASH &&
                input.charCodeAt(idx + 2) === ASTERISK
              ) {
                return false
              }

              idx += 1
              continue
            }

            if (nextChar === CLOSE_PAREN) break

            if (nextChar === SINGLE_QUOTE || nextChar === DOUBLE_QUOTE || nextChar === OPEN_PAREN) {
              return false
            }

            if (nextChar === SLASH && input.charCodeAt(idx + 1) === ASTERISK && !allowComment) {
              return false
            }
          }

          // The `url(…)` has no closing `)`.
          if (idx >= len) return false
          break
        }

        if (keepsUnderscores && keepUnderscoresUntil === -1) {
          keepUnderscoresUntil = stackPos
        }

        closingBracketStack[stackPos] = CLOSE_PAREN
        stackPos++
        break
      }
      case OPEN_BRACKET:
        closingBracketStack[stackPos] = CLOSE_BRACKET
        stackPos++
        break
      case OPEN_CURLY:
        // NOTE: We intentionally do not consider `{` to move the stack pointer
        // because a candidate like `[&{color:red}]:flex` should not be valid.
        break
      case CLOSE_BRACKET:
      case CLOSE_CURLY:
      case CLOSE_PAREN:
        if (stackPos === 0) return false

        if (stackPos > 0 && char === closingBracketStack[stackPos - 1]) {
          // SAFETY: The buffer does not need to be mutated because the stack is
          // only ever read from or written to its current position. Its current
          // position is only ever incremented after writing to it. Meaning that
          // the buffer can be dirty for the next use and still be correct since
          // reading/writing always starts at position `0`.
          stackPos--
          if (stackPos === keepUnderscoresUntil) keepUnderscoresUntil = -1
        } else if (char !== CLOSE_CURLY) {
          return false
        }

        break
      case SEMICOLON:
        if (stackPos === 0) return false
        break
      // A `/*` starts a CSS comment. An unterminated one would comment out the
      // CSS that comes after it. We reject every `/*`, not only unterminated
      // ones, because no candidate needs a comment. Use a string if you need
      // a literal `/*`, e.g. `content-['/*']` or `bg-[url('/*.png')]`. An
      // unquoted `url(…)` can have one too, e.g. `bg-[url(/*.png)]` (see above).
      case SLASH:
        if (input.charCodeAt(idx + 1) === ASTERISK) return false
        break
    }

    // The word ends at a character that can't be part of a name. An `_`
    // becomes a space later, so it ends the word too.
    if (escapeInWord && char !== BACKSLASH && !isNameChar(char)) {
      escapeInWord = false
    }
  }

  if (stackPos !== 0) return false

  if (containsStyleEndTag(input)) return false

  return true
}

const STYLE_END_TAG = /<\/style/i
const HEX_DIGIT = /[0-9a-fA-F]/

/**
 * Determine if the input contains `</style` (case-insensitive) once CSS
 * escapes are decoded, e.g.: `\3c /style` or `<\/style`.
 */
function containsStyleEndTag(input: string) {
  // Fast path: without a `<` or a `\` there is no `</style` to decode.
  if (input.indexOf('<') === -1 && input.indexOf('\\') === -1) return false

  let decoded = ''
  for (let i = 0; i < input.length; i++) {
    let char = input[i]
    if (char !== '\\') {
      decoded += char
      continue
    }

    // `\` followed by 1 to 6 hex digits, and an optional whitespace
    let hex = ''
    while (hex.length < 6 && HEX_DIGIT.test(input[i + 1] ?? '')) {
      hex += input[++i]
    }

    if (hex.length > 0) {
      decoded += String.fromCodePoint(Math.min(parseInt(hex, 16), 0x10ffff))

      // A whitespace (`\r\n` counts as one) ends the escape. An `_` becomes a
      // space in arbitrary values, so it can end the escape as well.
      let next = input[i + 1]
      if (next === '\r' && input[i + 2] === '\n') i += 2
      else if (
        next === ' ' ||
        next === '\t' ||
        next === '\n' ||
        next === '\r' ||
        next === '\f' ||
        next === '_'
      ) {
        i += 1
      }
    }

    // `\` followed by a newline (`\r\n` counts as one) is removed in a string,
    // so `</s\<LF>tyle` becomes `</style` once it is minified.
    else if (input[i + 1] === '\r' && input[i + 2] === '\n') {
      i += 2
    } else if (input[i + 1] === '\n' || input[i + 1] === '\r' || input[i + 1] === '\f') {
      i += 1
    }

    // `\` followed by any other character is that character
    else if (i + 1 < input.length) {
      decoded += input[++i]
    }
  }

  return STYLE_END_TAG.test(decoded)
}

function isHexDigit(char: number) {
  return (
    (char >= ZERO && char <= NINE) ||
    (char >= LOWER_A && char <= 0x66) /* f */ ||
    (char >= UPPER_A && char <= 0x46) /* F */
  )
}

function isNameChar(char: number) {
  return (
    (char >= LOWER_A && char <= LOWER_Z) ||
    (char >= UPPER_A && char <= UPPER_Z) ||
    (char >= ZERO && char <= NINE) ||
    char === DASH ||
    char >= 0x80
  )
}

/**
 * Determine if CSS reads the `(` at `idx` as the start of a `url(…)`, like in
 * `url(…)` or `no-repeat_url(…)`, but not in `my-url(…)`. Function names are
 * case-insensitive, so `URL(…)` is a `url(…)` too.
 */
function isUrlFunctionAt(input: string, idx: number) {
  if (idx < 3) return false

  let u = input.charCodeAt(idx - 3)
  let r = input.charCodeAt(idx - 2)
  let l = input.charCodeAt(idx - 1)

  if ((u | 0x20) !== 0x75 /* u */ || (r | 0x20) !== 0x72 /* r */ || (l | 0x20) !== 0x6c /* l */) {
    return false
  }

  // The `url` must be the whole function name. An `_` becomes a space later,
  // so `no-repeat_url(…)` has a `url(…)` too. But `\_` stays an `_`, so
  // `--my\_url(…)` calls the `--my_url` function. CSS reads `#url` and `@url`
  // as a hash and an at-keyword, so a normal `(` comes after them.
  if (idx > 3) {
    let char = input.charCodeAt(idx - 4)
    if (isNameChar(char) || char === BACKSLASH || char === HASH || char === AT_SIGN) return false
    if (char === UNDERSCORE && isEscaped(input, idx - 4)) return false
  }

  return true
}

/**
 * Determine if PostCSS reads the `(` at `idx` as the start of a `url(…)` too.
 * It does for a lowercase `url` at the start of the value, after whitespace,
 * after a `(` or after a `:`, if no whitespace comes after the `(`. E.g.:
 * `url(…)`, `no-repeat_url(…)`, `image-set(url(…))` and `image:url(…)`, but
 * not `URL(…)` or `a,url(…)`.
 */
function isPostCssUrlAt(input: string, idx: number, underscoreIsSpace: boolean) {
  if (
    input.charCodeAt(idx - 3) !== 0x75 /* u */ ||
    input.charCodeAt(idx - 2) !== 0x72 /* r */ ||
    input.charCodeAt(idx - 1) !== 0x6c /* l */
  ) {
    return false
  }

  if (isWhitespace(input.charCodeAt(idx + 1))) return false

  if (idx === 3) return true

  let char = input.charCodeAt(idx - 4)
  if (char === OPEN_PAREN || isWhitespace(char)) return true

  // A type hint like `image:` is not in the CSS. Else CSS reads the `:` as a
  // colon, and PostCSS ends the word before the `url` at it too. But not an
  // at-word, so in `@a:url(…)` the `url` is part of the `@a:url` at-word.
  if (char === COLON) return !isInAtWord(input, idx - 4)

  // `decodeArbitraryValue` turns `\\_` into `\_`, not into `\ `. So we only
  // count an `_` without a `\` in front of it.
  return char === UNDERSCORE && underscoreIsSpace && input.charCodeAt(idx - 5) !== BACKSLASH
}

/**
 * Determine if PostCSS reads the character at `idx` as part of an at-word. An
 * at-word starts at an `@`, and ends at whitespace or one of `"#'()/;[\]{}`.
 */
function isInAtWord(input: string, idx: number) {
  for (let i = idx - 1; i >= 0; i--) {
    let char = input.charCodeAt(i)
    if (char === AT_SIGN) return true
    if (
      isWhitespace(char) ||
      char === DOUBLE_QUOTE ||
      char === HASH ||
      char === SINGLE_QUOTE ||
      char === OPEN_PAREN ||
      char === CLOSE_PAREN ||
      char === SLASH ||
      char === SEMICOLON ||
      char === OPEN_BRACKET ||
      char === BACKSLASH ||
      char === CLOSE_BRACKET ||
      char === OPEN_CURLY ||
      char === CLOSE_CURLY
    ) {
      return false
    }
  }

  return false
}

function isWhitespace(char: number) {
  return (
    char === SPACE ||
    char === TAB ||
    char === LINE_FEED ||
    char === CARRIAGE_RETURN ||
    char === FORM_FEED
  )
}

/**
 * Determine if `decodeArbitraryValue` keeps each `_` in the function at `idx`.
 * It does for a function name that is `url` or that ends in `_url`, also in
 * `\_url`. So `--my\_url(…)` keeps them, but it is not a `url(…)` in CSS.
 */
function keepsUnderscoresAt(input: string, idx: number) {
  if (idx < 3) return false

  if (
    input.charCodeAt(idx - 3) !== 0x75 /* u */ ||
    input.charCodeAt(idx - 2) !== 0x72 /* r */ ||
    input.charCodeAt(idx - 1) !== 0x6c /* l */
  ) {
    return false
  }

  return idx === 3 || !isNameChar(input.charCodeAt(idx - 4))
}

/**
 * Determine if the character at `idx` is escaped. It is, if an odd number of
 * backslashes comes before it. E.g.: `\_` is, but `\\_` is not.
 */
function isEscaped(input: string, idx: number) {
  let count = 0
  while (idx - count - 1 >= 0 && input.charCodeAt(idx - count - 1) === BACKSLASH) count++
  return count % 2 === 1
}

/**
 * Determine if the argument of the function at `idx` starts with a quote.
 * CSS skips the whitespace after the `(` first.
 */
function startsWithQuote(input: string, idx: number, underscoreIsSpace: boolean) {
  let next = idx + 1
  while (next < input.length) {
    let char = input.charCodeAt(next)
    if (
      char !== SPACE &&
      char !== TAB &&
      char !== LINE_FEED &&
      char !== CARRIAGE_RETURN &&
      char !== FORM_FEED &&
      !(char === UNDERSCORE && underscoreIsSpace)
    )
      break
    next++
  }

  let char = input.charCodeAt(next)
  return char === SINGLE_QUOTE || char === DOUBLE_QUOTE
}
