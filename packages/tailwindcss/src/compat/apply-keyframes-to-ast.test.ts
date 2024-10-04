import { expect, test } from 'vitest'
import { toCss, type AstNode } from '../ast'
import { buildDesignSystem } from '../design-system'
import { Theme } from '../theme'
import { applyKeyframesToAst } from './apply-keyframes-to-ast'
import { resolveConfig } from './config/resolve-config'

test('Config values can be merged into the theme', () => {
  let theme = new Theme()
  let design = buildDesignSystem(theme)

  let ast: AstNode[] = []

  let resolvedUserConfig = resolveConfig(design, [
    {
      config: {
        theme: {
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
      base: '/root',
    },
  ])
  applyKeyframesToAst(ast, resolvedUserConfig)

  expect(toCss(ast)).toMatchInlineSnapshot(`
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
