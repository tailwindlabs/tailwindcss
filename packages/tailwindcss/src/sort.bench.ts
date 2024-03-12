import { bench } from 'vitest'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'

const input = 'a-class px-3 p-1 b-class py-3 bg-red-500 bg-blue-500'.split(' ')
const emptyDesign = buildDesignSystem(new Theme())
const simpleDesign = (() => {
  let simpleTheme = new Theme()
  simpleTheme.add('--spacing-1', '0.25rem')
  simpleTheme.add('--spacing-3', '0.75rem')
  simpleTheme.add('--spacing-4', '1rem')
  simpleTheme.add('--color-red-500', 'red')
  simpleTheme.add('--color-blue-500', 'blue')
  return buildDesignSystem(simpleTheme)
})()

bench('getClassOrder (empty theme)', () => {
  emptyDesign.getClassOrder(input)
})

bench('getClassOrder (simple theme)', () => {
  simpleDesign.getClassOrder(input)
})
