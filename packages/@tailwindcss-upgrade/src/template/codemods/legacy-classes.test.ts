import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { legacyClasses } from './legacy-classes'

test.each([
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

  ['backdrop-blur', 'backdrop-blur-sm'],
  ['backdrop-blur-sm', 'backdrop-blur-xs'],

  ['ring', 'ring-3'],

  ['blur!', 'blur-sm!'],
  ['hover:blur', 'hover:blur-sm'],
  ['hover:blur!', 'hover:blur-sm!'],

  ['hover:blur-sm', 'hover:blur-xs'],
  ['blur-sm!', 'blur-xs!'],
  ['hover:blur-sm!', 'hover:blur-xs!'],
])('%s => %s (%#)', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(await legacyClasses(designSystem, {}, candidate)).toEqual(result)
})
