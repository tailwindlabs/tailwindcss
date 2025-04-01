import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { legacyArbitraryValues } from './legacy-arbitrary-values'

test.each([
  ['grid-cols-[auto,1fr]', 'grid-cols-[auto_1fr]'],
  ['grid-rows-[auto,1fr]', 'grid-rows-[auto_1fr]'],
  ['object-[10px,20px]', 'object-[10px_20px]'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(legacyArbitraryValues(designSystem, {}, candidate)).toEqual(result)
})
