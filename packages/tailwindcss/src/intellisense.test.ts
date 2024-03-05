import { expect, test } from 'vitest'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'

function loadDesignSystem() {
  return buildDesignSystem(
    new Theme(
      new Map([
        ['--spacing-0_5', '0.125rem'],
        ['--spacing-1', '0.25rem'],
        ['--spacing-3', '0.75rem'],
        ['--spacing-4', '1rem'],
        ['--width-4', '1rem'],
        ['--colors-red-500', 'red'],
        ['--colors-blue-500', 'blue'],
        ['--breakpoint-sm', '640px'],
        ['--font-size-xs', '0.75rem'],
        ['--font-size-xs--line-height', '1rem'],
      ]),
    ),
  )
}

test('getClassList', () => {
  let design = loadDesignSystem()
  let classList = design.getClassList()
  let classNames = classList.map(([name]) => name)

  expect(classNames).toMatchSnapshot()
})

test('Theme values with underscores are converted back to deciaml points', () => {
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
