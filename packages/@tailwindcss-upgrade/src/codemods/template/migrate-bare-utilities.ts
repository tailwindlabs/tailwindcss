import { type Candidate } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import type { Writable } from '../../utils/types'
import { baseCandidate, parseCandidate } from './candidates'
import { computeUtilitySignature, preComputedUtilities } from './signatures'

const baseReplacementsCache = new DefaultMap<DesignSystem, Map<string, Candidate>>(
  () => new Map<string, Candidate>(),
)

export function migrateBareValueUtilities(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): string {
  let utilities = preComputedUtilities.get(designSystem)
  let signatures = computeUtilitySignature.get(designSystem)

  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    // We are only interested in bare value utilities
    if (readonlyCandidate.kind !== 'functional' || readonlyCandidate.value?.kind !== 'named') {
      continue
    }

    // The below logic makes use of mutation. Since candidates in the
    // DesignSystem are cached, we can't mutate them directly.
    let candidate = structuredClone(readonlyCandidate) as Writable<typeof readonlyCandidate>

    // Create a basic stripped candidate without variants or important flag. We
    // will re-add those later but they are irrelevant for what we are trying to
    // do here (and will increase cache hits because we only have to deal with
    // the base utility, nothing more).
    let targetCandidate = baseCandidate(candidate)

    let targetCandidateString = designSystem.printCandidate(targetCandidate)
    if (baseReplacementsCache.get(designSystem).has(targetCandidateString)) {
      let target = structuredClone(
        baseReplacementsCache.get(designSystem).get(targetCandidateString)!,
      )
      // Re-add the variants and important flag from the original candidate
      target.variants = candidate.variants
      target.important = candidate.important

      return designSystem.printCandidate(target)
    }

    // Compute the signature for the target candidate
    let targetSignature = signatures.get(targetCandidateString)
    if (typeof targetSignature !== 'string') continue

    // Try a few options to find a suitable replacement utility
    for (let replacementCandidate of tryReplacements(targetSignature, targetCandidate)) {
      let replacementString = designSystem.printCandidate(replacementCandidate)
      let replacementSignature = signatures.get(replacementString)
      if (replacementSignature !== targetSignature) {
        continue
      }

      replacementCandidate = structuredClone(replacementCandidate)

      // Cache the result so we can re-use this work later
      baseReplacementsCache.get(designSystem).set(targetCandidateString, replacementCandidate)

      // Re-add the variants and important flag from the original candidate
      replacementCandidate.variants = candidate.variants
      replacementCandidate.important = candidate.important

      // Update the candidate with the new value
      Object.assign(candidate, replacementCandidate)

      // We will re-print the candidate to get the migrated candidate out
      return designSystem.printCandidate(candidate)
    }
  }

  return rawCandidate

  function* tryReplacements(
    targetSignature: string,
    candidate: Extract<Candidate, { kind: 'functional' }>,
  ): Generator<Candidate> {
    // Find a corresponding utility for the same signature
    let replacements = utilities.get(targetSignature)

    // Multiple utilities can map to the same signature. Not sure how to migrate
    // this one so let's just skip it for now.
    //
    // TODO: Do we just migrate to the first one?
    if (replacements.length > 1) return

    // If we didn't find any replacement utilities, let's try to strip the
    // modifier and find a replacement then. If we do, we can try to re-add the
    // modifier later and verify if we have a valid migration.
    //
    // This is necessary because `text-red-500/50` will not be pre-computed,
    // only `text-red-500` will.
    if (replacements.length === 0 && candidate.modifier) {
      let candidateWithoutModifier = { ...candidate, modifier: null }
      let targetSignatureWithoutModifier = signatures.get(
        designSystem.printCandidate(candidateWithoutModifier),
      )
      if (typeof targetSignatureWithoutModifier === 'string') {
        for (let replacementCandidate of tryReplacements(
          targetSignatureWithoutModifier,
          candidateWithoutModifier,
        )) {
          yield Object.assign({}, replacementCandidate, { modifier: candidate.modifier })
        }
      }
    }

    // If only a single utility maps to the signature, we can use that as the
    // replacement.
    if (replacements.length === 1) {
      for (let replacementCandidate of parseCandidate(designSystem, replacements[0])) {
        yield replacementCandidate
      }
    }
  }
}
