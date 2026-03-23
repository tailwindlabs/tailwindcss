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

  test('inset', () => {
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

  test('gap', () => {
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

  test('border-width', () => {
    let input = css`
      .one {
        border-width: 1px;
      }

      .two {
        border-width: 1px 2px;
      }

      .three {
        border-width: 1px 2px 3px;
      }

      .four {
        border-width: 1px 2px 3px 4px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".one {
        border-top-width: 1px;
        border-right-width: 1px;
        border-bottom-width: 1px;
        border-left-width: 1px;
      }
      .two {
        border-top-width: 1px;
        border-right-width: 2px;
        border-bottom-width: 1px;
        border-left-width: 2px;
      }
      .three {
        border-top-width: 1px;
        border-right-width: 2px;
        border-bottom-width: 3px;
        border-left-width: 2px;
      }
      .four {
        border-top-width: 1px;
        border-right-width: 2px;
        border-bottom-width: 3px;
        border-left-width: 4px;
      }
      "
    `)
  })

  test('border-style', () => {
    let input = css`
      .one {
        border-style: solid;
      }

      .two {
        border-style: solid dashed;
      }

      .three {
        border-style: solid dashed dotted;
      }

      .four {
        border-style: solid dashed dotted double;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".one {
        border-top-style: solid;
        border-right-style: solid;
        border-bottom-style: solid;
        border-left-style: solid;
      }
      .two {
        border-top-style: solid;
        border-right-style: dashed;
        border-bottom-style: solid;
        border-left-style: dashed;
      }
      .three {
        border-top-style: solid;
        border-right-style: dashed;
        border-bottom-style: dotted;
        border-left-style: dashed;
      }
      .four {
        border-top-style: solid;
        border-right-style: dashed;
        border-bottom-style: dotted;
        border-left-style: double;
      }
      "
    `)
  })

  test('border-color', () => {
    let input = css`
      .one {
        border-color: red;
      }

      .two {
        border-color: red green;
      }

      .three {
        border-color: red green blue;
      }

      .four {
        border-color: red green blue black;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".one {
        border-top-color: red;
        border-right-color: red;
        border-bottom-color: red;
        border-left-color: red;
      }
      .two {
        border-top-color: red;
        border-right-color: green;
        border-bottom-color: red;
        border-left-color: green;
      }
      .three {
        border-top-color: red;
        border-right-color: green;
        border-bottom-color: blue;
        border-left-color: green;
      }
      .four {
        border-top-color: red;
        border-right-color: green;
        border-bottom-color: blue;
        border-left-color: black;
      }
      "
    `)
  })

  test('scroll-margin', () => {
    let input = css`
      .one {
        scroll-margin: 1px;
      }

      .two {
        scroll-margin: 1px 2px;
      }

      .three {
        scroll-margin: 1px 2px 3px;
      }

      .four {
        scroll-margin: 1px 2px 3px 4px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".one {
        scroll-margin-top: 1px;
        scroll-margin-right: 1px;
        scroll-margin-bottom: 1px;
        scroll-margin-left: 1px;
      }
      .two {
        scroll-margin-top: 1px;
        scroll-margin-right: 2px;
        scroll-margin-bottom: 1px;
        scroll-margin-left: 2px;
      }
      .three {
        scroll-margin-top: 1px;
        scroll-margin-right: 2px;
        scroll-margin-bottom: 3px;
        scroll-margin-left: 2px;
      }
      .four {
        scroll-margin-top: 1px;
        scroll-margin-right: 2px;
        scroll-margin-bottom: 3px;
        scroll-margin-left: 4px;
      }
      "
    `)
  })

  test('scroll-padding', () => {
    let input = css`
      .one {
        scroll-padding: 1px;
      }

      .two {
        scroll-padding: 1px 2px;
      }

      .three {
        scroll-padding: 1px 2px 3px;
      }

      .four {
        scroll-padding: 1px 2px 3px 4px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".one {
        scroll-padding-top: 1px;
        scroll-padding-right: 1px;
        scroll-padding-bottom: 1px;
        scroll-padding-left: 1px;
      }
      .two {
        scroll-padding-top: 1px;
        scroll-padding-right: 2px;
        scroll-padding-bottom: 1px;
        scroll-padding-left: 2px;
      }
      .three {
        scroll-padding-top: 1px;
        scroll-padding-right: 2px;
        scroll-padding-bottom: 3px;
        scroll-padding-left: 2px;
      }
      .four {
        scroll-padding-top: 1px;
        scroll-padding-right: 2px;
        scroll-padding-bottom: 3px;
        scroll-padding-left: 4px;
      }
      "
    `)
  })

  test('overflow', () => {
    let input = css`
      .one {
        overflow: clip;
      }

      .two {
        overflow: hidden visible;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".one {
        overflow-x: clip;
        overflow-y: clip;
      }
      .two {
        overflow-x: hidden;
        overflow-y: visible;
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

  test('margin-inline', () => {
    let input = css`
      .example {
        margin-inline: 10px 20px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".example {
        margin-left: 10px;
        margin-right: 20px;
      }
      "
    `)
  })

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

  test('padding-inline', () => {
    let input = css`
      .example {
        padding-inline: 10px 20px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".example {
        padding-left: 10px;
        padding-right: 20px;
      }
      "
    `)
  })

  test('padding-block', () => {
    let input = css`
      .example {
        padding-block: 10px 20px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".example {
        padding-top: 10px;
        padding-bottom: 20px;
      }
      "
    `)
  })

  test('scroll-margin-inline', () => {
    let input = css`
      .example {
        scroll-margin-inline: 10px 20px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".example {
        scroll-margin-left: 10px;
        scroll-margin-right: 20px;
      }
      "
    `)
  })

  test('scroll-margin-block', () => {
    let input = css`
      .example {
        scroll-margin-block: 10px 20px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".example {
        scroll-margin-top: 10px;
        scroll-margin-bottom: 20px;
      }
      "
    `)
  })

  test('scroll-padding-inline', () => {
    let input = css`
      .example {
        scroll-padding-inline: 10px 20px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".example {
        scroll-padding-left: 10px;
        scroll-padding-right: 20px;
      }
      "
    `)
  })

  test('scroll-padding-block', () => {
    let input = css`
      .example {
        scroll-padding-block: 10px 20px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".example {
        scroll-padding-top: 10px;
        scroll-padding-bottom: 20px;
      }
      "
    `)
  })

  test('border-inline-width', () => {
    let input = css`
      .example {
        border-inline-width: 1px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".example {
        border-left-width: 1px;
        border-right-width: 1px;
      }
      "
    `)
  })

  test('border-block-width', () => {
    let input = css`
      .example {
        border-inline-width: 1px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".example {
        border-left-width: 1px;
        border-right-width: 1px;
      }
      "
    `)
  })

  test('border-inline-style', () => {
    let input = css`
      .example {
        border-inline-style: 1px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".example {
        border-left-style: 1px;
        border-right-style: 1px;
      }
      "
    `)
  })

  test('border-block-style', () => {
    let input = css`
      .example {
        border-inline-style: 1px;
      }
    `

    expect(expand(input, options)).toMatchInlineSnapshot(`
      ".example {
        border-left-style: 1px;
        border-right-style: 1px;
      }
      "
    `)
  })
})
