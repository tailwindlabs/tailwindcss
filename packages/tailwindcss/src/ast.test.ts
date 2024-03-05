import { expect, it } from 'vitest'
import { toCss } from './ast'
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
