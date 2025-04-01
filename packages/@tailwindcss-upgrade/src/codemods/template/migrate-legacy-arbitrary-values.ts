import { parseCandidate } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { segment } from '../../../../tailwindcss/src/utils/segment'
import { printCandidate } from './candidates'

export function migrateLegacyArbitraryValues(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    let clone = structuredClone(candidate)
    let changed = false

    // Convert commas to spaces. E.g.: [auto,1fr] to [auto_1fr]
    if (
      clone.kind === 'functional' &&
      clone.value?.kind === 'arbitrary' &&
      (clone.root === 'grid-cols' || clone.root == 'grid-rows' || clone.root == 'object')
    ) {
      changed = true
      clone.value.value = segment(clone.value.value, ',').join(' ')
    }

    return changed ? printCandidate(designSystem, clone) : rawCandidate
  }

  return rawCandidate
}
