import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { mockDesignSystem } from '../../mock-design-system'
import { important } from './important'

test.each([
  ['!flex', 'flex!'],
  ['min-[calc(1000px+12em)]:!flex', 'min-[calc(1000px+12em)]:flex!'],
  ['md:!block', 'md:block!'],

  // Maintains the original arbitrary value contents
  ['has-[[data-foo]]:!flex', 'has-[[data-foo]]:flex!'],
  ['!px-[calc(var(--spacing-1)-1px)]', 'px-[calc(var(--spacing-1)-1px)]!'],

  // Does not change non-important candidates
  ['bg-blue-500', 'bg-blue-500'],
  ['min-[calc(1000px+12em)]:flex', 'min-[calc(1000px+12em)]:flex'],
])('%s => %s', async (candidate, result) => {
  let designSystem = mockDesignSystem(
    await __unstable__loadDesignSystem('@import "tailwindcss";', {
      base: __dirname,
    }),
  )

  expect(important(designSystem, {}, candidate)).toEqual(result)
})
