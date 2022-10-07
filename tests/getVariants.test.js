import resolveConfig from '../src/public/resolve-config'
import { createContext } from '../src/lib/setupContextUtils'

it('should return a list of variants with meta information about the variant', () => {
  let config = {}
  let context = createContext(resolveConfig(config))

  let variants = context.getVariants()

  expect(variants).toContainEqual({
    name: 'hover',
    isArbitrary: false,
    values: [],
    selectors: expect.any(Function),
  })

  expect(variants).toContainEqual({
    name: 'group',
    isArbitrary: true,
    values: expect.any(Array),
    selectors: expect.any(Function),
  })

  // `group-hover` now belongs to the `group` variant. The information exposed for the `group`
  // variant is all you need.
  expect(variants.find((v) => v.name === 'group-hover')).toBeUndefined()
})

it('should provide selectors for simple variants', () => {
  let config = {}
  let context = createContext(resolveConfig(config))

  let variants = context.getVariants()

  let variant = variants.find((v) => v.name === 'hover')
  expect(variant.selectors()).toEqual(['&:hover'])
})

it('should provide selectors for parallel variants', () => {
  let config = {}
  let context = createContext(resolveConfig(config))

  let variants = context.getVariants()

  let variant = variants.find((v) => v.name === 'marker')
  expect(variant.selectors()).toEqual(['& *::marker', '&::marker'])
})

it('should provide selectors for complex matchVariant variants like `group`', () => {
  let config = {}
  let context = createContext(resolveConfig(config))

  let variants = context.getVariants()

  let variant = variants.find((v) => v.name === 'group')
  expect(variant.selectors()).toEqual(['.group &'])
  expect(variant.selectors({})).toEqual(['.group &'])
  expect(variant.selectors({ value: 'hover' })).toEqual(['.group:hover &'])
  expect(variant.selectors({ value: '.foo_&' })).toEqual(['.foo .group &'])
  expect(variant.selectors({ label: 'foo', value: 'hover' })).toEqual(['.group\\<foo\\>:hover &'])
  expect(variant.selectors({ label: 'foo', value: '.foo_&' })).toEqual(['.foo .group\\<foo\\> &'])
})

it('should provide selectors for variants with atrules', () => {
  let config = {}
  let context = createContext(resolveConfig(config))

  let variants = context.getVariants()

  let variant = variants.find((v) => v.name === 'supports')
  expect(variant.selectors({ value: 'display:grid' })).toEqual(['@supports (display:grid)'])
  expect(variant.selectors({ value: 'aspect-ratio' })).toEqual([
    '@supports (aspect-ratio: var(--tw))',
  ])
})

it('should provide selectors for custom plugins that do a combination of parallel variants with labels with arbitrary values and with atrules', () => {
  let config = {
    plugins: [
      function ({ matchVariant }) {
        matchVariant('foo', ({ label, value }) => {
          return [
            `
              @supports (foo: ${label}) {
                @media (width <= 400px) {
                   &:hover
                }
              }
            `,
            `.${label}\\/${value} &:focus`,
          ]
        })
      },
    ],
  }
  let context = createContext(resolveConfig(config))

  let variants = context.getVariants()

  let variant = variants.find((v) => v.name === 'foo')
  expect(variant.selectors({ label: 'bar', value: 'baz' })).toEqual([
    '@supports (foo: bar) { @media (width <= 400px) { &:hover } }',
    '.bar\\/baz &:focus',
  ])
})
