import { expect, it } from 'vitest'
import { optimizeCss } from '.'

let css = String.raw

it('should optimize the CSS', () => {
  expect(
    optimizeCss(css`
      .foo {
        color: white;
      }
    `),
  ).toMatchInlineSnapshot(`
    ".foo {
      color: #fff;
    }
    "
  `)
})

it('should optimize and minify the CSS', () => {
  expect(
    optimizeCss(
      css`
        .foo {
          color: white;
        }
      `,
      { minify: true },
    ),
  ).toMatchInlineSnapshot(`".foo{color:#fff}"`)
})
