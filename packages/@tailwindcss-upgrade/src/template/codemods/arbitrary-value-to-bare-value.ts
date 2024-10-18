import type { Config } from 'tailwindcss'
import { type Candidate, type Variant } from '../../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { isPositiveInteger } from '../../../../tailwindcss/src/utils/infer-data-type'
import { segment } from '../../../../tailwindcss/src/utils/segment'
import { printCandidate } from '../candidates'

export function arbitraryValueToBareValue(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  for (let candidate of designSystem.parseCandidate(rawCandidate) as Candidate[]) {
    let changed = false

    // Convert font-stretch-* utilities
    if (
      candidate.kind === 'functional' &&
      candidate.value?.kind === 'arbitrary' &&
      candidate.value.dataType === null &&
      candidate.root === 'font-stretch'
    ) {
      if (
        candidate.value.value.endsWith('%') &&
        isPositiveInteger(candidate.value.value.slice(0, -1))
      ) {
        let percentage = parseInt(candidate.value.value)
        if (percentage >= 50 && percentage <= 200) {
          changed = true
          candidate.value = {
            kind: 'named',
            value: candidate.value.value,
            fraction: null,
          }
        }
      }
    }

    // Convert arbitrary values with positive integers to bare values
    // Convert arbitrary values with fractions to bare values
    else if (
      candidate.kind === 'functional' &&
      candidate.value?.kind === 'arbitrary' &&
      candidate.value.dataType === null
    ) {
      let parts = segment(candidate.value.value, '/')
      if (parts.every((part) => isPositiveInteger(part))) {
        changed = true

        let currentValue = candidate.value
        let currentModifier = candidate.modifier

        // E.g.: `col-start-[12]`
        //                   ^^
        if (parts.length === 1) {
          candidate.value = {
            kind: 'named',
            value: candidate.value.value,
            fraction: null,
          }
        }

        // E.g.: `aspect-[12/34]`
        //                ^^ ^^
        else {
          candidate.value = {
            kind: 'named',
            value: parts[0],
            fraction: candidate.value.value,
          }
          candidate.modifier = {
            kind: 'named',
            value: parts[1],
          }
        }

        // Double check that the new value compiles correctly
        if (designSystem.compileAstNodes(candidate).length === 0) {
          candidate.value = currentValue
          candidate.modifier = currentModifier
          changed = false
        }
      }
    }

    for (let variant of variants(candidate)) {
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

    return changed ? printCandidate(designSystem, candidate) : rawCandidate
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
