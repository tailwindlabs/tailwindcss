import { expect, test } from 'vitest'
import { atRule, decl, styleRule, toCss } from '../ast'
import { buildDesignSystem } from '../design-system'
import { Theme } from '../theme'
import { applyKeyframesToTheme } from './apply-keyframes-to-theme'
import { resolveConfig } from './config/resolve-config'

test('keyframes can be merged into the theme', () => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  let { resolvedConfig, replacedThemeKeys } = resolveConfig(design, [
    {
      config: {
        theme: {
          extend: {
            keyframes: {
              'fade-in': {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
              },
              'fade-out': {
                '0%': { opacity: '1' },
                '100%': { opacity: '0' },
              },
            },
          },
        },
      },
      base: '/root',
    },
  ])
  applyKeyframesToTheme(design, resolvedConfig, replacedThemeKeys)

  expect(toCss(design.theme.getKeyframes())).toMatchInlineSnapshot(`
    "@keyframes fade-in {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes fade-out {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
    "
  `)
})

test('will append to the default keyframes with new keyframes', () => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  theme.addKeyframes(
    atRule('@keyframes', 'slide-in', [
      styleRule('from', [decl('opacity', 'translateX(0%)')]),
      styleRule('to', [decl('opacity', 'translateX(100%)')]),
    ]),
  )
  theme.addKeyframes(
    atRule('@keyframes', 'slide-out', [
      styleRule('from', [decl('opacity', 'translateX(100%)')]),
      styleRule('to', [decl('opacity', 'translateX(0%)')]),
    ]),
  )

  let { resolvedConfig, replacedThemeKeys } = resolveConfig(design, [
    {
      config: {
        theme: {
          keyframes: {
            'fade-in': {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
            },
          },
          extend: {
            keyframes: {
              'fade-out': {
                '0%': { opacity: '1' },
                '100%': { opacity: '0' },
              },
            },
          },
        },
      },
      base: '/root',
    },
  ])
  applyKeyframesToTheme(design, resolvedConfig, replacedThemeKeys)

  expect(toCss(design.theme.getKeyframes())).toMatchInlineSnapshot(`
    "@keyframes slide-in {
      from {
        opacity: translateX(0%);
      }
      to {
        opacity: translateX(100%);
      }
    }
    @keyframes slide-out {
      from {
        opacity: translateX(100%);
      }
      to {
        opacity: translateX(0%);
      }
    }
    @keyframes fade-in {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes fade-out {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
    "
  `)
})
