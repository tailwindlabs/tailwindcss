import { toAsciiLowerCase } from './to-ascii-lower-case'

const COLON = 0x3a
const DASH = 0x2d
const DOT = 0x2e
const LOWER_A = 0x61
const LOWER_Z = 0x7a
const NINE = 0x39
const PLUS = 0x2b
const UPPER_A = 0x41
const UPPER_Z = 0x5a
const ZERO = 0x30

/**
 * Lowercase the scheme of a URL, e.g. `HTTPS://example.com/A.png` becomes
 * `https://example.com/A.png`. Schemes are ASCII case-insensitive, but the rest
 * of a URL can be case-sensitive, so it stays as written.
 *
 * A scheme starts with a letter, followed by letters, digits, `+`, `-` or `.`,
 * and ends with a `:`. A single letter is a Windows drive instead, like the `C`
 * in `C:/styles/app.css`, so it stays as written too.
 *
 * See: https://datatracker.ietf.org/doc/html/rfc3986#section-3.1
 */
export function normalizeUrlScheme(url: string): string {
  let hasUpperCase = false

  for (let i = 0; i < url.length; i++) {
    let char = url.charCodeAt(i)

    if (char >= UPPER_A && char <= UPPER_Z) {
      hasUpperCase = true
    }

    // The end of the scheme
    else if (char === COLON) {
      if (!hasUpperCase || i < 2) return url
      return toAsciiLowerCase(url.slice(0, i)) + url.slice(i)
    }

    // Any other character means there is no scheme. Digits, `+`, `-` and `.`
    // are part of a scheme, but they can't start one.
    else if (
      (char < LOWER_A || char > LOWER_Z) &&
      (i === 0 || ((char < ZERO || char > NINE) && char !== PLUS && char !== DASH && char !== DOT))
    ) {
      return url
    }
  }

  return url
}
