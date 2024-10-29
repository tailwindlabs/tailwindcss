import { expect, it } from 'vitest'
import { context, decl, styleRule, toCss, walk } from './ast'
import * as CSS from './css-parser'

it('should pretty print an AST', () => {
  expect(toCss(CSS.parse('.foo{color:red;&:hover{color:blue;}}'))).toMatchInlineSnapshot(`
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

  expect(toCss(ast)).toMatchInlineSnapshot(`
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
