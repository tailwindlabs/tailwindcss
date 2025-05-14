import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test, vi } from 'vitest'
import * as versions from '../../utils/version'
import { migrateCamelcaseInNamedValue } from './migrate-camelcase-in-named-value'
vi.spyOn(versions, 'isMajor').mockReturnValue(true)

test.each([
  ['text-superRed', 'text-super-red'],
  ['text-red/superOpaque', 'text-red/super-opaque'],
  ['text-superRed/superOpaque', 'text-super-red/super-opaque'],

  // Should not migrate named values in modifiers
  ['group-hover/superGroup:underline', 'group-hover/superGroup:underline'],

  ['hover:text-superRed', 'hover:text-super-red'],
  ['hover:text-red/superOpaque', 'hover:text-red/super-opaque'],
  ['hover:text-superRed/superOpaque', 'hover:text-super-red/super-opaque'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(migrateCamelcaseInNamedValue(designSystem, {}, candidate)).toEqual(result)
})
