import type { Config } from 'tailwindcss'
import { parseCandidate } from '../../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { printCandidate } from '../candidates'

// In v3 the important modifier `!` sits in front of the utility itself, not
// before any of the variants. In v4, we want it to be at the end of the utility
// so that it's always in the same location regardless of whether you used
// variants or not.
//
// So this:
//
//   !flex md:!block
//
// Should turn into:
//
//   flex! md:block!
export function important(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
  location?: {
    contents: string
    start: number
    end: number
  },
): string {
  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    if (candidate.important && candidate.raw[candidate.raw.length - 1] !== '!') {
      // The important migration is one of the most broad migrations with a high
      // potential of matching false positives since `!` is a valid character in
      // most programming languages. Since v4 is technically backward compatible
      // to v3 in that it can read `!` in the front of the utility too, we err
      // on the side of caution and only migrate candidates that we are certain
      // are inside of a string.
      if (location) {
        let charBefore = location.contents.at(location.start - 1)
        let charAfter = location.contents.at(location.end)

        if (
          charBefore !== undefined &&
          charBefore !== '"' &&
          charBefore !== "'" &&
          charBefore !== '`' &&
          charBefore !== ' '
        ) {
          continue
        }
        if (
          charAfter !== undefined &&
          charAfter !== '"' &&
          charAfter !== "'" &&
          charAfter !== '`' &&
          charAfter !== ' '
        ) {
          continue
        }
      }

      // The printCandidate function will already put the exclamation mark in
      // the right place, so we just need to mark this candidate as requiring a
      // migration.
      return printCandidate(designSystem, candidate)
    }
  }

  return rawCandidate
}
