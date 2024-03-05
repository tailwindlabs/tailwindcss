import { bench } from 'vitest'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'

const input = 'a-class px-3 p-1 b-class py-3 bg-red-500 bg-blue-500'.split(' ')
const emptyDesign = buildDesignSystem(new Theme())
const simpleDesign = buildDesignSystem(
  new Theme(
    new Map([
      ['--spacing-1', '0.25rem'],
      ['--spacing-3', '0.75rem'],
      ['--spacing-4', '1rem'],
      ['--color-red-500', 'red'],
      ['--color-blue-500', 'blue'],
    ]),
  ),
)

bench('getClassOrder (empty theme)', () => {
  emptyDesign.getClassOrder(input)
})

bench('getClassOrder (simple theme)', () => {
  simpleDesign.getClassOrder(input)
})
