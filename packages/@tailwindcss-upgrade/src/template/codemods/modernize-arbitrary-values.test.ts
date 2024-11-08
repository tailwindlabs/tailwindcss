import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { modernizeArbitraryValues } from './modernize-arbitrary-values'

test.each([
  // Arbitrary variants
  ['[[data-visible]]:flex', 'data-visible:flex'],
  ['[&[data-visible]]:flex', 'data-visible:flex'],
  ['[[data-visible]&]:flex', 'data-visible:flex'],
  ['[&>[data-visible]]:flex', '*:data-visible:flex'],
  ['[&_>_[data-visible]]:flex', '*:data-visible:flex'],

  ['[&:first-child]:flex', 'first:flex'],
  ['[&:not(:first-child)]:flex', 'not-first:flex'],

  // nth-child
  ['[&:nth-child(2)]:flex', 'nth-2:flex'],
  ['[&:not(:nth-child(2))]:flex', 'not-nth-2:flex'],

  ['[&:nth-child(-n+3)]:flex', 'nth-[-n+3]:flex'],
  ['[&:not(:nth-child(-n+3))]:flex', 'not-nth-[-n+3]:flex'],
  ['[&:nth-child(-n_+_3)]:flex', 'nth-[-n+3]:flex'],
  ['[&:not(:nth-child(-n_+_3))]:flex', 'not-nth-[-n+3]:flex'],

  // nth-last-child
  ['[&:nth-last-child(2)]:flex', 'nth-last-2:flex'],
  ['[&:not(:nth-last-child(2))]:flex', 'not-nth-last-2:flex'],

  ['[&:nth-last-child(-n+3)]:flex', 'nth-last-[-n+3]:flex'],
  ['[&:not(:nth-last-child(-n+3))]:flex', 'not-nth-last-[-n+3]:flex'],
  ['[&:nth-last-child(-n_+_3)]:flex', 'nth-last-[-n+3]:flex'],
  ['[&:not(:nth-last-child(-n_+_3))]:flex', 'not-nth-last-[-n+3]:flex'],

  // nth-child odd/even
  ['[&:nth-child(odd)]:flex', 'odd:flex'],
  ['[&:not(:nth-child(odd))]:flex', 'even:flex'],
  ['[&:nth-child(even)]:flex', 'even:flex'],
  ['[&:not(:nth-child(even))]:flex', 'odd:flex'],

  // Keep multiple attribute selectors as-is
  ['[[data-visible][data-dark]]:flex', '[[data-visible][data-dark]]:flex'],

  // Complex attribute selectors with operators, quotes and insensitivity flags
  ['[[data-url*="example"]]:flex', 'data-[url*="example"]:flex'],
  ['[[data-url$=".com"_i]]:flex', 'data-[url$=".com"_i]:flex'],
  ['[[data-url$=.com_i]]:flex', 'data-[url$=.com_i]:flex'],

  // Attribute selector wrapped in `&:is(…)`
  ['[&:is([data-visible])]:flex', 'data-visible:flex'],

  // Compound arbitrary variants
  ['has-[[data-visible]]:flex', 'has-data-visible:flex'],
  ['has-[&:is([data-visible])]:flex', 'has-data-visible:flex'],
  ['has-[&>[data-visible]]:flex', 'has-[&>[data-visible]]:flex'],

  ['has-[[data-slot=description]]:flex', 'has-data-[slot=description]:flex'],
  ['has-[&:is([data-slot=description])]:flex', 'has-data-[slot=description]:flex'],

  ['has-[[aria-visible="true"]]:flex', 'has-aria-visible:flex'],
  ['has-[[aria-visible]]:flex', 'has-aria-[visible]:flex'],

  ['has-[&:not(:nth-child(even))]:flex', 'has-odd:flex'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(modernizeArbitraryValues(designSystem, {}, candidate)).toEqual(result)
})
