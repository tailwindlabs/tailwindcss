import type { Config } from 'tailwindcss'
import { parseCandidate, type Candidate, type Variant } from '../../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { printCandidate } from '../candidates'

export function arbitraryValueToBareValue(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    let clone = structuredClone(candidate)
    let changed = false
    for (let variant of variants(clone)) {
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
        variant.value.value.endsWith('="true"')
      ) {
        changed = true
        variant.value = {
          kind: 'named',
          value: variant.value.value.slice(0, variant.value.value.indexOf('=')),
        }
      }
    }

    return changed ? printCandidate(designSystem, clone) : rawCandidate
  }

  return rawCandidate
}

function* variants(candidate: Candidate) {
  function* inner(variant: Variant): Iterable<Variant> {
    yield variant
    if (variant.kind === 'compound') {
      yield* inner(variant.variant)
    }
  }

  for (let variant of candidate.variants) {
    yield* inner(variant)
  }
}
