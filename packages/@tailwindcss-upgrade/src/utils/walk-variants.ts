import type { Candidate, Variant } from '../../../tailwindcss/src/candidate'

export function* walkVariants(candidate: Candidate) {
  function* inner(
    variant: Variant,
    parent: Extract<Variant, { kind: 'compound' }> | null = null,
  ): Iterable<[Variant, Extract<Variant, { kind: 'compound' }> | null]> {
    yield [variant, parent]

    if (variant.kind === 'compound') {
      yield* inner(variant.variant, variant)
    }
  }

  for (let variant of candidate.variants) {
    yield* inner(variant, null)
  }
}
