import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { computeUtilitySignature } from './signatures'

export function migrateDropUnnecessaryDataTypes(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): string {
  let signatures = computeUtilitySignature.get(designSystem)

  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (
      candidate.kind === 'functional' &&
      candidate.value?.kind === 'arbitrary' &&
      candidate.value.dataType !== null
    ) {
      let replacement = designSystem.printCandidate({
        ...candidate,
        value: { ...candidate.value, dataType: null },
      })

      if (signatures.get(rawCandidate) === signatures.get(replacement)) {
        return replacement
      }
    }
  }

  return rawCandidate
}
