import { expect, test } from 'vitest'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'

function loadDesignSystem() {
  return buildDesignSystem(
    new Theme(
      new Map([
        ['--spacing-0_5', { value: '0.125rem', isReference: true }],
        ['--spacing-1', { value: '0.25rem', isReference: true }],
        ['--spacing-3', { value: '0.75rem', isReference: true }],
        ['--spacing-4', { value: '1rem', isReference: true }],
        ['--width-4', { value: '1rem', isReference: true }],
        ['--colors-red-500', { value: 'red', isReference: true }],
        ['--colors-blue-500', { value: 'blue', isReference: true }],
        ['--breakpoint-sm', { value: '640px', isReference: true }],
        ['--font-size-xs', { value: '0.75rem', isReference: true }],
        ['--font-size-xs--line-height', { value: '1rem', isReference: true }],
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
