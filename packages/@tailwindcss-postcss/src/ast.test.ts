import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { toCss } from '../../tailwindcss/src/ast'
import { parse } from '../../tailwindcss/src/css-parser'
import { cssAstToPostCssAst, postCssAstToCssAst } from './ast'

let css = dedent

it('should convert a PostCSS AST into a Tailwind CSS AST', () => {
  let input = css`
    @charset "UTF-8";

    @layer foo, bar, baz;

    @import 'tailwindcss';

    .foo {
      color: red;

      &:hover {
        color: blue;
      }

      .bar {
        color: green !important;
        background-color: yellow;

        @media (min-width: 640px) {
          color: orange;
        }
      }
    }
  `

  let ast = postcss.parse(input)
  let transformedAst = postCssAstToCssAst(ast)

  expect(toCss(transformedAst)).toMatchInlineSnapshot(`
    "@charset "UTF-8";
    @layer foo, bar, baz;
    @import 'tailwindcss';
    .foo {
      color: red;
      &:hover {
        color: blue;
      }
      .bar {
        color: green !important;
        background-color: yellow;
        @media (min-width: 640px) {
          color: orange;
        }
      }
    }
    "
  `)
})

it('should convert a Tailwind CSS AST into a PostCSS AST', () => {
  let input = css`
    @charset "UTF-8";

    @layer foo, bar, baz;

    @import 'tailwindcss';

    .foo {
      color: red;

      &:hover {
        color: blue;
      }

      .bar {
        color: green !important;
        background-color: yellow;

        @media (min-width: 640px) {
          color: orange;
        }
      }
    }
  `

  let ast = parse(input)
  let transformedAst = cssAstToPostCssAst(postcss, ast)

  expect(transformedAst.toString()).toMatchInlineSnapshot(`
    "@charset "UTF-8";
    @layer foo, bar, baz;
    @import 'tailwindcss';
    .foo {
        color: red;
        &:hover {
            color: blue;
        }
        .bar {
            color: green !important;
            background-color: yellow;
            @media (min-width: 640px) {
                color: orange;
            }
        }
    }"
  `)
})

it('should lowercase CSS-wide keywords when converting a PostCSS AST', () => {
  // prettier-ignore
  let input = css`
    .foo {
      color: INHERIT;
      width: Unset !important;
      --my-var: REVERT-LAYER;
      content: 'INHERIT';
    }
  `

  let ast = postcss.parse(input)
  let transformedAst = postCssAstToCssAst(ast)

  expect(toCss(transformedAst)).toMatchInlineSnapshot(`
    ".foo {
      color: inherit;
      width: unset !important;
      --my-var: revert-layer;
      content: 'INHERIT';
    }
    "
  `)
})
