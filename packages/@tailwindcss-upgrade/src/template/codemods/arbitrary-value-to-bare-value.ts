import type { Config } from 'tailwindcss'
import { parseCandidate, type Candidate, type Variant } from '../../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { segment } from '../../../../tailwindcss/src/utils/segment'
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
