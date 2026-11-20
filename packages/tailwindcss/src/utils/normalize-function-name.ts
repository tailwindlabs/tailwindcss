import { toAsciiLowerCase } from './to-ascii-lower-case'

const DASH = 0x2d
const NINE = 0x39
const ZERO = 0x30

// The functions that CSS spells in camelCase.
const CAMEL_CASE_FUNCTIONS = new Map(
  [
    'rotateX',
    'rotateY',
    'rotateZ',
    'scaleX',
    'scaleY',
    'scaleZ',
    'skewX',
    'skewY',
    'translateX',
    'translateY',
    'translateZ',
  ].map((name) => [name.toLowerCase(), name]),
)

/**
 * Function names are ASCII case-insensitive, e.g. `CALC(…)` is `calc(…)`. We
 * print them in lowercase, except for the functions that CSS spells in
 * camelCase, e.g. `ROTATEX(…)` is `rotateX(…)`.
 *
 * Dashed functions, like `--my-fn(…)`, are case-sensitive, so don't use this
 * for them.
 */
export function normalizeFunctionName(name: string): string {
  let lowerCaseName = toAsciiLowerCase(name)
  return CAMEL_CASE_FUNCTIONS.get(lowerCaseName) ?? lowerCaseName
}

/**
 * Whether the identifier at `idx` is dashed, e.g. `--my-fn`.
 */
export function isDashed(value: string, idx: number): boolean {
  return value.charCodeAt(idx) === DASH && value.charCodeAt(idx + 1) === DASH
}

/**
 * Find the start of the function name in `value.slice(start, end)`, a run of
 * identifier characters before a `(`.
 *
 * A name can't start with a digit. So when the run starts with a number, the
 * `-` after it is a math operator, and the name starts after that. E.g. the
 * name in `1px-calc(…)` or in `-1e-3-calc(…)` is `calc`.
 *
 * Returns `end` when there is no name.
 */
export function findFunctionNameStart(value: string, start: number, end: number): number {
  let idx = start

  while (idx < end) {
    let char = value.charCodeAt(idx)

    // A `-` followed by a digit is the sign of a number, e.g. `-1px`
    if (char === DASH) char = value.charCodeAt(idx + 1)

    // Not a number, so this is the start of the name
    if (char < ZERO || char > NINE) return idx

    // Skip over the number and its unit, up to the next `-`
    let dashIdx = value.indexOf('-', idx + 1)
    if (dashIdx === -1 || dashIdx >= end) return end
    idx = dashIdx + 1
  }

  return end
}
