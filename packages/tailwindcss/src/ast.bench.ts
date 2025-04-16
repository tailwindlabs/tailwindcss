import { bench } from 'vitest'
import { toCss } from './ast'
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

bench('toCss', () => {
  toCss(ast)
})

bench('toCss with source maps', () => {
  toCss(ast, true)
})
