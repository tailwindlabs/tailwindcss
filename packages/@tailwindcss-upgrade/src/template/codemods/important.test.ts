import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { important } from './important'

test.each([
  ['!flex', 'flex!'],
  ['min-[calc(1000px+12em)]:!flex', 'min-[calc(1000px_+_12em)]:flex!'],
  ['md:!block', 'md:block!'],

  // Does not change non-important candidates
  ['bg-blue-500', 'bg-blue-500'],
  ['min-[calc(1000px+12em)]:flex', 'min-[calc(1000px+12em)]:flex'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(important(designSystem, {}, candidate)).toEqual(result)
})
