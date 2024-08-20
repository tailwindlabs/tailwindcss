import { bench } from 'vitest'
import { toKeyPath } from './to-key-path'

bench('toKeyPath', () => {
  toKeyPath('fontSize.xs')
  toKeyPath('fontSize.xs[1].lineHeight')
  toKeyPath('colors.red.500')
  toKeyPath('colors[red].500')
  toKeyPath('colors[red].[500]')
  toKeyPath('colors[red]500')
  toKeyPath('colors[red][500]')
})
