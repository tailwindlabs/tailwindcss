import { describe, expect, test } from 'vitest'
import { buildDesignSystem } from '../design-system'
import { Theme, ThemeOptions } from '../theme'
import { applyConfigToTheme, keyPathToCssProperty } from './apply-config-to-theme'
import { resolveConfig } from './config/resolve-config'

test('config values can be merged into the theme', () => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  let { resolvedConfig, replacedThemeKeys } = resolveConfig(design, [
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

          aspectRatio: {
            retro: '4 / 3',
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
            lg: ['1.125rem', '2'],
            xl: ['1.5rem', '3rem', 'invalid'],
            '2xl': ['2rem'],
          },

          letterSpacing: {
            superWide: '0.25em',
          },

          lineHeight: {
            superLoose: '3',
          },

          width: {
            // Purposely setting to something different from the default
            '1/2': '60%',
            '0.5': '60%',
            '100%': '100%',
          },

          maxWidth: {
            '9xs': '6rem',
          },

          transitionTimingFunction: {
            fast: 'cubic-bezier(0, 0.55, 0.45, 1)',
          },
        },
      },
      base: '/root',
      reference: false,
    },
  ])
  applyConfigToTheme(design, resolvedConfig, replacedThemeKeys)

  expect(theme.resolve('primary', ['--color'])).toEqual('#c0ffee')
  expect(theme.resolve('sm', ['--breakpoint'])).toEqual('1234px')
  expect(theme.resolve('normal', ['--shadow'])).toEqual('0 1px 3px black')
  expect(theme.resolve('retro', ['--aspect'])).toEqual('4 / 3')
  expect(theme.resolve('sm', ['--radius'])).toEqual('0.33rem')
  expect(theme.resolve('blink', ['--animate'])).toEqual('blink 1s linear infinite')
  expect(theme.resolve('red-500', ['--color'])).toEqual('red')
  expect(theme.resolve('sans', ['--font'])).toEqual('Inter, system-ui, sans-serif')
  expect(theme.resolveWith('mono', ['--font'], ['--font-variation-settings'])).toEqual([
    'Potato Mono',
    { '--font-variation-settings': '"XHGT" 0.7' },
  ])
  expect(theme.resolve('sm', ['--text'])).toEqual('0.875rem')
  expect(theme.resolve('base', ['--text'])).toEqual('1rem')
  expect(theme.resolveWith('base', ['--text'], ['--line-height'])).toEqual([
    '1rem',
    { '--line-height': '1.5' },
  ])
  expect(theme.resolve('lg', ['--text'])).toEqual('1.125rem')
  expect(theme.resolveWith('lg', ['--text'], ['--line-height'])).toEqual([
    '1.125rem',
    { '--line-height': '2' },
  ])
  expect(theme.resolve('xl', ['--text'])).toEqual('1.5rem')
  expect(theme.resolveWith('xl', ['--text'], ['--line-height'])).toEqual([
    '1.5rem',
    { '--line-height': '3rem' },
  ])
  expect(theme.resolve('2xl', ['--text'])).toEqual('2rem')
  expect(theme.resolveWith('2xl', ['--text'], ['--line-height'])).toEqual([
    '2rem',
    {},
  ])
  expect(theme.resolve('super-wide', ['--tracking'])).toEqual('0.25em')
  expect(theme.resolve('super-loose', ['--leading'])).toEqual('3')
  expect(theme.resolve('1/2', ['--width'])).toEqual('60%')
  expect(theme.resolve('0.5', ['--width'])).toEqual('60%')
  expect(theme.resolve('100%', ['--width'])).toEqual('100%')
  expect(theme.resolve('9xs', ['--container'])).toEqual('6rem')
  expect(theme.resolve('fast', ['--ease'])).toEqual('cubic-bezier(0, 0.55, 0.45, 1)')
})

test('will reset default theme values with overwriting theme values', () => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  theme.add('--color-blue-400', 'lightblue', ThemeOptions.DEFAULT)
  theme.add('--color-blue-500', 'blue', ThemeOptions.DEFAULT)
  theme.add('--color-red-400', '#f87171')
  theme.add('--color-red-500', '#ef4444')

  let { resolvedConfig, replacedThemeKeys } = resolveConfig(design, [
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
  applyConfigToTheme(design, resolvedConfig, replacedThemeKeys)

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

  let { resolvedConfig, replacedThemeKeys } = resolveConfig(design, [
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

  applyConfigToTheme(design, resolvedConfig, replacedThemeKeys)

  let entries = Array.from(theme.entries())

  expect(entries.length).toEqual(0)
})

describe('keyPathToCssProperty', () => {
  test.each([
    [['width', '40', '2/5'], '--width-40-2/5'],
    [['spacing', '0.5'], '--spacing-0_5'],
  ])('converts %s to %s', (keyPath, expected) => {
    expect(`--${keyPathToCssProperty(keyPath)}`).toEqual(expected)
  })
})

test('converts opacity modifiers from decimal to percentage values', () => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  let { resolvedConfig, replacedThemeKeys } = resolveConfig(design, [
    {
      config: {
        theme: {
          opacity: {
            0: '0',
            5: '0.05',
            10: '0.1',
            15: '0.15',
            20: 0.2,
            25: 0.25,
          },
        },
      },
      base: '/root',
    },
  ])
  applyConfigToTheme(design, resolvedConfig, replacedThemeKeys)

  expect(theme.resolve('0', ['--opacity'])).toEqual('0%')
  expect(theme.resolve('5', ['--opacity'])).toEqual('5%')
  expect(theme.resolve('10', ['--opacity'])).toEqual('10%')
  expect(theme.resolve('15', ['--opacity'])).toEqual('15%')
  expect(theme.resolve('20', ['--opacity'])).toEqual('20%')
  expect(theme.resolve('25', ['--opacity'])).toEqual('25%')
})

test('handles setting theme keys to null', async () => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  theme.add('--color-blue-400', 'blue', ThemeOptions.DEFAULT)
  theme.add('--color-blue-500', '#3b82f6')
  theme.add('--color-red-400', 'red', ThemeOptions.DEFAULT)
  theme.add('--color-red-500', '#ef4444')

  let { resolvedConfig, replacedThemeKeys } = resolveConfig(design, [
    {
      config: {
        theme: {
          extend: {
            colors: {
              blue: null,
            },
          },
        },
      },
      base: '/root',
      reference: false,
    },
  ])
  applyConfigToTheme(design, resolvedConfig, replacedThemeKeys)

  expect(theme.namespace('--color')).toMatchInlineSnapshot(`
    Map {
      "blue-400" => "blue",
      "blue-500" => "#3b82f6",
      "red-400" => "red",
      "red-500" => "#ef4444",
    }
  `)
})
