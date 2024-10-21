import { bench } from 'vitest'
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
  theme.add('--opacity-background', '0.3')

  return buildDesignSystem(theme)
}

let design = loadDesignSystem()

bench('getClassList', () => {
  design.getClassList()
})

bench('getVariants', () => {
  design.getVariants()
})

bench('getVariants -> selectors(…)', () => {
  let variants = design.getVariants()
  let group = variants.find((v) => v.name === 'group')!

  // A selector-based variant
  group.selectors({ value: 'hover' })

  // A selector-based variant with a modifier
  group.selectors({ value: 'hover', modifier: 'sidebar' })

  // A nested, compound, selector-based variant
  group.selectors({ value: 'group-hover' })

  // This variant produced an at rule
  group.selectors({ value: 'sm' })

  // This variant does not exist
  group.selectors({ value: 'md' })
})

bench('candidatesToCss', () => {
  design.candidatesToCss(['underline', 'i-dont-exist', 'bg-[#fff]', 'bg-[#000]'])
})
