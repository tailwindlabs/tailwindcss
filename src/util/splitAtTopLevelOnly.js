import * as regex from '../lib/regex'

/**
 * This splits a string on a top-level character.
 *
 * Regex doesn't support recursion (at least not the JS-flavored version).
 * So we have to use a tiny state machine to keep track of paren placement.
 *
 * Expected behavior using commas:
 * var(--a, 0 0 1px rgb(0, 0, 0)), 0 0 1px rgb(0, 0, 0)
 *       ─┬─             ┬  ┬    ┬
 *        x              x  x    ╰──────── Split because top-level
 *        ╰──────────────┴──┴───────────── Ignored b/c inside >= 1 levels of parens
 *
 * @param {string} input
 * @param {string} char
 */
export function* splitAtTopLevelOnly(input, char) {
  let SPECIALS = new RegExp(`[(){}\\[\\]${regex.escape(char)}]`, 'g')

  let depth = 0
  let lastIndex = 0
  let found = false

  // Find all paren-like things & character
  // And only split on commas if they're top-level
  for (let match of input.matchAll(SPECIALS)) {
    if (match[0] === '(') depth++
    if (match[0] === ')') depth--
    if (match[0] === '[') depth++
    if (match[0] === ']') depth--
    if (match[0] === '{') depth++
    if (match[0] === '}') depth--
    if (match[0] === char && depth === 0) {
      found = true

      yield input.substring(lastIndex, match.index)
      lastIndex = match.index + match[0].length
    }
  }

  // Provide the last segment of the string if available
  // Otherwise the whole string since no `char`s were found
  // This mirrors the behavior of string.split()
  if (found) {
    yield input.substring(lastIndex)
  } else {
    yield input
  }
}
