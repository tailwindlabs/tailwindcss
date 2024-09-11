import fs from 'node:fs'
import { bench, describe } from 'vitest'

import path from 'node:path'
import { Root } from '.'

let emptySetGetter = () => new Set<string>()

let base = path.join(__dirname, 'fixtures/src')
let filepath = path.join(base, 'index.css')
let contents = fs.readFileSync(filepath, 'utf-8')

describe('compare', () => {
  bench('postcss-import', async () => {
    try {
      let root = new Root(filepath, emptySetGetter, base, 'postcss')
      await root.generate(contents, () => {})
    } catch (e) {
      console.error(e)
    }
  })

  bench('tailwindcss-import', async () => {
    try {
      let root = new Root(filepath, emptySetGetter, base, 'tailwindcss')
      await root.generate(contents, () => {})
    } catch (e) {
      console.error(e)
    }
  })
})
