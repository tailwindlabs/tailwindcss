import { bench, describe } from 'vitest'
import { cloneAstNode, toCss, type AstNode } from './ast'
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

  bench('cloneAstNode (with spread)', () => {
    ast.map(cloneAstNodeSpread)
  })

  bench('structuredClone()', () => {
    structuredClone(ast)
  })
})

function cloneAstNodeSpread<T extends AstNode>(node: T): T {
  switch (node.kind) {
    case 'rule':
    case 'at-rule':
    case 'at-root':
      return { ...node, nodes: node.nodes.map(cloneAstNodeSpread) }

    case 'context':
      return { ...node, context: { ...node.context }, nodes: node.nodes.map(cloneAstNodeSpread) }

    case 'declaration':
    case 'comment':
      return { ...node }

    default:
      node satisfies never
      throw new Error(`Unknown node kind: ${(node as any).kind}`)
  }
}
