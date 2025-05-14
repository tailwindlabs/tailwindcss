import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'

// Canonicalize the value to its minimal form. This will normalize whitespace,
// and print the important modifier `!` in the correct place.
//
// E.g.:
//
// ```
// [display:_flex_] => [display:flex]
// [display:_flex]  => [display:flex]
// [display:flex_]  => [display:flex]
// [display:flex]   => [display:flex]
// ```
//
export function migrateCanonicalizeCandidate(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
) {
  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    let canonicalizedCandidate = designSystem.printCandidate(readonlyCandidate)
    if (canonicalizedCandidate !== rawCandidate) {
      return canonicalizedCandidate
    }
  }

  return rawCandidate
}
