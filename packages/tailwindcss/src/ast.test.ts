import { expect, it } from 'vitest'
import { context, cssContext, decl, optimizeAst, styleRule, toCss, type AstNode } from './ast'
import * as CSS from './css-parser'
import { buildDesignSystem } from './design-system'
import { pretty } from './test-utils/run'
import { Theme } from './theme'
import { walk } from './walk'

const css = String.raw
const defaultDesignSystem = buildDesignSystem(new Theme())

it('should pretty print an AST', () => {
  expect(
    pretty(
      toCss(optimizeAst(CSS.parse('.foo{color:red;&:hover{color:blue;}}'), defaultDesignSystem)),
    ),
  ).toMatchInlineSnapshot(`
    "
    .foo {
      color: red;
      &:hover {
        color: blue;
      }
    }
    "
  `)
})

it('allows the placement of context nodes', () => {
  let ast: AstNode[] = [
    styleRule('.foo', [decl('color', 'red')]),
    context({ context: 'a' }, [
      styleRule('.bar', [
        decl('color', 'blue'),
        context({ context: 'b' }, [
          //
          styleRule('.baz', [decl('color', 'green')]),
        ]),
      ]),
    ]),
  ]

  let redContext
  let blueContext
  let greenContext

  walk(ast, (node, _ctx) => {
    if (node.kind !== 'declaration') return
    let ctx = cssContext(_ctx)
    switch (node.value) {
      case 'red':
        redContext = ctx.context
        break
      case 'blue':
        blueContext = ctx.context
        break
      case 'green':
        greenContext = ctx.context
        break
    }
  })

  expect(redContext).toEqual({})
  expect(blueContext).toEqual({ context: 'a' })
  expect(greenContext).toEqual({ context: 'b' })

  expect(pretty(toCss(optimizeAst(ast, defaultDesignSystem)))).toMatchInlineSnapshot(`
    "
    .foo {
      color: red;
    }
    .bar {
      color: blue;
      .baz {
        color: green;
      }
    }
    "
  `)
})

it('should not emit empty rules once optimized', () => {
  let ast = CSS.parse(css`
    /* Empty rule */
    .foo {
    }

    /* Empty rule, with nesting */
    .foo {
      .bar {
      }
      .baz {
      }
    }

    /* Empty rule, with special case '&' rules */
    .foo {
      & {
        &:hover {
        }
        &:focus {
        }
      }
    }

    /* Empty at-rule */
    @media (min-width: 768px) {
    }

    /* Empty at-rule with nesting*/
    @media (min-width: 768px) {
      .foo {
      }

      @media (min-width: 1024px) {
        .bar {
        }
      }
    }

    /* Exceptions: */
    @charset "UTF-8";
    @layer foo, bar, baz;
    @custom-media --modern (color), (hover);
    @namespace 'http://www.w3.org/1999/xhtml';
    @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
  `)

  expect(pretty(toCss(ast))).toMatchInlineSnapshot(`
    "
    .foo {
    }
    .foo {
      .bar {
      }
      .baz {
      }
    }
    .foo {
      & {
        &:hover {
        }
        &:focus {
        }
      }
    }
    @media (min-width: 768px);
    @media (min-width: 768px) {
      .foo {
      }
      @media (min-width: 1024px) {
        .bar {
        }
      }
    }
    @charset "UTF-8";
    @layer foo, bar, baz;
    @custom-media --modern (color), (hover);
    @namespace 'http://www.w3.org/1999/xhtml';
    @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
    "
  `)

  expect(pretty(toCss(optimizeAst(ast, defaultDesignSystem)))).toMatchInlineSnapshot(`
    "
    @charset "UTF-8";
    @layer foo, bar, baz;
    @custom-media --modern (color), (hover);
    @namespace 'http://www.w3.org/1999/xhtml';
    @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
    "
  `)
})

it('should not emit exact duplicate declarations in the same rule', () => {
  let ast = CSS.parse(css`
    .foo {
      color: red;
      .bar {
        color: green;
        color: blue;
        color: green;
      }
      color: red;
    }
    .foo {
      color: red;
      & {
        color: green;
        & {
          color: red;
          color: green;
          color: blue;
        }
        color: red;
      }
      background: blue;
      .bar {
        color: green;
        color: blue;
        color: green;
      }
      caret-color: orange;
    }
  `)

  expect(pretty(toCss(ast))).toMatchInlineSnapshot(`
    "
    .foo {
      color: red;
      .bar {
        color: green;
        color: blue;
        color: green;
      }
      color: red;
    }
    .foo {
      color: red;
      & {
        color: green;
        & {
          color: red;
          color: green;
          color: blue;
        }
        color: red;
      }
      background: blue;
      .bar {
        color: green;
        color: blue;
        color: green;
      }
      caret-color: orange;
    }
    "
  `)

  expect(pretty(toCss(optimizeAst(ast, defaultDesignSystem)))).toMatchInlineSnapshot(`
    "
    .foo {
      .bar {
        color: blue;
        color: green;
      }
      color: red;
    }
    .foo {
      color: green;
      color: blue;
      color: red;
      background: blue;
      .bar {
        color: blue;
        color: green;
      }
      caret-color: orange;
    }
    "
  `)
})

it('should not emit color-mix() fallbacks inside @keyframes', () => {
  let ast = CSS.parse(css`
    @keyframes my-animation {
      0% {
        color: color-mix(in oklab, var(--color-emerald-600) 0%, transparent);
      }
      100% {
        color: color-mix(in oklab, var(--color-emerald-600) 0%, transparent);
      }
    }
  `)

  let theme = new Theme()
  theme.add('--color-emerald-600', 'oklch(59.6% 0.145 163.225)')

  let design = buildDesignSystem(theme)

  expect(pretty(toCss(optimizeAst(ast, design)))).toMatchInlineSnapshot(`
    "
    @keyframes my-animation {
      0% {
        color: color-mix(in oklab, var(--color-emerald-600) 0%, transparent);
      }
      100% {
        color: color-mix(in oklab, var(--color-emerald-600) 0%, transparent);
      }
    }
    "
  `)
})
