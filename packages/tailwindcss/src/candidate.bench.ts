import { Scanner } from '@tailwindcss/oxide'
import { bench } from 'vitest'
import { parseCandidate } from './candidate'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'

// FOLDER=path/to/folder vitest bench
const root = process.env.FOLDER || process.cwd()

// Auto content detection
const scanner = new Scanner({ sources: [{ base: root, pattern: '**/*' }] })

const candidates = scanner.scan()
const designSystem = buildDesignSystem(new Theme())

bench('parseCandidate', () => {
  for (let candidate of candidates) {
    Array.from(parseCandidate(candidate, designSystem))
  }
})
