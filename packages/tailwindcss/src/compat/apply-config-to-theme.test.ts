import { expect, test } from 'vitest'
import { buildDesignSystem } from '../design-system'
import { Theme } from '../theme'
import { applyConfigToTheme } from './apply-config-to-theme'

test('Config values can be merged into the theme', () => {
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

          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['Potato Mono', { fontVariationSettings: '"XHGT" 0.7' }],
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
  expect(theme.resolve('sans', ['--font-family'])).toEqual('Inter, system-ui, sans-serif')
  expect(theme.resolveWith('mono', ['--font-family'], ['--font-variation-settings'])).toEqual([
    'Potato Mono',
    { '--font-variation-settings': '"XHGT" 0.7' },
  ])
  expect(theme.resolve('sm', ['--font-size'])).toEqual('0.875rem')
  expect(theme.resolve('base', ['--font-size'])).toEqual('1rem')
  expect(theme.resolveWith('base', ['--font-size'], ['--line-height'])).toEqual([
    '1rem',
    { '--line-height': '1.5' },
  ])
})
