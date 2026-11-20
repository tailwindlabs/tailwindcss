const UPPER_A = 0x41
const UPPER_Z = 0x5a

/**
 * Lowercase the ASCII letters `A-Z` of a string and keep all other characters
 * as they are. CSS keywords are ASCII case-insensitive, e.g. `@MEDIA` and
 * `@media` are the same at-rule.
 *
 * Unlike `String.prototype.toLowerCase()`, this never changes a non-ASCII
 * character, so the length of the string stays the same.
 *
 * See: https://infra.spec.whatwg.org/#ascii-lowercase
 */
export function toAsciiLowerCase(value: string): string {
  for (let i = 0; i < value.length; i++) {
    let char = value.charCodeAt(i)
    if (char >= UPPER_A && char <= UPPER_Z) {
      return value.slice(0, i) + value.slice(i).replace(/[A-Z]+/g, lowerCase)
    }
  }

  // Most values are lowercase already, so we can return them as-is.
  return value
}

function lowerCase(letters: string) {
  return letters.toLowerCase()
}
