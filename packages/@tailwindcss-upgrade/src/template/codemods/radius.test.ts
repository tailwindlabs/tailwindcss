import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { radius } from './radius'

test.each([
  ['hover:rounded', 'hover:radius'],
  ['hover:rounded-sm', 'hover:radius-sm'],
  ['hover:rounded-md', 'hover:radius-md'],
  ['hover:rounded-lg', 'hover:radius-lg'],
  ['hover:rounded-xl', 'hover:radius-xl'],
  ['hover:rounded-2xl', 'hover:radius-2xl'],
  ['hover:rounded-3xl', 'hover:radius-3xl'],
  ['hover:rounded-4xl', 'hover:radius-4xl'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(radius(designSystem, {}, candidate)).toEqual(result)
})
