import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { migrateEmptyArbitraryValues } from './migrate-handle-empty-arbitrary-values'
import { migrateModernizeArbitraryValues } from './migrate-modernize-arbitrary-values'
import { migratePrefix } from './migrate-prefix'

test.each([
  // Arbitrary variants
  ['[[data-visible]]:flex', 'data-visible:flex'],
  ['[&[data-visible]]:flex', 'data-visible:flex'],
  ['[[data-visible]&]:flex', 'data-visible:flex'],
  ['[&>[data-visible]]:flex', '*:data-visible:flex'],
  ['[&_>_[data-visible]]:flex', '*:data-visible:flex'],
  ['[&>*]:flex', '*:flex'],
  ['[&_>_*]:flex', '*:flex'],

  ['[&_[data-visible]]:flex', '**:data-visible:flex'],
  ['[&_*]:flex', '**:flex'],

  ['[&:first-child]:flex', 'first:flex'],
  ['[&:not(:first-child)]:flex', 'not-first:flex'],

  // in-* variants
  ['[p_&]:flex', 'in-[p]:flex'],
  ['[.foo_&]:flex', 'in-[.foo]:flex'],
  ['[[data-visible]_&]:flex', 'in-data-visible:flex'],
  // Multiple selectors, should stay as-is
  ['[[data-foo][data-bar]_&]:flex', '[[data-foo][data-bar]_&]:flex'],
  // Using `>` instead of ` ` should not be transformed:
  ['[figure>&]:my-0', '[figure>&]:my-0'],
  // Some extreme examples of what happens in the wild:
  ['group-[]:flex', 'in-[.group]:flex'],
  ['group-[]/name:flex', 'in-[.group\\/name]:flex'],

  // Migrate `peer-[]` to a parsable `peer-[&]` instead:
  ['peer-[]:flex', 'peer-[&]:flex'],
  ['peer-[]/name:flex', 'peer-[&]/name:flex'],

  // These shouldn't happen in the real world (because compound variants are
  // new). But this could happen once we allow codemods to run in v4+ projects.
  ['has-group-[]:flex', 'has-in-[.group]:flex'],
  ['has-group-[]/name:flex', 'has-in-[.group\\/name]:flex'],
  ['not-group-[]:flex', 'not-in-[.group]:flex'],
  ['not-group-[]/name:flex', 'not-in-[.group\\/name]:flex'],

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
])('%s => %s (%#)', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(
    [migrateEmptyArbitraryValues, migrateModernizeArbitraryValues].reduce(
      (acc, step) => step(designSystem, {}, acc),
      candidate,
    ),
  ).toEqual(result)
})

test.each([
  // Should not prefix classes in arbitrary values
  ['[.foo_&]:tw-flex', 'tw:in-[.foo]:flex'],

  // Should migrate `.group` classes
  ['group-[]:tw-flex', 'tw:in-[.tw\\:group]:flex'],
  ['group-[]/name:tw-flex', 'tw:in-[.tw\\:group\\/name]:flex'],

  // Migrate `peer-[]` to a parsable `peer-[&]` instead:
  ['peer-[]:tw-flex', 'tw:peer-[&]:flex'],
  ['peer-[]/name:tw-flex', 'tw:peer-[&]/name:flex'],

  // However, `.group` inside of an arbitrary variant should not be prefixed:
  ['[.group_&]:tw-flex', 'tw:in-[.group]:flex'],

  // These shouldn't happen in the real world (because compound variants are
  // new). But this could happen once we allow codemods to run in v4+ projects.
  ['has-group-[]:tw-flex', 'tw:has-in-[.tw\\:group]:flex'],
  ['has-group-[]/name:tw-flex', 'tw:has-in-[.tw\\:group\\/name]:flex'],
  ['not-group-[]:tw-flex', 'tw:not-in-[.tw\\:group]:flex'],
  ['not-group-[]/name:tw-flex', 'tw:not-in-[.tw\\:group\\/name]:flex'],
])('%s => %s (%#)', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss" prefix(tw);', {
    base: __dirname,
  })

  expect(
    [migrateEmptyArbitraryValues, migratePrefix, migrateModernizeArbitraryValues].reduce(
      (acc, step) => step(designSystem, { prefix: 'tw-' }, acc),
      candidate,
    ),
  ).toEqual(result)
})
