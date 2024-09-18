import { expect, test } from 'vitest'
import { toCss } from '../ast'
import { parse } from '../css-parser'
import { flattenNesting } from './nesting'

const css = String.raw

test('parse', () => {
  let ast = parse(css`
    .a {
      color: red;
      @layer thing {
        .b {
          color: orange;
          @media (min-width: 600px) {
            .c {
              color: yellow;
            }
          }
          .d {
            @supports (color: green) {
              color: green;
            }
          }
          color: blue;
        }
      }
      .e {
        color: indigo;
      }
      color: violet;
    }
  `)
  expect(toCss(flattenNesting(ast))).toMatchInlineSnapshot(`
    ".a {
      color: red;
      color: violet;
    }
    @layer thing {
      .a .b {
        color: orange;
        color: blue;
      }
    }
    @layer thing {
      @media (min-width: 600px) {
        .a .b .c {
          color: yellow;
        }
      }
    }
    @layer thing {
      .a .b .d {
        color: green;
      }
    }
    .a .e {
      color: indigo;
    }
    "
  `)
})

test('parse', () => {
  let ast = parse(css`
    .a {
      color: red;
      .b {
        color: orange;
        color: blue;
      }
      .b {
        .c {
          color: yellow;
        }
      }
      .b {
        .d {
          color: green;
        }
      }
      .e {
        color: indigo;
      }
      color: violet;
    }
  `)
  expect(toCss(flattenNesting(ast))).toMatchInlineSnapshot(`
    ".a {
      color: red;
      color: violet;
    }
    .a .b {
      color: orange;
      color: blue;
    }
    .a .b .c {
      color: yellow;
    }
    .a .b .d {
      color: green;
    }
    .a .e {
      color: indigo;
    }
    "
  `)
})

test('parse', () => {
  let ast = parse(css`
    .a,
    .b {
      color: red;

      .c,
      .d {
        .e,
        .f {
          .g,
          .h {
            color: green;
          }
        }
      }
    }
  `)
  expect(toCss(flattenNesting(ast))).toMatchInlineSnapshot(`
    ":is(.a, .b) {
      color: red;
    }
    :is(:is(:is(:is(.a, .b) .c, :is(.a, .b) .d) .e, :is(:is(.a, .b) .c, :is(.a, .b) .d) .f) .g, :is(:is(:is(.a, .b) .c, :is(.a, .b) .d) .e, :is(:is(.a, .b) .c, :is(.a, .b) .d) .f) .h) {
      color: green;
    }
    "
  `)
})

test('flat variant', () => {
  let ast = parse(css`
    &:hover {
      &:focus {
        &:active {
          @slot;
        }

        &[data-whatever] {
          @slot;
        }
      }

      &[data-foo] {
        @slot;
      }
    }

    &:visited {
      @slot;
    }
  `)

  expect(toCss(flattenNesting(ast))).toMatchInlineSnapshot(`
    "&:hover:focus:hover:focus:active {
      @slot;
    }
    &:hover:focus:hover:focus[data-whatever] {
      @slot;
    }
    &:hover[data-foo] {
      @slot;
    }
    &:visited {
      @slot;
    }
    "
  `)
})
