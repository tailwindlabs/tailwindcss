import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test, vi } from 'vitest'
import * as versions from '../../utils/version'
import { migrateLegacyClasses } from './migrate-legacy-classes'
vi.spyOn(versions, 'isMajor').mockReturnValue(true)

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

  ['outline', 'outline-solid'],

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

  expect(await migrateLegacyClasses(designSystem, {}, candidate)).toEqual(result)
})
