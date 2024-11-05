import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { simpleLegacyClasses } from './simple-legacy-classes'

test.each([
  ['overflow-clip', 'text-clip'],
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

  ['shadow', 'shadow-sm'],
  ['shadow-sm', 'shadow-xs'],
  ['shadow-xs', 'shadow-2xs'],

  ['inset-shadow', 'inset-shadow-sm'],
  ['inset-shadow-sm', 'inset-shadow-xs'],
  ['inset-shadow-xs', 'inset-shadow-2xs'],

  ['drop-shadow', 'drop-shadow-sm'],
  ['drop-shadow-sm', 'drop-shadow-xs'],

  ['rounded', 'rounded-sm'],
  ['rounded-sm', 'rounded-xs'],

  ['blur', 'blur-sm'],
  ['blur-sm', 'blur-xs'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(simpleLegacyClasses(designSystem, {}, candidate)).toEqual(result)
})
