import { describe, expect, test } from 'vitest'
import { toCss } from './ast'
import { SignatureFeatures } from './canonicalize-candidates'
import { parse } from './css-parser'
import { expandDeclaration } from './expand-declaration'
import { walk, WalkAction } from './walk'

const css = String.raw

function expand(input: string, options: SignatureFeatures): string {
  let ast = parse(input)

  walk(ast, (node) => {
    if (node.kind === 'declaration') {
      let result = expandDeclaration(node, options)
      if (result) return WalkAction.ReplaceSkip(result)
    }
  })

  return toCss(ast)
}

describe('expand declarations', () => {
  let options = SignatureFeatures.ExpandProperties

  test('expand to 4 properties', () => {
    let input = css`
      .one {
        inset: 10px;
      }

      .two {
        inset: 10px 20px;
      }

      .three {
        inset: 10px 20px 30px;
      }

      .four {
        inset: 10px 20px 30px 40px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".one {
        top: 10px;
        right: 10px;
        bottom: 10px;
        left: 10px;
      }
      .two {
        top: 10px;
        right: 20px;
        bottom: 10px;
        left: 20px;
      }
      .three {
        top: 10px;
        right: 20px;
        bottom: 30px;
        left: 20px;
      }
      .four {
        top: 10px;
        right: 20px;
        bottom: 30px;
        left: 40px;
      }
      "
    `)
  })

  test('expand to 2 properties', () => {
    let input = css`
      .one {
        gap: 10px;
      }

      .two {
        gap: 10px 20px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".one {
        row-gap: 10px;
        column-gap: 10px;
      }
      .two {
        row-gap: 10px;
        column-gap: 20px;
      }
      "
    `)
  })

  test('expansion with `!important`', () => {
    let input = css`
      .one {
        inset: 10px;
      }

      .two {
        inset: 10px 20px;
      }

      .three {
        inset: 10px 20px 30px !important;
      }

      .four {
        inset: 10px 20px 30px 40px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".one {
        top: 10px;
        right: 10px;
        bottom: 10px;
        left: 10px;
      }
      .two {
        top: 10px;
        right: 20px;
        bottom: 10px;
        left: 20px;
      }
      .three {
        top: 10px !important;
        right: 20px !important;
        bottom: 30px !important;
        left: 20px !important;
      }
      .four {
        top: 10px;
        right: 20px;
        bottom: 30px;
        left: 40px;
      }
      "
    `)
  })
})

describe('expand logical properties', () => {
  let options = SignatureFeatures.ExpandProperties | SignatureFeatures.LogicalToPhysical

  test('margin-block', () => {
    let input = css`
      .example {
        margin-block: 10px 20px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".example {
        margin-top: 10px;
        margin-bottom: 20px;
      }
      "
    `)
  })
})
