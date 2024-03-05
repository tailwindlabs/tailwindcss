import { scanDir } from '@tailwindcss/oxide'
import { bench } from 'vitest'
import { parseCandidate, parseVariant } from './candidate'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'
import { DefaultMap } from './utils/default-map'

// FOLDER=path/to/folder vitest bench
const root = process.env.FOLDER || process.cwd()

// Auto content detection
const result = scanDir({ base: root, globs: true })

const designSystem = buildDesignSystem(new Theme())

bench('parseCandidate', () => {
  for (let candidate of result.candidates) {
    parseCandidate(
      candidate,
      designSystem.utilities,
      new DefaultMap((variant, map) => parseVariant(variant, designSystem.variants, map)),
    )
  }
})
