import { test } from 'vitest'
import { buildDesignSystem } from '../design-system'
import { Theme } from '../theme'
import { applyConfigToTheme } from './apply-config-to-theme'

test('Config values can be merged into the theme', ({ expect }) => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  applyConfigToTheme(design, [
    {
      config: {
        theme: {
          colors: {
            primary: '#c0ffee',
            red: {
              500: 'red',
            },
          },

          fontSize: {
            sm: '0.875rem',
            base: [
              '1rem',
              {
                lineHeight: '1.5',
              },
            ],
          },
        },
      },
    },
  ])

  expect(theme.resolve('primary', ['--color'])).toEqual('#c0ffee')
  expect(theme.resolve('red-500', ['--color'])).toEqual('red')
  expect(theme.resolve('sm', ['--font-size'])).toEqual('0.875rem')
  expect(theme.resolve('base', ['--font-size'])).toEqual('1rem')
  expect(theme.resolveWith('base', ['--font-size'], ['--line-height'])).toEqual([
    '1rem',
    { '--line-height': '1.5' },
  ])
})

test.only('default weird shit', ({ expect }) => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  applyConfigToTheme(design, [
    {
      config: {
        theme: {
          fontFamily: {
            sans: 'Potato Sans',
          },
        },
      },
    },
  ])

  expect(theme.resolve('font-family', ['--default'])).toEqual('Potato Sans')
})

test.only('default weird shit 2', ({ expect }) => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  applyConfigToTheme(design, [
    {
      config: {
        theme: {
          fontFamily: {
            sans: ['Potato Sans', 'Banana Sans', 'sans-serif'],
          },
        },
      },
    },
  ])

  expect(theme.resolve('font-family', ['--default'])).toEqual(
    'Potato Sans, Banana Sans, sans-serif',
  )
})

test.only('default weird shit 3', ({ expect }) => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  applyConfigToTheme(design, [
    {
      config: {
        theme: {
          fontFamily: {
            sans: [
              'Potato Sans',
              { fontFeatureSettings: '"cv06"', fontVariationSettings: '"XHGT" 0.7' },
            ],
          },
        },
      },
    },
  ])

  expect(theme.resolve('font-family', ['--default'])).toEqual('Potato Sans')
  expect(theme.resolve('font-feature-settings', ['--default'])).toEqual('"cv06"')
  expect(theme.resolve('font-variation-settings', ['--default'])).toEqual('"XHGT" 0.7')
})
