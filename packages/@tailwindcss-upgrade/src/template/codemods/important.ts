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
): string {
  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    if (candidate.important && candidate.raw[candidate.raw.length - 1] !== '!') {
      // The printCandidate function will already put the exclamation mark in
      // the right place, so we just need to mark this candidate as requiring a
      // migration.
      return printCandidate(designSystem, candidate)
    }
  }

  return rawCandidate
}
