import { walk } from '../../../../tailwindcss/src/ast'
import type { Candidate, Variant } from '../../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'

export function automaticVarInjection(
  designSystem: DesignSystem,
  candidate: Candidate,
): Candidate | null {
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

  // Some properties never had var() injection in v3. We need to convert the candidate to CSS
  // so we can check the properties used by the utility.
  let isException = isAutomaticVarInjectionException(designSystem, candidate)

  // Add `var(…)` to arbitrary candidates, e.g.:
  //
  // `[color:--my-color]` => `[color:var(--my-color)]`
  if (!isException && candidate.kind === 'arbitrary' && candidate.value.startsWith('--')) {
    candidate.value = `var(${candidate.value})`
    didChange = true
  }

  // Add `var(…)` to arbitrary values for functional candidates, e.g.:
  //
  // `bg-[--my-color]` => `bg-[var(--my-color)]`
  if (
    !isException &&
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

const AUTO_VAR_INJECTION_EXCEPTIONS = new Set([
  // Concrete properties
  'scroll-timeline-name',
  'timeline-scope',
  'view-timeline-name',
  'font-palette',
  'anchor-name',
  'anchor-scope',
  'position-anchor',
  'position-try-options',

  // Shorthand properties
  'scroll-timeline',
  'animation-timeline',
  'view-timeline',
  'position-try',
])
function isAutomaticVarInjectionException(
  designSystem: DesignSystem,
  candidate: Candidate,
): boolean {
  let ast = designSystem.compileAstNodes(candidate).map((n) => n.node)

  console.dir(ast, { depth: null })
  let isException = false
  walk(ast, (node) => {
    if (
      node.kind === 'declaration' &&
      AUTO_VAR_INJECTION_EXCEPTIONS.has(node.property) &&
      node.value?.startsWith('--')
    ) {
      isException = true
    }
  })
  return isException
}
