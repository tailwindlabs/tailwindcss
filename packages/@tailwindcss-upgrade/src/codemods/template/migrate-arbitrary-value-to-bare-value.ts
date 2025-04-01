import { parseCandidate, type Candidate, type Variant } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { isPositiveInteger } from '../../../../tailwindcss/src/utils/infer-data-type'
import { segment } from '../../../../tailwindcss/src/utils/segment'
import { printCandidate } from './candidates'

export function migrateArbitraryValueToBareValue(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    let clone = structuredClone(candidate)
    let changed = false

    // Convert [subgrid] to subgrid
    if (
      clone.kind === 'functional' &&
      clone.value?.kind === 'arbitrary' &&
      clone.value.value === 'subgrid' &&
      (clone.root === 'grid-cols' || clone.root == 'grid-rows')
    ) {
      changed = true
      clone.value = {
        kind: 'named',
        value: 'subgrid',
        fraction: null,
      }
    }

    // Convert utilities that accept bare values ending in %
    if (
      clone.kind === 'functional' &&
      clone.value?.kind === 'arbitrary' &&
      clone.value.dataType === null &&
      (clone.root === 'from' ||
        clone.root === 'via' ||
        clone.root === 'to' ||
        clone.root === 'font-stretch')
    ) {
      if (clone.value.value.endsWith('%') && isPositiveInteger(clone.value.value.slice(0, -1))) {
        let percentage = parseInt(clone.value.value)
        if (
          clone.root === 'from' ||
          clone.root === 'via' ||
          clone.root === 'to' ||
          (clone.root === 'font-stretch' && percentage >= 50 && percentage <= 200)
        ) {
          changed = true
          clone.value = {
            kind: 'named',
            value: clone.value.value,
            fraction: null,
          }
        }
      }
    }

    // Convert arbitrary values with positive integers to bare values
    // Convert arbitrary values with fractions to bare values
    else if (
      clone.kind === 'functional' &&
      clone.value?.kind === 'arbitrary' &&
      clone.value.dataType === null
    ) {
      if (clone.root === 'leading') {
        // leading-[1] -> leading-none
        if (clone.value.value === '1') {
          changed = true
          clone.value = {
            kind: 'named',
            value: 'none',
            fraction: null,
          }
        }

        // Keep leading-[<number>] as leading-[<number>]
        else {
          continue
        }
      }

      let parts = segment(clone.value.value, '/')
      if (parts.every((part) => isPositiveInteger(part))) {
        changed = true

        let currentValue = clone.value
        let currentModifier = clone.modifier

        // E.g.: `col-start-[12]`
        //                   ^^
        if (parts.length === 1) {
          clone.value = {
            kind: 'named',
            value: clone.value.value,
            fraction: null,
          }
        }

        // E.g.: `aspect-[12/34]`
        //                ^^ ^^
        else {
          clone.value = {
            kind: 'named',
            value: parts[0],
            fraction: clone.value.value,
          }
          clone.modifier = {
            kind: 'named',
            value: parts[1],
          }
        }

        // Double check that the new value compiles correctly
        if (designSystem.compileAstNodes(clone).length === 0) {
          clone.value = currentValue
          clone.modifier = currentModifier
          changed = false
        }
      }
    }

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
