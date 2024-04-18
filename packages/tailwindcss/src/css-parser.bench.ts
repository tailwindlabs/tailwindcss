import { readFileSync } from 'node:fs'
import { bench } from 'vitest'
import * as CSS from './css-parser.ts'

const currentFolder = new URL('..', import.meta.url).pathname
const cssFile = readFileSync(currentFolder + './preflight.css', 'utf-8')

bench('css-parser on preflight.css', () => {
  CSS.parse(cssFile)
})
