import type { Candidate, Variant } from '../../../../tailwindcss/src/candidate'

export function automaticVarInjection(candidate: Candidate): Candidate | null {
  let didChange = false

  // Add `var(…)` in modifier position, e.g.:
  //
  // `bg-red-500/[--my-opacity]` => `bg-red-500/[var(--my-opacity)]`
  if (
    'modifier' in candidate &&
    candidate.modifier?.kind === 'arbitrary' &&
    candidate.modifier.value.startsWith('--')
  ) {
    candidate.modifier.value = `var(${candidate.modifier.value})`
    didChange = true
  }

  // Add `var(…)` to all variants, e.g.:
  //
  // `supports-[--test]:flex'` => `supports-[var(--test)]:flex`
  for (let variant of candidate.variants) {
    let didChangeVariant = injectVarIntoVariant(variant)
    if (didChangeVariant) {
      didChange = true
    }
  }

  // Add `var(…)` to arbitrary candidates, e.g.:
  //
  // `[color:--my-color]` => `[color:var(--my-color)]`
  if (candidate.kind === 'arbitrary' && candidate.value.startsWith('--')) {
    candidate.value = `var(${candidate.value})`
    didChange = true
  }

  // Add `var(…)` to arbitrary values for functional candidates, e.g.:
  //
  // `bg-[--my-color]` => `bg-[var(--my-color)]`
  if (
    candidate.kind === 'functional' &&
    candidate.value &&
    candidate.value.kind === 'arbitrary' &&
    candidate.value.value.startsWith('--')
  ) {
    candidate.value.value = `var(${candidate.value.value})`
    didChange = true
  }

  if (didChange) {
    return candidate
  }
  return null
}

function injectVarIntoVariant(variant: Variant): boolean {
  let didChange = false
  if (
    variant.kind === 'functional' &&
    variant.value &&
    variant.value.kind === 'arbitrary' &&
    variant.value.value.startsWith('--')
  ) {
    variant.value.value = `var(${variant.value.value})`
    didChange = true
  }

  if (variant.kind === 'compound') {
    let compoundDidChange = injectVarIntoVariant(variant.variant)
    if (compoundDidChange) {
      didChange = true
    }
  }

  return didChange
}
