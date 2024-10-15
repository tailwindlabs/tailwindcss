import { expect, test } from 'vitest'
import { buildDesignSystem } from '../design-system'
import { Theme, ThemeOptions } from '../theme'
import { applyConfigToTheme } from './apply-config-to-theme'
import { resolveConfig } from './config/resolve-config'

test('config values can be merged into the theme', () => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  let { resolvedConfig, resetThemeKeys } = resolveConfig(design, [
    {
      config: {
        theme: {
          colors: {
            primary: '#c0ffee',
            red: {
              500: 'red',
            },
          },

          screens: {
            sm: '1234px',
          },

          boxShadow: {
            normal: '0 1px 3px black',
          },

          borderRadius: {
            sm: '0.33rem',
          },

          animation: {
            blink: 'blink 1s linear infinite',
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
      base: '/root',
    },
  ])
  applyConfigToTheme(design, resolvedConfig, resetThemeKeys)

  expect(theme.resolve('primary', ['--color'])).toEqual('#c0ffee')
  expect(theme.resolve('sm', ['--breakpoint'])).toEqual('1234px')
  expect(theme.resolve('normal', ['--shadow'])).toEqual('0 1px 3px black')
  expect(theme.resolve('sm', ['--radius'])).toEqual('0.33rem')
  expect(theme.resolve('blink', ['--animate'])).toEqual('blink 1s linear infinite')
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

test('will reset default theme values with overwriting theme values', () => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  theme.add('--color-blue-400', 'lightblue', ThemeOptions.DEFAULT)
  theme.add('--color-blue-500', 'blue', ThemeOptions.DEFAULT)
  theme.add('--color-red-400', '#f87171')
  theme.add('--color-red-500', '#ef4444')

  let { resolvedConfig, resetThemeKeys } = resolveConfig(design, [
    {
      config: {
        theme: {
          colors: {
            blue: {
              500: '#3b82f6',
            },
            red: {
              500: 'red',
            },
          },
          extend: {
            colors: {
              blue: {
                600: '#2563eb',
              },
              red: {
                600: '#dc2626',
              },
            },
          },
        },
      },
      base: '/root',
    },
  ])
  applyConfigToTheme(design, resolvedConfig, resetThemeKeys)

  expect(theme.namespace('--color')).toMatchInlineSnapshot(`
    Map {
      "red-400" => "#f87171",
      "red-500" => "#ef4444",
      "blue-500" => "#3b82f6",
      "blue-600" => "#2563eb",
      "red-600" => "#dc2626",
    }
  `)
})

test('invalid keys are not merged into the theme', () => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  let { resolvedConfig, resetThemeKeys } = resolveConfig(design, [
    {
      config: {
        theme: {
          colors: {
            'primary color': '#86753099',
          },
        },
      },
      base: '/root',
    },
  ])

  applyConfigToTheme(design, resolvedConfig, resetThemeKeys)

  let entries = Array.from(theme.entries())

  expect(entries.length).toEqual(0)
})
