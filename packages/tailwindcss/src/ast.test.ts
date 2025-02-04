import { expect, it } from 'vitest'
import { context, decl, optimizeAst, styleRule, toCss, walk, WalkAction } from './ast'
import * as CSS from './css-parser'

const css = String.raw

it('should pretty print an AST', () => {
  expect(toCss(optimizeAst(CSS.parse('.foo{color:red;&:hover{color:blue;}}'))))
    .toMatchInlineSnapshot(`
    ".foo {
      color: red;
      &:hover {
        color: blue;
      }
    }
    "
  `)
})

it('allows the placement of context nodes', () => {
  const ast = [
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

  walk(ast, (node, { context }) => {
    if (node.kind !== 'declaration') return
    switch (node.value) {
      case 'red':
        redContext = context
        break
      case 'blue':
        blueContext = context
        break
      case 'green':
        greenContext = context
        break
    }
  })

  expect(redContext).toEqual({})
  expect(blueContext).toEqual({ context: 'a' })
  expect(greenContext).toEqual({ context: 'b' })

  expect(toCss(optimizeAst(ast))).toMatchInlineSnapshot(`
    ".foo {
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

it('should stop walking when returning `WalkAction.Stop`', () => {
  let ast = [
    styleRule('.foo', [styleRule('.nested', [styleRule('.bail', [decl('color', 'red')])])]),
    styleRule('.bar'),
    styleRule('.baz'),
    styleRule('.qux'),
  ]

  let seen = new Set()

  walk(ast, (node) => {
    if (node.kind === 'rule') {
      seen.add(node.selector)
    }

    if (node.kind === 'rule' && node.selector === '.bail') {
      return WalkAction.Stop
    }
  })

  // We do not want to see `.bar`, `.baz`, or `.qux` because we bailed early
  expect(seen).toMatchInlineSnapshot(`
    Set {
      ".foo",
      ".nested",
      ".bail",
    }
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

  expect(toCss(ast)).toMatchInlineSnapshot(`
    ".foo {
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

  expect(toCss(optimizeAst(ast))).toMatchInlineSnapshot(`
    "@charset "UTF-8";
    @layer foo, bar, baz;
    @custom-media --modern (color), (hover);
    @namespace 'http://www.w3.org/1999/xhtml';
    @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
    "
  `)
})
