import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
import resolveConfig from '../src/public/resolve-config'
import { createContext } from '../src/lib/setupContextUtils'

it('should return a list of variants with meta information about the variant', () => {
  let config = {}
  let context = createContext(resolveConfig(config))

  let variants = context.getVariants()

  expect(variants).toContainEqual({
    name: 'hover',
    isArbitrary: false,
    hasDash: true,
    values: [],
    selectors: expect.any(Function),
  })

  expect(variants).toContainEqual({
    name: 'group',
    isArbitrary: true,
    hasDash: true,
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
  expect(variant.selectors({ modifier: 'foo', value: 'hover' })).toEqual(['.group\\/foo:hover &'])
  expect(variant.selectors({ modifier: 'foo', value: '.foo_&' })).toEqual(['.foo .group\\/foo &'])
})

it('should provide selectors for complex matchVariant variants like `group` (when using a prefix)', () => {
  let config = { prefix: 'tw-' }
  let context = createContext(resolveConfig(config))

  let variants = context.getVariants()

  let variant = variants.find((v) => v.name === 'group')
  expect(variant.selectors()).toEqual(['.tw-group &'])
  expect(variant.selectors({})).toEqual(['.tw-group &'])
  expect(variant.selectors({ value: 'hover' })).toEqual(['.tw-group:hover &'])
  expect(variant.selectors({ value: '.foo_&' })).toEqual(['.foo .tw-group &'])
  expect(variant.selectors({ modifier: 'foo', value: 'hover' })).toEqual([
    '.tw-group\\/foo:hover &',
  ])
  expect(variant.selectors({ modifier: 'foo', value: '.foo_&' })).toEqual([
    '.foo .tw-group\\/foo &',
  ])
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

it('should provide selectors for custom plugins that do a combination of parallel variants with modifiers with arbitrary values and with atrules', () => {
  let config = {
    plugins: [
      function ({ matchVariant }) {
        matchVariant('foo', (value, { modifier }) => {
          return [
            `
              @supports (foo: ${modifier}) {
                @media (width <= 400px) {
                   &:hover
                }
              }
            `,
            `.${modifier}\\/${value} &:focus`,
          ]
        })
      },
    ],
  }
  let context = createContext(resolveConfig(config))

  let variants = context.getVariants()

  let variant = variants.find((v) => v.name === 'foo')
  expect(variant.selectors({ modifier: 'bar', value: 'baz' })).toEqual([
    '@supports (foo: bar) { @media (width <= 400px) { &:hover } }',
    '.bar\\/baz &:focus',
  ])
})

it('should work for plugins that still use the modifySelectors API', () => {
  let config = {
    plugins: [
      function ({ addVariant }) {
        addVariant('foo', ({ modifySelectors, container }) => {
          // Manually mutating the selector
          modifySelectors(({ selector }) => {
            return selectorParser((selectors) => {
              selectors.walkClasses((classNode) => {
                classNode.value = `foo:${classNode.value}`
                classNode.parent.insertBefore(classNode, selectorParser().astSync(`.foo `))
              })
            }).processSync(selector)
          })

          // Manually wrap in supports query
          let wrapper = postcss.atRule({ name: 'supports', params: 'display: grid' })
          let nodes = container.nodes
          container.removeAll()
          wrapper.append(nodes)
          container.append(wrapper)
        })
      },
    ],
  }
  let context = createContext(resolveConfig(config))

  let variants = context.getVariants()

  let variant = variants.find((v) => v.name === 'foo')
  expect(variant.selectors({})).toEqual(['@supports (display: grid) { .foo .foo\\:& }'])
})

it('should special case the `@`', () => {
  let config = {
    plugins: [
      ({ matchVariant }) => {
        matchVariant(
          '@',
          (value, { modifier }) => `@container ${modifier ?? ''} (min-width: ${value})`,
          {
            modifiers: 'any',
            values: {
              xs: '20rem',
              sm: '24rem',
              md: '28rem',
              lg: '32rem',
              xl: '36rem',
              '2xl': '42rem',
              '3xl': '48rem',
              '4xl': '56rem',
              '5xl': '64rem',
              '6xl': '72rem',
              '7xl': '80rem',
            },
          }
        )
      },
    ],
  }
  let context = createContext(resolveConfig(config))

  let variants = context.getVariants()

  let variant = variants.find((v) => v.name === '@')
  expect(variant).toEqual({
    name: '@',
    isArbitrary: true,
    hasDash: false,
    values: expect.any(Array),
    selectors: expect.any(Function),
  })
  expect(variant.selectors({ value: 'xs', modifier: 'foo' })).toEqual([
    '@container foo (min-width: 20rem)',
  ])
})
