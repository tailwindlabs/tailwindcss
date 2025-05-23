import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import type { Writable } from '../../utils/types'
import { baseCandidate, parseCandidate, printUnprefixedCandidate } from './candidates'
import { computeUtilitySignature } from './signatures'

const DEPRECATION_MAP = new Map([['order-none', 'order-0']])

export async function migrateDeprecatedUtilities(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): Promise<string> {
  let signatures = computeUtilitySignature.get(designSystem)

  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    // The below logic makes use of mutation. Since candidates in the
    // DesignSystem are cached, we can't mutate them directly.
    let candidate = structuredClone(readonlyCandidate) as Writable<typeof readonlyCandidate>

    // Create a basic stripped candidate without variants or important flag. We
    // will re-add those later but they are irrelevant for what we are trying to
    // do here (and will increase cache hits because we only have to deal with
    // the base utility, nothing more).
    let targetCandidate = baseCandidate(candidate)
    let targetCandidateString = printUnprefixedCandidate(designSystem, targetCandidate)

    let replacementString = DEPRECATION_MAP.get(targetCandidateString) ?? null
    if (replacementString === null) return rawCandidate

    let legacySignature = signatures.get(targetCandidateString)
    if (typeof legacySignature !== 'string') return rawCandidate

    let replacementSignature = signatures.get(replacementString)
    if (typeof replacementSignature !== 'string') return rawCandidate

    // Not the same signature, not safe to migrate
    if (legacySignature !== replacementSignature) return rawCandidate

    let [replacement] = parseCandidate(designSystem, replacementString)

    // Re-add the variants and important flag from the original candidate
    return designSystem.printCandidate(
      Object.assign(structuredClone(replacement), {
        variants: candidate.variants,
        important: candidate.important,
      }),
    )
  }

  return rawCandidate
}
