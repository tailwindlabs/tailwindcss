import type { NamedUtilityValue } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import type { Writable } from '../../utils/types'
import { printCandidate } from './candidates'
import { computeUtilitySignature } from './signatures'

// Optimize the modifier
//
// E.g.:
//
// - `/[25%]`   → `/25`
// - `/[100%]`  → `/100`    → <empty>
// - `/100`     → <empty>
//
export function migrateOptimizeModifier(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): string {
  let signatures = computeUtilitySignature.get(designSystem)

  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    let candidate = structuredClone(readonlyCandidate) as Writable<typeof readonlyCandidate>
    if (
      (candidate.kind === 'functional' && candidate.modifier !== null) ||
      (candidate.kind === 'arbitrary' && candidate.modifier !== null)
    ) {
      let targetSignature = signatures.get(rawCandidate)
      let modifier = candidate.modifier
      let changed = false

      // 1. Try to drop the modifier entirely
      if (
        targetSignature ===
        signatures.get(printCandidate(designSystem, { ...candidate, modifier: null }))
      ) {
        changed = true
        candidate.modifier = null
      }

      // 2. Try to remove the square brackets and the `%` sign
      if (!changed) {
        let newModifier: NamedUtilityValue = {
          kind: 'named',
          value: modifier.value.endsWith('%') ? modifier.value.slice(0, -1) : modifier.value,
          fraction: null,
        }

        if (
          targetSignature ===
          signatures.get(printCandidate(designSystem, { ...candidate, modifier: newModifier }))
        ) {
          changed = true
          candidate.modifier = newModifier
        }
      }

      return changed ? printCandidate(designSystem, candidate) : rawCandidate
    }
  }

  return rawCandidate
}
