import { walk, WalkAction } from '../../../../tailwindcss/src/ast'
import { type Candidate, type Variant } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import * as ValueParser from '../../../../tailwindcss/src/value-parser'
import { printCandidate } from '../candidates'

export function automaticVarInjection(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  for (let readonlyCandidate of designSystem.parseCandidate(rawCandidate)) {
    // The below logic makes extended use of mutation. Since candidates in the
    // DesignSystem are cached, we can't mutate them directly.
    let candidate = structuredClone(readonlyCandidate) as Candidate

    let didChange = false

    // Add `var(…)` in modifier position, e.g.:
    //
    // `bg-red-500/[--my-opacity]` => `bg-red-500/[var(--my-opacity)]`
    if (
      'modifier' in candidate &&
      candidate.modifier?.kind === 'arbitrary' &&
      !isAutomaticVarInjectionException(designSystem, candidate, candidate.modifier.value)
    ) {
      let { value, didChange: modifierDidChange } = injectVar(candidate.modifier.value)
      candidate.modifier.value = value
      didChange ||= modifierDidChange
    }

    // Add `var(…)` to all variants, e.g.:
    //
    // `supports-[--test]:flex'` => `supports-[var(--test)]:flex`
    for (let variant of candidate.variants) {
      let didChangeVariant = injectVarIntoVariant(designSystem, variant)
      if (didChangeVariant) {
        didChange = true
      }
    }

    // Add `var(…)` to arbitrary candidates, e.g.:
    //
    // `[color:--my-color]` => `[color:var(--my-color)]`
    if (
      candidate.kind === 'arbitrary' &&
      !isAutomaticVarInjectionException(designSystem, candidate, candidate.value)
    ) {
      let { value, didChange: valueDidChange } = injectVar(candidate.value)
      candidate.value = value
      didChange ||= valueDidChange
    }

    // Add `var(…)` to arbitrary values for functional candidates, e.g.:
    //
    // `bg-[--my-color]` => `bg-[var(--my-color)]`
    if (
      candidate.kind === 'functional' &&
      candidate.value &&
      candidate.value.kind === 'arbitrary' &&
      !isAutomaticVarInjectionException(designSystem, candidate, candidate.value.value)
    ) {
      let { value, didChange: valueDidChange } = injectVar(candidate.value.value)
      candidate.value.value = value
      didChange ||= valueDidChange
    }

    if (didChange) {
      return printCandidate(designSystem, candidate)
    }
  }
  return rawCandidate
}

function injectVar(value: string): { value: string; didChange: boolean } {
  let ast = ValueParser.parse(value)

  let didChange = false
  for (let [idx, node] of ast.entries()) {
    // Convert `--my-color` to `var(--my-color)`
    // Except if:
    // - It's a function like `--spacing(…)`
    // - It's preceeded by a space, e.g.: `bg-[_--my-color]` -> `bg-[--my-color]`
    if (
      node.kind === 'word' &&
      node.value.startsWith('--') &&
      !(ast[idx - 1]?.kind === 'separator' && ast[idx - 1]?.value === ' ')
    ) {
      node.value = `var(${node.value})`
      didChange = true
    }

    // Remove the space "hack" before a variable. E.g.: `bg-[_--my-color]` ->
    // `bg-[--my-color]`
    else if (node.kind === 'separator' && node.value === ' ') {
      ast.splice(idx, 1)
      didChange = true
    }
  }

  return { value: ValueParser.toCss(ast), didChange }
}

function injectVarIntoVariant(designSystem: DesignSystem, variant: Variant): boolean {
  let didChange = false
  if (
    variant.kind === 'functional' &&
    variant.value &&
    variant.value.kind === 'arbitrary' &&
    !isAutomaticVarInjectionException(
      designSystem,
      createEmptyCandidate(variant),
      variant.value.value,
    )
  ) {
    let { value, didChange: valueDidChange } = injectVar(variant.value.value)
    variant.value.value = value
    didChange ||= valueDidChange
  }

  if (variant.kind === 'compound') {
    let compoundDidChange = injectVarIntoVariant(designSystem, variant.variant)
    if (compoundDidChange) {
      didChange = true
    }
  }

  return didChange
}

function createEmptyCandidate(variant: Variant) {
  return {
    kind: 'arbitrary' as const,
    property: 'color',
    value: 'red',
    modifier: null,
    variants: [variant],
    important: false,
    raw: 'candidate',
  } satisfies Candidate
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
// Some properties never had var() injection in v3. We need to convert the candidate to CSS
// so we can check the properties used by the utility.
function isAutomaticVarInjectionException(
  designSystem: DesignSystem,
  candidate: Candidate,
  value: string,
): boolean {
  let ast = designSystem.compileAstNodes(candidate).map((n) => n.node)

  let isException = false
  walk(ast, (node) => {
    if (
      node.kind === 'declaration' &&
      AUTO_VAR_INJECTION_EXCEPTIONS.has(node.property) &&
      node.value == value
    ) {
      isException = true
      return WalkAction.Stop
    }
  })
  return isException
}
