import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { modernizeArbitraryValues } from './modernize-arbitrary-values'

test.each([
  // Arbitrary variants
  ['[[data-visible]]:flex', 'data-visible:flex'],
  ['[&[data-visible]]:flex', 'data-visible:flex'],
  ['[[data-visible]&]:flex', 'data-visible:flex'],

  // Keep as-is. Ideally this is converted to `*:data-visible:flex`, but that
  // changes the specificity from (0, 2, 0) to (0, 1, 0)
  //
  // E.g.:
  //
  // - .\[\&\>\[data-visible\]\]\:flex > [data-visible]     (0, 2, 0)
  // - [data-visible]:where(.\*\:data-visible\:flex > *)    (0, 1, 0)
  //
  ['[&>[data-visible]]:flex', '[&>[data-visible]]:flex'],
  ['[&_>_[data-visible]]:flex', '[&_>_[data-visible]]:flex'],

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
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(modernizeArbitraryValues(designSystem, {}, candidate)).toEqual(result)
})
