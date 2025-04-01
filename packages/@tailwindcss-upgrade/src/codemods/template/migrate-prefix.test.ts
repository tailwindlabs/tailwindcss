import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { describe, expect, test } from 'vitest'
import { migratePrefix } from './migrate-prefix'

describe('for projects with configured prefix', () => {
  test.each([
    ['tw-flex', 'tw:flex'],
    ['-tw-mr-4', 'tw:-mr-4'],
    ['!tw-flex', 'tw:flex!'],
    ['tw-text-red-500/50', 'tw:text-red-500/50'],

    // With variants
    ['hover:tw-flex', 'tw:hover:flex'],
    ['hover:-tw-mr-4', 'tw:hover:-mr-4'],
    ['hover:!tw-flex', 'tw:hover:flex!'],

    // Does not change un-prefixed candidates
    ['flex', 'flex'],
    ['hover:flex', 'hover:flex'],

    // Adds prefix to arbitrary candidates
    ['[color:red]', 'tw:[color:red]'],

    // `.group` and `.peer` classes
    ['tw-group', 'tw:group'],
    ['tw-group/foo', 'tw:group/foo'],
    ['tw-peer', 'tw:peer'],
    ['tw-peer/foo', 'tw:peer/foo'],
  ])('%s => %s', async (candidate, result) => {
    let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss" prefix(tw);', {
      base: __dirname,
    })

    expect(migratePrefix(designSystem, { prefix: 'tw-' }, candidate)).toEqual(result)
  })
})

test('can handle complex prefix separators', async () => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss" prefix(tw);', {
    base: __dirname,
  })

  expect(migratePrefix(designSystem, { prefix: 'tw__' }, 'tw__flex')).toEqual('tw:flex')
})

describe('for projects without configured prefix', () => {
  test('ignores candidates with prefixes', async () => {
    let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
      base: __dirname,
    })

    expect(migratePrefix(designSystem, {}, 'tw-flex')).toEqual('tw-flex')
  })
})
