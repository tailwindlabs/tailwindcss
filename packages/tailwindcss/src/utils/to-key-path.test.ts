import { expect, it } from 'vitest'
import { toKeyPath } from './to-key-path'

it('can convert key paths to arrays', () => {
  expect(toKeyPath('fontSize.xs')).toEqual(['fontSize', 'xs'])
  expect(toKeyPath('fontSize.xs[1].lineHeight')).toEqual(['fontSize', 'xs', '1', 'lineHeight'])
  expect(toKeyPath('colors.red.500')).toEqual(['colors', 'red', '500'])
  expect(toKeyPath('colors[red].500')).toEqual(['colors', 'red', '500'])
  expect(toKeyPath('colors[red].[500]')).toEqual(['colors', 'red', '500'])
  expect(toKeyPath('colors[red]500')).toEqual(['colors', 'red', '500'])
  expect(toKeyPath('colors[red][500]')).toEqual(['colors', 'red', '500'])
  expect(toKeyPath('colors[red]500[50]5')).toEqual(['colors', 'red', '500', '50', '5'])
})
