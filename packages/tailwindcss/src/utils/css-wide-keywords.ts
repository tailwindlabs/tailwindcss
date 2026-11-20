import { toAsciiLowerCase } from './to-ascii-lower-case'

const LOWERCASE_BIT = 0x20
const LOWER_I = 0x69
const LOWER_R = 0x72
const LOWER_U = 0x75

/**
 * The keywords that each property accepts, also custom properties.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/Data_types#css-wide_keywords
 */
export const CSS_WIDE_KEYWORDS = new Set([
  'initial',
  'inherit',
  'revert',
  'revert-layer',
  'revert-rule',
  'unset',
])

/**
 * Lowercase the value of a declaration when it is a CSS-wide keyword, e.g.
 * `INITIAL` becomes `initial`. These keywords are ASCII case-insensitive, also
 * in custom properties, and they are always the whole value. We lowercase them
 * when we parse a declaration, so the rest of the code can compare them as-is.
 */
export function normalizeCssWideKeyword(value: string): string {
  // Each keyword starts with an `i`, `r` or `u`, and has 5 to 12 characters.
  // Most values don't, so bail early. Setting the `LOWERCASE_BIT` turns an
  // ASCII uppercase letter into its lowercase form.
  let char = value.charCodeAt(0) | LOWERCASE_BIT
  if (char !== LOWER_I && char !== LOWER_R && char !== LOWER_U) return value
  if (value.length < 5 || value.length > 12) return value

  let keyword = toAsciiLowerCase(value)
  return CSS_WIDE_KEYWORDS.has(keyword) ? keyword : value
}
