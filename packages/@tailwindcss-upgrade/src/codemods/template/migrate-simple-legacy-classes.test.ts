import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { migrateSimpleLegacyClasses } from './migrate-simple-legacy-classes'

test.each([
  ['overflow-ellipsis', 'text-ellipsis'],
  ['flex-grow', 'grow'],
  ['flex-grow-0', 'grow-0'],
  ['flex-shrink', 'shrink'],
  ['flex-shrink-0', 'shrink-0'],
  ['decoration-clone', 'box-decoration-clone'],
  ['decoration-slice', 'box-decoration-slice'],

  ['max-lg:hover:decoration-slice', 'max-lg:hover:box-decoration-slice'],
  ['max-lg:hover:decoration-slice!', 'max-lg:hover:box-decoration-slice!'],
  ['max-lg:hover:!decoration-slice', 'max-lg:hover:box-decoration-slice!'],

  ['focus:outline-none', 'focus:outline-hidden'],

  // Should not convert v2 utilities
  ['overflow-clip', 'overflow-clip'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(migrateSimpleLegacyClasses(designSystem, {}, candidate)).toEqual(result)
})
