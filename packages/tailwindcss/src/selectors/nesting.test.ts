import { expect, test } from 'vitest'
import { atRoot, context, decl, rule, toCss } from '../ast'
import { parse } from '../css-parser'
import { flattenNesting } from './nesting'

const css = String.raw

test('it flattens nested style rules and at-rules', () => {
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
    }
    @layer thing {
      .a .b {
        color: orange;
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
      @supports (color: green) {
        .a .b .d {
          color: green;
        }
      }
    }
    @layer thing {
      .a .b {
        color: blue;
      }
    }
    .a .e {
      color: indigo;
    }
    .a {
      color: violet;
    }
    "
  `)
})

test('wip', () => {
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
    .a {
      color: violet;
    }
    "
  `)
})

test('at-root is hoisted before flattening', () => {
  let ast = [
    rule('.a', [
      decl('color', 'red'),
      rule('.b', [decl('color', 'orange'), decl('color', 'yellow')]),
      atRoot([
        rule('.root', [
          decl('color', 'green'),
          decl('color', 'blue'),

          rule('.c', [decl('color', 'indigo'), decl('color', 'violet')]),
        ]),
      ]),
    ]),
  ]

  expect(toCss(flattenNesting(ast))).toMatchInlineSnapshot(`
    ".a {
      color: red;
    }
    .a .b {
      color: orange;
      color: yellow;
    }
    .root {
      color: green;
      color: blue;
    }
    .root .c {
      color: indigo;
      color: violet;
    }
    "
  `)
})

test('context nodes are stripped', () => {
  let ast = [
    rule('.a', [
      context({}, [
        decl('color', 'red'),
        rule('.b', [decl('color', 'orange'), decl('color', 'yellow')]),
      ]),
      context({}, [
        atRoot([
          rule('.root', [
            context({}, [decl('color', 'green'), decl('color', 'blue')]),

            rule('.c', [decl('color', 'indigo'), decl('color', 'violet')]),
          ]),
        ]),
      ]),
    ]),
  ]

  expect(toCss(flattenNesting(ast))).toMatchInlineSnapshot(`
    ".a {
      color: red;
    }
    .a .b {
      color: orange;
      color: yellow;
    }
    .root {
      color: green;
      color: blue;
    }
    .root .c {
      color: indigo;
      color: violet;
    }
    "
  `)
})

test('it turns multiple nested selectors into :is(…) as needed', () => {
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
    ".a, .b {
      color: red;
    }
    :is(:is(:is(.a, .b) .c, :is(.a, .b) .d) .e, :is(:is(.a, .b) .c, :is(.a, .b) .d) .f) .g, :is(:is(:is(.a, .b) .c, :is(.a, .b) .d) .e, :is(:is(.a, .b) .c, :is(.a, .b) .d) .f) .h {
      color: green;
    }
    "
  `)
})

test('it can flatten variant-like syntax', () => {
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
    "&:hover:focus:active {
      @slot;
    }
    &:hover:focus[data-whatever] {
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
