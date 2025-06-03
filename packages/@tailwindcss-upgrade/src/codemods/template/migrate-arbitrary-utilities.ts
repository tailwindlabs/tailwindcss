import { printModifier, type Candidate } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import * as ValueParser from '../../../../tailwindcss/src/value-parser'
import { dimensions } from '../../utils/dimension'
import type { Writable } from '../../utils/types'
import { baseCandidate, parseCandidate } from './candidates'
import { computeUtilitySignature, preComputedUtilities } from './signatures'

const baseReplacementsCache = new DefaultMap<DesignSystem, Map<string, Candidate>>(
  () => new Map<string, Candidate>(),
)

const spacing = new DefaultMap<DesignSystem, DefaultMap<string, number | null> | null>((ds) => {
  let spacingMultiplier = ds.resolveThemeValue('--spacing')
  if (spacingMultiplier === undefined) return null

  let parsed = dimensions.get(spacingMultiplier)
  if (!parsed) return null

  let [value, unit] = parsed

  return new DefaultMap<string, number | null>((input) => {
    let parsed = dimensions.get(input)
    if (!parsed) return null

    let [myValue, myUnit] = parsed
    if (myUnit !== unit) return null

    return myValue / value
  })
})

export function migrateArbitraryUtilities(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): string {
  let utilities = preComputedUtilities.get(designSystem)
  let signatures = computeUtilitySignature.get(designSystem)

  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    // We are only interested in arbitrary properties and arbitrary values
    if (
      // Arbitrary property
      readonlyCandidate.kind !== 'arbitrary' &&
      // Arbitrary value
      !(readonlyCandidate.kind === 'functional' && readonlyCandidate.value?.kind === 'arbitrary')
    ) {
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

      // Ensure that if CSS variables were used, that they are still used
      if (!allVariablesAreUsed(designSystem, candidate, replacementCandidate)) {
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
    candidate: Extract<Candidate, { kind: 'functional' | 'arbitrary' }>,
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

    // Find a corresponding functional utility for the same signature
    else if (replacements.length === 0) {
      // An arbitrary property will only set a single property, we can use that
      // to find functional utilities that also set this property.
      let value =
        candidate.kind === 'arbitrary' ? candidate.value : (candidate.value?.value ?? null)
      if (value === null) return

      let spacingMultiplier = spacing.get(designSystem)?.get(value) ?? null
      let rootPrefix = ''
      if (spacingMultiplier !== null && spacingMultiplier < 0) {
        rootPrefix = '-'
        spacingMultiplier = Math.abs(spacingMultiplier)
      }

      for (let root of Array.from(designSystem.utilities.keys('functional')).sort(
        // Sort negative roots after positive roots so that we can try
        // `mt-*` before `-mt-*`. This is especially useful in situations where
        // `-mt-[0px]` can be translated to `mt-[0px]`.
        (a, z) => Number(a[0] === '-') - Number(z[0] === '-'),
      )) {
        if (rootPrefix) root = `${rootPrefix}${root}`

        // Try as bare value
        for (let replacementCandidate of parseCandidate(designSystem, `${root}-${value}`)) {
          yield replacementCandidate
        }

        // Try as bare value with modifier
        if (candidate.modifier) {
          for (let replacementCandidate of parseCandidate(
            designSystem,
            `${root}-${value}${candidate.modifier}`,
          )) {
            yield replacementCandidate
          }
        }

        // Try bare value based on the `--spacing` value. E.g.:
        //
        // - `w-[64rem]` → `w-256`
        if (spacingMultiplier !== null) {
          for (let replacementCandidate of parseCandidate(
            designSystem,
            `${root}-${spacingMultiplier}`,
          )) {
            yield replacementCandidate
          }

          // Try bare value based on the `--spacing` value, but with a modifier
          if (candidate.modifier) {
            for (let replacementCandidate of parseCandidate(
              designSystem,
              `${root}-${spacingMultiplier}${printModifier(candidate.modifier)}`,
            )) {
              yield replacementCandidate
            }
          }
        }

        // Try as arbitrary value
        for (let replacementCandidate of parseCandidate(designSystem, `${root}-[${value}]`)) {
          yield replacementCandidate
        }

        // Try as arbitrary value with modifier
        if (candidate.modifier) {
          for (let replacementCandidate of parseCandidate(
            designSystem,
            `${root}-[${value}]${printModifier(candidate.modifier)}`,
          )) {
            yield replacementCandidate
          }
        }
      }
    }
  }
}

// Let's make sure that all variables used in the value are also all used in the
// found replacement. If not, then we are dealing with a different namespace or
// we could lose functionality in case the variable was changed higher up in the
// DOM tree.
function allVariablesAreUsed(
  designSystem: DesignSystem,
  candidate: Candidate,
  replacement: Candidate,
) {
  let value: string | null = null

  // Functional utility with arbitrary value and variables
  if (
    candidate.kind === 'functional' &&
    candidate.value?.kind === 'arbitrary' &&
    candidate.value.value.includes('var(--')
  ) {
    value = candidate.value.value
  }

  // Arbitrary property with variables
  else if (candidate.kind === 'arbitrary' && candidate.value.includes('var(--')) {
    value = candidate.value
  }

  // No variables in the value, so this is a safe migration
  if (value === null) {
    return true
  }

  let replacementAsCss = designSystem
    .candidatesToCss([designSystem.printCandidate(replacement)])
    .join('\n')

  let isSafeMigration = true
  ValueParser.walk(ValueParser.parse(value), (node) => {
    if (node.kind === 'function' && node.value === 'var') {
      let variable = node.nodes[0].value
      let r = new RegExp(`var\\(${variable}[,)]\\s*`, 'g')
      if (
        // We need to check if the variable is used in the replacement
        !r.test(replacementAsCss) ||
        // The value cannot be set to a different value in the
        // replacement because that would make it an unsafe migration
        replacementAsCss.includes(`${variable}:`)
      ) {
        isSafeMigration = false
        return ValueParser.ValueWalkAction.Stop
      }
    }
  })

  return isSafeMigration
}
