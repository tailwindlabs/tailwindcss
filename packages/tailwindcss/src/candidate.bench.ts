import { Scanner } from '@tailwindcss/oxide'
import { bench, describe } from 'vitest'
import { cloneCandidate, parseCandidate, type Candidate, type Variant } from './candidate'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'

// FOLDER=path/to/folder vitest bench
const root = process.env.FOLDER || process.cwd()

// Auto content detection
const scanner = new Scanner({ sources: [{ base: root, pattern: '**/*', negated: false }] })

const candidates = scanner.scan()
const designSystem = buildDesignSystem(new Theme())

describe('parsing', () => {
  bench('parseCandidate', () => {
    for (let candidate of candidates) {
      Array.from(parseCandidate(candidate, designSystem))
    }
  })
})

describe('Candidate cloning', async () => {
  let parsedCanddiates = candidates.flatMap((candidate) =>
    Array.from(parseCandidate(candidate, designSystem)),
  )

  bench('structuredClone', () => {
    for (let candidate of parsedCanddiates) {
      structuredClone(candidate)
    }
  })

  bench('cloneCandidate', () => {
    for (let candidate of parsedCanddiates) {
      cloneCandidate(candidate)
    }
  })

  bench('cloneCandidate (spread)', () => {
    for (let candidate of parsedCanddiates) {
      cloneCandidateSpread(candidate)
    }
  })
})

function cloneCandidateSpread(candidate: Candidate): Candidate {
  switch (candidate.kind) {
    case 'arbitrary':
      return {
        ...candidate,
        modifier: candidate.modifier ? { ...candidate.modifier } : null,
        variants: candidate.variants.map(cloneVariantSpread),
      }

    case 'static':
      return { ...candidate, variants: candidate.variants.map(cloneVariantSpread) }

    case 'functional':
      return {
        ...candidate,
        value: candidate.value ? { ...candidate.value } : null,
        modifier: candidate.modifier ? { ...candidate.modifier } : null,
        variants: candidate.variants.map(cloneVariantSpread),
      }

    default:
      candidate satisfies never
      throw new Error('Unknown candidate kind')
  }
}

function cloneVariantSpread(variant: Variant): Variant {
  switch (variant.kind) {
    case 'arbitrary':
    case 'static':
      return { ...variant }

    case 'functional':
      return { ...variant, modifier: variant.modifier ? { ...variant.modifier } : null }

    case 'compound':
      return {
        ...variant,
        variant: cloneVariantSpread(variant.variant),
        modifier: variant.modifier ? { ...variant.modifier } : null,
      }

    default:
      variant satisfies never
      throw new Error('Unknown variant kind')
  }
}
