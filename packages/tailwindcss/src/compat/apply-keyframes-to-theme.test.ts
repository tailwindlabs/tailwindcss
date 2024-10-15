import { expect, test } from 'vitest'
import { decl, rule, toCss } from '../ast'
import { buildDesignSystem } from '../design-system'
import { Theme, ThemeOptions } from '../theme'
import { applyKeyframesToTheme } from './apply-keyframes-to-theme'
import { resolveConfig } from './config/resolve-config'

test('keyframes can be merged into the theme', () => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  let { resolvedConfig, resetThemeKeys } = resolveConfig(design, [
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
  applyKeyframesToTheme(design, resolvedConfig, resetThemeKeys)

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

test('will reset default keyframes with overwriting keyframes', () => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  theme.addKeyframe(
    rule('@keyframes slide-in', [
      rule('from', [decl('opacity', 'translateX(0%)')]),
      rule('to', [decl('opacity', 'translateX(100%)')]),
    ]),
    ThemeOptions.DEFAULT,
  )
  theme.addKeyframe(
    rule('@keyframes slide-out', [
      rule('from', [decl('opacity', 'translateX(100%)')]),
      rule('to', [decl('opacity', 'translateX(0%)')]),
    ]),
  )

  let { resolvedConfig, resetThemeKeys } = resolveConfig(design, [
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
  applyKeyframesToTheme(design, resolvedConfig, resetThemeKeys)

  expect(toCss(design.theme.getKeyframes())).toMatchInlineSnapshot(`
    "@keyframes slide-out {
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
