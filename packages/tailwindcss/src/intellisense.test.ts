import { expect, test } from 'vitest'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'

function loadDesignSystem() {
  let theme = new Theme()
  theme.add('--spacing-0_5', '0.125rem')
  theme.add('--spacing-1', '0.25rem')
  theme.add('--spacing-3', '0.75rem')
  theme.add('--spacing-4', '1rem')
  theme.add('--width-4', '1rem')
  theme.add('--colors-red-500', 'red')
  theme.add('--colors-blue-500', 'blue')
  theme.add('--breakpoint-sm', '640px')
  theme.add('--font-size-xs', '0.75rem')
  theme.add('--font-size-xs--line-height', '1rem')
  theme.add('--perspective-dramatic', '100px')
  theme.add('--perspective-normal', '500px')
  return buildDesignSystem(theme)
}

test('getClassList', () => {
  let design = loadDesignSystem()
  let classList = design.getClassList()
  let classNames = classList.map(([name]) => name)

  expect(classNames).toMatchSnapshot()
})

test('Theme values with underscores are converted back to decimal points', () => {
  let design = loadDesignSystem()
  let classes = design.getClassList()

  expect(classes).toContainEqual(['inset-0.5', { modifiers: [] }])
})

test('getVariants', () => {
  let design = loadDesignSystem()
  let variants = design.getVariants()

  expect(variants).toMatchSnapshot()
})

test('getVariants compound', () => {
  let design = loadDesignSystem()
  let variants = design.getVariants()
  let group = variants.find((v) => v.name === 'group')!

  let list = [
    // A selector-based variant
    group.selectors({ value: 'hover' }),

    // A selector-based variant with a modifier
    group.selectors({ value: 'hover', modifier: 'sidebar' }),

    // A nested, compound, selector-based variant
    group.selectors({ value: 'group-hover' }),

    // This variant produced an at rule
    group.selectors({ value: 'sm' }),

    // This variant does not exist
    group.selectors({ value: 'md' }),
  ]

  expect(list).toEqual([
    ['&:is(:where(.group):hover *)'],
    ['&:is(:where(.group\\/sidebar):hover *)'],
    ['&:is(:where(.group):is(:where(.group):hover *) *)'],
    [],
    [],
  ])
})

test('The variant `has-force` does not crash', () => {
  let design = loadDesignSystem()
  let variants = design.getVariants()
  let has = variants.find((v) => v.name === 'has')!

  expect(has.selectors({ value: 'force' })).toMatchInlineSnapshot(`[]`)
})
