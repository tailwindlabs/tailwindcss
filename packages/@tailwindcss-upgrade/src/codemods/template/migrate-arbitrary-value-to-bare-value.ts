import {
  parseCandidate,
  type Candidate,
  type NamedUtilityValue,
} from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import {
  isPositiveInteger,
  isValidSpacingMultiplier,
} from '../../../../tailwindcss/src/utils/infer-data-type'
import { segment } from '../../../../tailwindcss/src/utils/segment'
import { walkVariants } from '../../utils/walk-variants'
import { computeUtilitySignature } from './signatures'

export function migrateArbitraryValueToBareValue(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): string {
  let signatures = computeUtilitySignature.get(designSystem)

  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    let clone = structuredClone(candidate)
    let changed = false

    // Migrate arbitrary values to bare values
    if (clone.kind === 'functional' && clone.value?.kind === 'arbitrary') {
      let expectedSignature = signatures.get(rawCandidate)
      if (expectedSignature !== null) {
        for (let value of tryValueReplacements(clone)) {
          let newSignature = signatures.get(designSystem.printCandidate({ ...clone, value }))
          if (newSignature === expectedSignature) {
            changed = true
            clone.value = value
            break
          }
        }
      }
    }

    for (let [variant] of walkVariants(clone)) {
      // Convert `data-[selected]` to `data-selected`
      if (
        variant.kind === 'functional' &&
        variant.root === 'data' &&
        variant.value?.kind === 'arbitrary' &&
        !variant.value.value.includes('=')
      ) {
        changed = true
        variant.value = {
          kind: 'named',
          value: variant.value.value,
        }
      }

      // Convert `aria-[selected="true"]` to `aria-selected`
      else if (
        variant.kind === 'functional' &&
        variant.root === 'aria' &&
        variant.value?.kind === 'arbitrary' &&
        (variant.value.value.endsWith('=true') ||
          variant.value.value.endsWith('="true"') ||
          variant.value.value.endsWith("='true'"))
      ) {
        let [key, _value] = segment(variant.value.value, '=')
        if (
          // aria-[foo~="true"]
          key[key.length - 1] === '~' ||
          // aria-[foo|="true"]
          key[key.length - 1] === '|' ||
          // aria-[foo^="true"]
          key[key.length - 1] === '^' ||
          // aria-[foo$="true"]
          key[key.length - 1] === '$' ||
          // aria-[foo*="true"]
          key[key.length - 1] === '*'
        ) {
          continue
        }

        changed = true
        variant.value = {
          kind: 'named',
          value: variant.value.value.slice(0, variant.value.value.indexOf('=')),
        }
      }

      // Convert `supports-[gap]` to `supports-gap`
      else if (
        variant.kind === 'functional' &&
        variant.root === 'supports' &&
        variant.value?.kind === 'arbitrary' &&
        /^[a-z-][a-z0-9-]*$/i.test(variant.value.value)
      ) {
        changed = true
        variant.value = {
          kind: 'named',
          value: variant.value.value,
        }
      }
    }

    return changed ? designSystem.printCandidate(clone) : rawCandidate
  }

  return rawCandidate
}

// Convert functional utilities with arbitrary values to bare values if we can.
// We know that bare values can only be:
//
// 1. A number (with increments of .25)
// 2. A percentage (with increments of .25 followed by a `%`)
// 3. A ratio with whole numbers
//
// Not a bare value per se, but if we are dealing with a keyword, that could
// potentially also look like a bare value (aka no `[` or `]`). E.g.:
// ```diff
// grid-cols-[subgrid]
// grid-cols-subgrid
// ```
function* tryValueReplacements(
  candidate: Extract<Candidate, { kind: 'functional' }>,
  value: string = candidate.value?.value ?? '',
  seen: Set<string> = new Set(),
): Generator<NamedUtilityValue> {
  if (seen.has(value)) return
  seen.add(value)

  // 0. Just try to drop the square brackets and see if it works
  // 1. A number (with increments of .25)
  yield {
    kind: 'named',
    value,
    fraction: null,
  }

  // 2. A percentage (with increments of .25 followed by a `%`)
  //    Try to drop the `%` and see if it works
  if (value.endsWith('%') && isValidSpacingMultiplier(value.slice(0, -1))) {
    yield {
      kind: 'named',
      value: value.slice(0, -1),
      fraction: null,
    }
  }

  // 3. A ratio with whole numbers
  if (value.includes('/')) {
    let [numerator, denominator] = value.split('/')
    if (isPositiveInteger(numerator) && isPositiveInteger(denominator)) {
      yield {
        kind: 'named',
        value: numerator,
        fraction: `${numerator}/${denominator}`,
      }
    }
  }

  // It could also be that we have `20px`, we can try just `20` and see if it
  // results in the same signature.
  let allNumbersAndFractions = new Set<string>()

  // Figure out all numbers and fractions in the value
  for (let match of value.matchAll(/(\d+\/\d+)|(\d+\.?\d+)/g)) {
    allNumbersAndFractions.add(match[0].trim())
  }

  // Sort the numbers and fractions where the smallest length comes first. This
  // will result in the smallest replacement.
  let options = Array.from(allNumbersAndFractions).sort((a, z) => {
    return a.length - z.length
  })

  // Try all the options
  for (let option of options) {
    yield* tryValueReplacements(candidate, option, seen)
  }
}
