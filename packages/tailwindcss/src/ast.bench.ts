import { bench, describe } from 'vitest'
import { cloneAstNode, toCss } from './ast'
import * as CSS from './css-parser'

const css = String.raw
const input = css`
  @theme {
    --color-primary: #333;
  }
  @tailwind utilities;
  .foo {
    color: red;
    /* comment */
    &:hover {
      color: blue;
      @apply font-bold;
    }
  }
`
const ast = CSS.parse(input)

describe('AST to CSS', () => {
  bench('toCss', () => {
    toCss(ast)
  })

  bench('toCss with source maps', () => {
    toCss(ast, true)
  })
})

describe('Cloning AST nodes', () => {
  bench('cloneAstNode()', () => {
    ast.map(cloneAstNode)
  })

  bench('structuredClone()', () => {
    structuredClone(ast)
  })
})
