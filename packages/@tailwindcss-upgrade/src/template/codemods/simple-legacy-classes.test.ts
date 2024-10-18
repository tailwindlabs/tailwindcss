import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { mockDesignSystem } from '../../mock-design-system'
import { simpleLegacyClasses } from './simple-legacy-classes'

test.each([
  ['overflow-clip', 'text-clip'],
  ['overflow-ellipsis', 'text-ellipsis'],
  ['flex-grow-0', 'grow-0'],
  ['flex-shrink-0', 'shrink-0'],
  ['decoration-clone', 'box-decoration-clone'],
  ['decoration-slice', 'box-decoration-slice'],

  ['max-lg:hover:decoration-slice', 'max-lg:hover:box-decoration-slice'],
  ['max-lg:hover:decoration-slice!', 'max-lg:hover:box-decoration-slice!'],
  ['max-lg:hover:!decoration-slice', 'max-lg:hover:box-decoration-slice!'],
])('%s => %s', async (candidate, result) => {
  let designSystem = mockDesignSystem(
    await __unstable__loadDesignSystem('@import "tailwindcss";', {
      base: __dirname,
    }),
  )

  expect(simpleLegacyClasses(designSystem, {}, candidate)).toEqual(result)
})
