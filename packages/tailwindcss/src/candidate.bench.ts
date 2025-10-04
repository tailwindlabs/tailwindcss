import { Scanner } from '@tailwindcss/oxide'
import { bench, describe } from 'vitest'
import { cloneCandidate, parseCandidate } from './candidate'
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
})
