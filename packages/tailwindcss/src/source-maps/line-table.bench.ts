import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { bench } from 'vitest'
import { createLineTable } from './line-table'

const currentFolder = fileURLToPath(new URL('..', import.meta.url))
const cssFile = readFileSync(currentFolder + '../preflight.css', 'utf-8')
const table = createLineTable(cssFile)

bench('line table lookups', () => {
  for (let i = 0; i < cssFile.length; ++i) table.find(i)
})
