import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test, vi } from 'vitest'
import * as versions from '../../utils/version'
import { migrateCanonicalizeCandidate } from './migrate-canonicalize-candidate'
vi.spyOn(versions, 'isMajor').mockReturnValue(true)

test.each([
  // Normalize whitespace in arbitrary properties
  ['[display:flex]', '[display:flex]'],
  ['[display:_flex]', '[display:flex]'],
  ['[display:flex_]', '[display:flex]'],
  ['[display:_flex_]', '[display:flex]'],

  // Normalize whitespace in `calc` expressions
  ['w-[calc(100%-2rem)]', 'w-[calc(100%-2rem)]'],
  ['w-[calc(100%_-_2rem)]', 'w-[calc(100%-2rem)]'],

  // Normalize the important modifier
  ['!flex', 'flex!'],
  ['flex!', 'flex!'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(migrateCanonicalizeCandidate(designSystem, {}, candidate)).toEqual(result)
})
