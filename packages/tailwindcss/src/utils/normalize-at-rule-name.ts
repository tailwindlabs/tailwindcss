import { toAsciiLowerCase } from './to-ascii-lower-case'

const AT_SIGN = 0x40
const CARRIAGE_RETURN = 0x0d
const FORM_FEED = 0x0c
const LINE_BREAK = 0x0a
const OPEN_CURLY = 0x7b
const OPEN_PAREN = 0x28
const SPACE = 0x20
const TAB = 0x09

/**
 * Lowercase the name of the at-rule at the start of a variant selector, e.g.
 * the `@MEDIA` in `@MEDIA print`. At-rule names are ASCII case-insensitive.
 *
 * The rest of the selector stays as written, so `@MEDIA(width>=40rem)` becomes
 * `@media(width>=40rem)`. Other selectors, like `&:hover`, stay as they are.
 */
export function normalizeAtRuleName(selector: string): string {
  if (selector.charCodeAt(0) !== AT_SIGN) return selector

  // The name ends at the first whitespace, `(` or `{`
  let end = 1
  while (end < selector.length) {
    let char = selector.charCodeAt(end)
    if (
      char === SPACE ||
      char === TAB ||
      char === LINE_BREAK ||
      char === CARRIAGE_RETURN ||
      char === FORM_FEED ||
      char === OPEN_PAREN ||
      char === OPEN_CURLY
    ) {
      break
    }
    end++
  }

  let name = selector.slice(0, end)
  let normalizedName = toAsciiLowerCase(name)
  if (normalizedName === name) return selector

  return normalizedName + selector.slice(end)
}
