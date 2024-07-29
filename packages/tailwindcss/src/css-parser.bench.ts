import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { bench } from 'vitest'
import * as CSS from './css-parser.ts'

const currentFolder = fileURLToPath(new URL('..', import.meta.url))
const cssFile = readFileSync(currentFolder + './preflight.css', 'utf-8')

bench('css-parser on preflight.css', () => {
  CSS.parse(cssFile)
})
