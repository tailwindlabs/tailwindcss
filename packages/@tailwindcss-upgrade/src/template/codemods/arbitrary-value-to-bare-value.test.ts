import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { arbitraryValueToBareValue } from './arbitrary-value-to-bare-value'

test.each([
  ['data-[selected]:flex', 'data-selected:flex'],
  ['data-[foo=bar]:flex', 'data-[foo=bar]:flex'],

  ['group-data-[selected]:flex', 'group-data-selected:flex'],
  ['group-data-[foo=bar]:flex', 'group-data-[foo=bar]:flex'],
  ['group-has-data-[selected]:flex', 'group-has-data-selected:flex'],

  ['aria-[selected]:flex', 'aria-[selected]:flex'],
  ['aria-[selected="true"]:flex', 'aria-selected:flex'],

  ['group-aria-[selected]:flex', 'group-aria-[selected]:flex'],
  ['group-aria-[selected="true"]:flex', 'group-aria-selected:flex'],
  ['group-has-aria-[selected]:flex', 'group-has-aria-[selected]:flex'],

  ['max-lg:hover:data-[selected]:flex!', 'max-lg:hover:data-selected:flex!'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(arbitraryValueToBareValue(designSystem, {}, candidate)).toEqual(result)
})
