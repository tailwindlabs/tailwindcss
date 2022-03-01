let KEYWORDS = new Set(['inset', 'inherit', 'initial', 'revert', 'unset'])
let SPACE = /\ +(?![^(]*\))/g // Similar to the one above, but with spaces instead.
let LENGTH = /^-?(\d+|\.\d+)(.*?)$/g

let SPECIALS = /[(),]/g

/**
 * This splits a string on top-level commas.
 *
 * Regex doesn't support recursion (at least not the JS-flavored version).
 * So we have to use a tiny state machine to keep track of paren vs comma
 * placement. Before we'd only exclude commas from the inner-most nested
 * set of parens rather than any commas that were not contained in parens
 * at all which is the intended behavior here.
 *
 * Expected behavior:
 * var(--a, 0 0 1px rgb(0, 0, 0)), 0 0 1px rgb(0, 0, 0)
 *       ─┬─             ┬  ┬    ┬
 *        x              x  x    ╰──────── Split because top-level
 *        ╰──────────────┴──┴───────────── Ignored b/c inside >= 1 levels of parens
 *
 * @param {string} input
 */
function* splitByTopLevelCommas(input) {
  SPECIALS.lastIndex = -1

  let depth = 0
  let lastIndex = 0
  let found = false

  // Find all parens & commas
  // And only split on commas if they're top-level
  for (let match of input.matchAll(SPECIALS)) {
    if (match[0] === '(') depth++
    if (match[0] === ')') depth--
    if (match[0] === ',' && depth === 0) {
      found = true

      yield input.substring(lastIndex, match.index)
      lastIndex = match.index + match[0].length
    }
  }

  // Provide the last segment of the string if available
  // Otherwise the whole string since no commas were found
  // This mirrors the behavior of string.split()
  if (found) {
    yield input.substring(lastIndex)
  } else {
    yield input
  }
}

export function parseBoxShadowValue(input) {
  let shadows = Array.from(splitByTopLevelCommas(input))
  return shadows.map((shadow) => {
    let value = shadow.trim()
    let result = { raw: value }
    let parts = value.split(SPACE)
    let seen = new Set()

    for (let part of parts) {
      // Reset index, since the regex is stateful.
      LENGTH.lastIndex = 0

      // Keyword
      if (!seen.has('KEYWORD') && KEYWORDS.has(part)) {
        result.keyword = part
        seen.add('KEYWORD')
      }

      // Length value
      else if (LENGTH.test(part)) {
        if (!seen.has('X')) {
          result.x = part
          seen.add('X')
        } else if (!seen.has('Y')) {
          result.y = part
          seen.add('Y')
        } else if (!seen.has('BLUR')) {
          result.blur = part
          seen.add('BLUR')
        } else if (!seen.has('SPREAD')) {
          result.spread = part
          seen.add('SPREAD')
        }
      }

      // Color or unknown
      else {
        if (!result.color) {
          result.color = part
        } else {
          if (!result.unknown) result.unknown = []
          result.unknown.push(part)
        }
      }
    }

    // Check if valid
    result.valid = result.x !== undefined && result.y !== undefined

    return result
  })
}

export function formatBoxShadowValue(shadows) {
  return shadows
    .map((shadow) => {
      if (!shadow.valid) {
        return shadow.raw
      }

      return [shadow.keyword, shadow.x, shadow.y, shadow.blur, shadow.spread, shadow.color]
        .filter(Boolean)
        .join(' ')
    })
    .join(', ')
}
