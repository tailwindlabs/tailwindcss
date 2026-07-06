import { describe, expect, it, test } from 'vitest'
import {
  context,
  cssContext,
  decl,
  handleNesting,
  optimizeAst,
  rule,
  styleRule,
  toCss,
  type AstNode,
} from './ast'
import * as CSS from './css-parser'
import { buildDesignSystem } from './design-system'
import { pretty } from './test-utils/run'
import { Theme } from './theme'
import { walk } from './walk'

const css = String.raw
const defaultDesignSystem = buildDesignSystem(new Theme())

it('should pretty print an AST', () => {
  expect(pretty(toCss(CSS.parse('.foo{color:red;&:hover{color:blue;}}')))).toMatchInlineSnapshot(`
    "
    .foo {
      color: red;
      &:hover {
        color: blue;
      }
    }
    "
  `)
})

it('allows the placement of context nodes', () => {
  let ast: AstNode[] = [
    styleRule('.foo', [decl('color', 'red')]),
    context({ context: 'a' }, [
      styleRule('.bar', [
        decl('color', 'blue'),
        context({ context: 'b' }, [
          //
          styleRule('.baz', [decl('color', 'green')]),
        ]),
      ]),
    ]),
  ]

  let redContext
  let blueContext
  let greenContext

  walk(ast, (node, _ctx) => {
    if (node.kind !== 'declaration') return
    let ctx = cssContext(_ctx)
    switch (node.value) {
      case 'red':
        redContext = ctx.context
        break
      case 'blue':
        blueContext = ctx.context
        break
      case 'green':
        greenContext = ctx.context
        break
    }
  })

  expect(redContext).toEqual({})
  expect(blueContext).toEqual({ context: 'a' })
  expect(greenContext).toEqual({ context: 'b' })

  expect(pretty(toCss(optimizeAst(ast, defaultDesignSystem)))).toMatchInlineSnapshot(`
    "
    .foo {
      color: red;
    }
    .bar {
      color: blue;
      .baz {
        color: green;
      }
    }
    "
  `)
})

it('should not emit empty rules once optimized', () => {
  let ast = CSS.parse(css`
    /* Empty rule */
    .foo {
    }

    /* Empty rule, with nesting */
    .foo {
      .bar {
      }
      .baz {
      }
    }

    /* Empty rule, with special case '&' rules */
    .foo {
      & {
        &:hover {
        }
        &:focus {
        }
      }
    }

    /* Empty at-rule */
    @media (min-width: 768px) {
    }

    /* Empty at-rule with nesting*/
    @media (min-width: 768px) {
      .foo {
      }

      @media (min-width: 1024px) {
        .bar {
        }
      }
    }

    /* Exceptions: */
    @charset "UTF-8";
    @layer foo, bar, baz;
    @layer foo, bar, baz; /* Will be deduped */
    @custom-media --modern (color), (hover);
    @namespace 'http://www.w3.org/1999/xhtml';
    @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
  `)

  expect(pretty(toCss(ast))).toMatchInlineSnapshot(`
    "
    .foo {
    }
    .foo {
      .bar {
      }
      .baz {
      }
    }
    .foo {
      & {
        &:hover {
        }
        &:focus {
        }
      }
    }
    @media (min-width: 768px);
    @media (min-width: 768px) {
      .foo {
      }
      @media (min-width: 1024px) {
        .bar {
        }
      }
    }
    @charset "UTF-8";
    @layer foo, bar, baz;
    @layer foo, bar, baz;
    @custom-media --modern (color), (hover);
    @namespace 'http://www.w3.org/1999/xhtml';
    @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
    "
  `)

  expect(pretty(toCss(optimizeAst(ast, defaultDesignSystem)))).toMatchInlineSnapshot(`
    "
    @charset "UTF-8";
    @layer foo, bar, baz;
    @custom-media --modern (color), (hover);
    @namespace 'http://www.w3.org/1999/xhtml';
    @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
    "
  `)
})

it('should not emit exact duplicate declarations in the same rule', () => {
  let ast = CSS.parse(css`
    .foo {
      color: red;
      .bar {
        color: green;
        color: blue;
        color: green;
      }
      color: red;
    }
    .foo {
      color: red;
      & {
        color: green;
        & {
          color: red;
          color: green;
          color: blue;
        }
        color: red;
      }
      background: blue;
      .bar {
        color: green;
        color: blue;
        color: green;
      }
      caret-color: orange;
    }
  `)

  expect(pretty(toCss(ast))).toMatchInlineSnapshot(`
    "
    .foo {
      color: red;
      .bar {
        color: green;
        color: blue;
        color: green;
      }
      color: red;
    }
    .foo {
      color: red;
      & {
        color: green;
        & {
          color: red;
          color: green;
          color: blue;
        }
        color: red;
      }
      background: blue;
      .bar {
        color: green;
        color: blue;
        color: green;
      }
      caret-color: orange;
    }
    "
  `)

  expect(pretty(toCss(optimizeAst(ast, defaultDesignSystem)))).toMatchInlineSnapshot(`
    "
    .foo {
      .bar {
        color: green;
        color: blue;
        color: green;
      }
      color: red;
      & {
        color: green;
        & {
          color: red;
          color: green;
          color: blue;
        }
        color: red;
      }
      background: blue;
      .bar {
        color: green;
        color: blue;
        color: green;
      }
      caret-color: orange;
    }
    "
  `)
})

it('should not emit color-mix() fallbacks inside @keyframes', () => {
  let ast = CSS.parse(css`
    @keyframes my-animation {
      0% {
        color: color-mix(in oklab, var(--color-emerald-600) 0%, transparent);
      }
      100% {
        color: color-mix(in oklab, var(--color-emerald-600) 0%, transparent);
      }
    }
  `)

  let theme = new Theme()
  theme.add('--color-emerald-600', 'oklch(59.6% 0.145 163.225)')

  let design = buildDesignSystem(theme)

  expect(pretty(toCss(optimizeAst(ast, design)))).toMatchInlineSnapshot(`
    "
    @keyframes my-animation {
      0% {
        color: color-mix(in oklab, var(--color-emerald-600) 0%, transparent);
      }
      100% {
        color: color-mix(in oklab, var(--color-emerald-600) 0%, transparent);
      }
    }
    "
  `)
})

describe('optimization', () => {
  function optimize(input: string) {
    return pretty(toCss(handleNesting(CSS.parse(input))))
  }

  // See: https://drafts.csswg.org/css-nesting-1/
  describe('CSS Nesting Module Level 1', () => {
    it('uses the descendant combinator by default', async () => {
      expect(
        optimize(css`
          .a {
            element {
              --x: 1;
            }
            .class {
              --x: 2;
            }
            #id {
              --x: 3;
            }
            :pseudo-class {
              --x: 4;
            }
            ::pseudo-element {
              --x: 5;
            }
            [attribute] {
              --x: 6;
            }
            * {
              --x: 7;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .a element {
          --x: 1;
        }
        .a .class {
          --x: 2;
        }
        .a #id {
          --x: 3;
        }
        .a :pseudo-class {
          --x: 4;
        }
        .a ::pseudo-element {
          --x: 5;
        }
        .a [attribute] {
          --x: 6;
        }
        .a * {
          --x: 7;
        }
        "
      `)
    })

    it('should be possible to change the combinator', async () => {
      expect(
        optimize(css`
          .a {
            + .b {
              --x: 1;
            }
            > .c {
              --x: 2;
            }
            ~ .d {
              --x: 3;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .a + .b {
          --x: 1;
        }
        .a > .c {
          --x: 2;
        }
        .a ~ .d {
          --x: 3;
        }
        "
      `)
    })

    it('should replace the first rule, that contains `&` with `:scope`', async () => {
      expect(
        optimize(css`
          /* Standalone */
          & {
            --x: 1;
          }

          /* In an at-rule */
          @supports (--y: 1) {
            & {
              --x: 2;
            }
          }

          /* With :is(…) */
          :is(&) {
            --x: 3;
          }

          /* In an at-rule, with :is(…) */
          @supports (--y: 2) {
            :is(&) {
              --x: 4;
            }
          }

          /* With multiple selectors */
          &,
          .a {
            --x: 5;
          }

          /* With multiple selectors + :is(…) */
          :is(&),
          .b {
            --x: 6;
          }

          /* With multiple selectors in an at-rule */
          @supports (--y: 3) {
            &,
            .c {
              --x: 7;
            }
          }

          /* With multiple selectors in an at-rule + :is(…) */
          @supports (--y: 4) {
            :is(&),
            .d {
              --x: 8;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        :scope {
          --x: 1;
        }
        @supports (--y: 1) {
          :scope {
            --x: 2;
          }
        }
        :is(:scope) {
          --x: 3;
        }
        @supports (--y: 2) {
          :is(:scope) {
            --x: 4;
          }
        }
        :scope, .a {
          --x: 5;
        }
        :is(:scope), .b {
          --x: 6;
        }
        @supports (--y: 3) {
          :scope, .c {
            --x: 7;
          }
        }
        @supports (--y: 4) {
          :is(:scope), .d {
            --x: 8;
          }
        }
        "
      `)
    })

    it('should be possible to use `&` to explicitly match the parent', async () => {
      expect(
        optimize(css`
          .a {
            & + .b {
              --x: 1;
            }
            & > .c {
              --x: 2;
            }
            & ~ .d {
              --x: 3;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .a + .b {
          --x: 1;
        }
        .a > .c {
          --x: 2;
        }
        .a ~ .d {
          --x: 3;
        }
        "
      `)
    })

    it('should be possible to use `&` in a different location', async () => {
      expect(
        optimize(css`
          .a {
            .b & {
              --x: 1;
            }
            .c + & {
              --x: 2;
            }
            .d > & {
              --x: 3;
            }
            .e ~ & {
              --x: 4;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .b .a {
          --x: 1;
        }
        .c + .a {
          --x: 2;
        }
        .d > .a {
          --x: 3;
        }
        .e ~ .a {
          --x: 4;
        }
        "
      `)
    })

    it('should be possible to use `&` on its own', async () => {
      expect(
        optimize(css`
          .a {
            & {
              --x: 1;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .a {
          --x: 1;
        }
        "
      `)
    })

    it('should be possible to use `&` nested in `:is(…)`', async () => {
      expect(
        optimize(css`
          .a {
            :is(&) {
              --x: 1;
            }
            :is(:is(:is(&))) {
              --x: 2;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        :is(.a) {
          --x: 1;
        }
        :is(:is(:is(.a))) {
          --x: 2;
        }
        "
      `)
    })

    it('should be possible to handle nesting with a parent selector list', async () => {
      expect(
        optimize(css`
          .a,
          .b {
            .c,
            .d & {
              --x: 1;
              &:hover {
                --x: 2;
              }
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        :is(.a, .b) .c, .d :is(.a, .b) {
          --x: 1;
          &:hover {
            --x: 2;
          }
        }
        "
      `)
    })

    it('should not replace `\&`', () => {
      expect(
        optimize(css`
          .a {
            .b-\& {
              --x: 1;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .a .b-\\& {
          --x: 1;
        }
        "
      `)
    })

    it('should not replace `&` as part of a string', () => {
      expect(
        optimize(css`
          .a {
            [data-b='c&d'] {
              --x: 1;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .a [data-b='c&d'] {
          --x: 1;
        }
        "
      `)
    })

    it.each([
      ['element', '&element', ':is(element)element'], // Invalid CSS
      ['element', 'element&', 'element:is(element)'],
      ['element', '&.class', 'element.class'],
      ['element', '.class&', '.class:is(element)'], // Optimization: element.class
      ['element', '&#id', 'element#id'],
      ['element', '#id&', '#id:is(element)'], // Optimization: element#id
      ['element', '&:hover', 'element:hover'],
      ['element', ':hover&', ':hover:is(element)'],
      ['element', '&::before', 'element::before'],
      ['element', '::before&', '::before:is(element)'], // Invalid CSS
      ['element', '&:not(.x)', 'element:not(.x)'],
      ['element', ':not(.x)&', ':not(.x):is(element)'], // Optimization: element:not(.x)
      ['element', '&[attribute]', 'element[attribute]'],
      ['element', '[attribute]&', '[attribute]:is(element)'], // Optimization: element[attribute]
      ['element', '&*', ':is(element)*'], // Invalid CSS
      ['element', '*&', 'element'],

      ['.class', '&element', ':is(.class)element'], // Invalid CSS
      ['.class', 'element&', 'element.class'],
      ['.class', '&.class', '.class.class'],
      ['.class', '.class&', '.class.class'],
      ['.class', '&#id', '.class#id'],
      ['.class', '#id&', '#id.class'],
      ['.class', '&:hover', '.class:hover'],
      ['.class', ':hover&', ':hover.class'],
      ['.class', '&::before', '.class::before'],
      ['.class', '::before&', '::before.class'], // Invalid CSS
      ['.class', '&:not(.x)', '.class:not(.x)'],
      ['.class', ':not(.x)&', ':not(.x).class'],
      ['.class', '&[attribute]', '.class[attribute]'],
      ['.class', '[attribute]&', '[attribute].class'],
      ['.class', '&*', ':is(.class)*'], // Invalid CSS
      ['.class', '*&', '.class'],

      ['#id', '&element', ':is(#id)element'], // Invalid CSS
      ['#id', 'element&', 'element#id'],
      ['#id', '&.class', '#id.class'],
      ['#id', '.class&', '.class#id'],
      ['#id', '&#id', '#id#id'],
      ['#id', '#id&', '#id#id'],
      ['#id', '&:hover', '#id:hover'],
      ['#id', ':hover&', ':hover#id'],
      ['#id', '&::before', '#id::before'],
      ['#id', '::before&', '::before#id'], // Invalid CSS
      ['#id', '&:not(.x)', '#id:not(.x)'],
      ['#id', ':not(.x)&', ':not(.x)#id'],
      ['#id', '&[attribute]', '#id[attribute]'],
      ['#id', '[attribute]&', '[attribute]#id'],
      ['#id', '&*', ':is(#id)*'], // Invalid CSS
      ['#id', '*&', '#id'],

      [':hover', '&element', ':is(:hover)element'], // Invalid CSS
      [':hover', 'element&', 'element:hover'],
      [':hover', '&.class', ':hover.class'],
      [':hover', '.class&', '.class:hover'],
      [':hover', '&#id', ':hover#id'],
      [':hover', '#id&', '#id:hover'],
      [':hover', '&:hover', ':hover:hover'],
      [':hover', ':hover&', ':hover:hover'],
      [':hover', '&::before', ':hover::before'],
      [':hover', '::before&', '::before:hover'],
      [':hover', '&:not(.x)', ':hover:not(.x)'],
      [':hover', ':not(.x)&', ':not(.x):hover'],
      [':hover', '&[attribute]', ':hover[attribute]'],
      [':hover', '[attribute]&', '[attribute]:hover'],
      [':hover', '&*', ':is(:hover)*'], // Invalid CSS
      [':hover', '*&', ':hover'],

      ['::before', '&element', ':is(::before)element'], // Invalid CSS
      ['::before', 'element&', 'element::before'],
      ['::before', '&.class', '::before.class'],
      ['::before', '.class&', '.class::before'],
      ['::before', '&#id', '::before#id'],
      ['::before', '#id&', '#id::before'],
      ['::before', '&:hover', '::before:hover'],
      ['::before', ':hover&', ':hover::before'],
      ['::before', '&::before', '::before::before'],
      ['::before', '::before&', '::before::before'],
      ['::before', '&:not(.x)', '::before:not(.x)'],
      ['::before', ':not(.x)&', ':not(.x)::before'],
      ['::before', '&[attribute]', '::before[attribute]'],
      ['::before', '[attribute]&', '[attribute]::before'],
      ['::before', '&*', ':is(::before)*'], // Invalid CSS
      ['::before', '*&', '::before'],

      [':not(.x)', '&element', ':is(:not(.x))element'], // Invalid CSS
      [':not(.x)', 'element&', 'element:not(.x)'],
      [':not(.x)', '&.class', ':not(.x).class'],
      [':not(.x)', '.class&', '.class:not(.x)'],
      [':not(.x)', '&#id', ':not(.x)#id'],
      [':not(.x)', '#id&', '#id:not(.x)'],
      [':not(.x)', '&:hover', ':not(.x):hover'],
      [':not(.x)', ':hover&', ':hover:not(.x)'],
      [':not(.x)', '&::before', ':not(.x)::before'],
      [':not(.x)', '::before&', '::before:not(.x)'],
      [':not(.x)', '&:not(.x)', ':not(.x):not(.x)'],
      [':not(.x)', ':not(.x)&', ':not(.x):not(.x)'],
      [':not(.x)', '&[attribute]', ':not(.x)[attribute]'],
      [':not(.x)', '[attribute]&', '[attribute]:not(.x)'],
      [':not(.x)', '&*', ':is(:not(.x))*'], // Invalid CSS
      [':not(.x)', '*&', ':not(.x)'],

      ['[attribute]', '&element', ':is([attribute])element'], // Invalid CSS
      ['[attribute]', 'element&', 'element[attribute]'],
      ['[attribute]', '&.class', '[attribute].class'],
      ['[attribute]', '.class&', '.class[attribute]'],
      ['[attribute]', '&#id', '[attribute]#id'],
      ['[attribute]', '#id&', '#id[attribute]'],
      ['[attribute]', '&:hover', '[attribute]:hover'],
      ['[attribute]', ':hover&', ':hover[attribute]'],
      ['[attribute]', '&::before', '[attribute]::before'],
      ['[attribute]', '::before&', '::before[attribute]'],
      ['[attribute]', '&:not(.x)', '[attribute]:not(.x)'],
      ['[attribute]', ':not(.x)&', ':not(.x)[attribute]'],
      ['[attribute]', '&[attribute]', '[attribute][attribute]'],
      ['[attribute]', '[attribute]&', '[attribute][attribute]'],
      ['[attribute]', '&*', ':is([attribute])*'], // Invalid CSS
      ['[attribute]', '*&', '[attribute]'],

      ['*', '&element', ':is(*)element'], // Invalid CSS
      ['*', 'element&', 'element:is(*)'],
      ['*', '&.class', '.class'],
      ['*', '.class&', '.class:is(*)'], // Optimization: *.class → .class
      ['*', '&#id', '#id'],
      ['*', '#id&', '#id:is(*)'], // Optimization: *#id → #id
      ['*', '&:hover', ':hover'],
      ['*', ':hover&', ':hover:is(*)'],
      ['*', '&::before', '::before'],
      ['*', '::before&', '::before:is(*)'], // Invalid CSS
      ['*', '&:not(.x)', ':not(.x)'],
      ['*', ':not(.x)&', ':not(.x):is(*)'], // Optimization: *:not(.x) → :not(.x)
      ['*', '&[attribute]', '[attribute]'],
      ['*', '[attribute]&', '[attribute]:is(*)'], // Optimization: *[attribute] → [attribute]
      ['*', '&*', ':is(*)*'], // Invalid CSS
      ['*', '*&', '*'],

      ['&', '&element', ':is(:scope)element'], // Invalid CSS
      ['&', 'element&', 'element:scope'],
      ['&', '&.class', ':scope.class'],
      ['&', '.class&', '.class:scope'],
      ['&', '&#id', ':scope#id'],
      ['&', '#id&', '#id:scope'],
      ['&', '&:hover', ':scope:hover'],
      ['&', ':hover&', ':hover:scope'],
      ['&', '&::before', ':scope::before'],
      ['&', '::before&', '::before:scope'],
      ['&', '&:not(.x)', ':scope:not(.x)'],
      ['&', ':not(.x)&', ':not(.x):scope'],
      ['&', '&[attribute]', ':scope[attribute]'],
      ['&', '[attribute]&', '[attribute]:scope'],
      ['&', '&*', ':is(:scope)*'], // Invalid CSS
      ['&', '*&', ':scope'],
    ])(`'%s { %s }' → '%s' (%#)`, async (root, nested, expected) => {
      let optimized = optimize(toCss([rule(root, [rule(nested, [decl('--x', '0')])])]))
      let ast = CSS.parse(optimized)

      let count = 0
      walk(ast, () => void count++)

      // 1 rule, 1 declaration
      expect(count).toBe(2)

      if (ast[0].kind !== 'rule') throw new Error('expected a rule')
      expect(ast[0].selector).toEqual(expected)
    })

    it('should not remove the `*` namespace from namespaced selectors', () => {
      expect(
        optimize(css`
          .a {
            & *|div {
              color: red;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .a *|div {
          color: red;
        }
        "
      `)
    })

    test('multiple selectors in the list are relative to the parent', async () => {
      expect(
        optimize(css`
          .a,
          .b {
            --x: 1;
            + .c {
              --x: 2;
            }
            &.d {
              --x: 3;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .a, .b {
          --x: 1;
          + .c {
            --x: 2;
          }
          &.d {
            --x: 3;
          }
        }
        "
      `)
    })

    it('should be possible to use `&` multiple times', async () => {
      expect(
        optimize(css`
          .a {
            & .b & .c & .d {
              --x: 1;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .a .b .a .c .a .d {
          --x: 1;
        }
        "
      `)
    })

    it('should be possible to use `&` multiple times in a row', async () => {
      expect(
        optimize(css`
          .a {
            &&& {
              --x: 1;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .a.a.a {
          --x: 1;
        }
        "
      `)
    })

    it('should be possible to use `&` inside a selector', async () => {
      expect(
        optimize(css`
          .a {
            :not(&) {
              --x: 1;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        :not(.a) {
          --x: 1;
        }
        "
      `)
    })

    it('should be possible to use deeply nested CSS', async () => {
      expect(
        optimize(css`
          .a,
          .b {
            --x: 1;

            .c & {
              --x: 2;

              &:hover,
              &:focus {
                --x: 3;
                .d {
                  --x: 4;
                }
              }
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .a, .b {
          --x: 1;
          .c & {
            --x: 2;
            &:hover, &:focus {
              --x: 3;
              .d {
                --x: 4;
              }
            }
          }
        }
        "
      `)
    })

    it('should properly split rules to guarantee specificity', async () => {
      expect(
        optimize(css`
          .a {
            --before: 1;
            &:hover {
              --inside: 1;
            }
            --after: 1;
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .a {
          --before: 1;
          &:hover {
            --inside: 1;
          }
          --after: 1;
        }
        "
      `)
    })

    it.each([
      ['div', '&', 'div'],
      ['div', '[before]&', '[before]:is(div)'],
      ['div', '&[after]', 'div[after]'],
      ['div', '[before]&[after]', '[before]:is(div)[after]'],
      ['div', '[before] &', '[before] div'],
      ['div', '& [after]', 'div [after]'],
      ['div', '[before] & [after]', '[before] div [after]'],

      ['.parent', '&', '.parent'],
      ['.parent', '[before]&', '[before].parent'],
      ['.parent', '&[after]', '.parent[after]'],
      ['.parent', '[before]&[after]', '[before].parent[after]'],
      ['.parent', '[before] &', '[before] .parent'],
      ['.parent', '& [after]', '.parent [after]'],
      ['.parent', '[before] & [after]', '[before] .parent [after]'],

      ['.a > .b', '&', '.a > .b'],
      ['.a > .b', '[before]&', '[before]:is(.a > .b)'],
      ['.a > .b', '&[after]', '.a > .b[after]'],
      ['.a > .b', '[before]&[after]', '[before]:is(.a > .b)[after]'],
      ['.a > .b', '[before] &', '[before] :is(.a > .b)'],
      ['.a > .b', '& [after]', '.a > .b [after]'],
      ['.a > .b', '[before] & [after]', '[before] :is(.a > .b) [after]'],
    ])(`should optimize '%s { %s }' → '%s' (%#)`, async (root, nested, expected) => {
      let optimized = optimize(toCss([rule(root, [rule(nested, [decl('--x', '0')])])]))
      let ast = CSS.parse(optimized)

      let count = 0
      walk(ast, () => void count++)

      // 1 rule, 1 declaration
      expect(count).toBe(2)

      if (ast[0].kind !== 'rule') throw new Error('expected a rule')
      expect(ast[0].selector).toEqual(expected)
    })

    it('should hoist at-rules', async () => {
      expect(
        optimize(css`
          @layer utilities {
            .a,
            .b {
              @media (print) {
                --x: 1;
                .c {
                  @media (min-width: 123px) {
                    --x: 2;
                  }
                }
              }
            }
            .d {
              @media (print) {
                @media (min-width: 123px) {
                  --x: 3;
                }
              }
            }
          }
          @property --foo {
            syntax: '*';
          }
          @layer utilities {
            .e {
              @media (print) {
                --x: 4;
              }
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        @layer utilities {
          @media (print) {
            .a, .b {
              --x: 1;
            }
            @media (min-width: 123px) {
              :is(.a, .b) .c {
                --x: 2;
              }
              .d {
                --x: 3;
              }
            }
          }
        }
        @property --foo {
          syntax: '*';
        }
        @layer utilities {
          @media (print) {
            .e {
              --x: 4;
            }
          }
        }
        "
      `)
    })

    it('should leave `@property` and `@apply` alone', async () => {
      expect(
        optimize(css`
          .foo {
            .bar {
              @apply text-red-500 hover:text-red-600;
            }
          }

          .baz {
            @property --tw-content {
              syntax: '*';
              initial-value: '';
              inherits: false;
            }

            @property --tw-border-spacing-x {
              syntax: '<length>';
              inherits: false;
              initial-value: 0;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .foo .bar {
          @apply text-red-500 hover:text-red-600;
        }
        .baz {
          @property --tw-content {
            syntax: '*';
            initial-value: '';
            inherits: false;
          }
          @property --tw-border-spacing-x {
            syntax: '<length>';
            inherits: false;
            initial-value: 0;
          }
        }
        "
      `)
    })

    it('should merge a body-less @layer with an @layer with the same name that has a body', async () => {
      expect(
        optimize(css`
          @layer a;

          @layer a {
            @layer b {
              .x {
                color: red;
              }
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        @layer a {
          @layer b {
            .x {
              color: red;
            }
          }
        }
        "
      `)
    })

    it('should not get rid of `:is(…)` when the compound selector is part of a complex selector', async () => {
      expect(
        optimize(css`
          .foo .bar {
            .system &:focus {
              --x: 1;
            }
          }
          .foo:hover {
            .system &:focus {
              --x: 2;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        .system :is(.foo .bar):focus {
          --x: 1;
        }
        .system .foo:hover:focus {
          --x: 2;
        }
        "
      `)
    })

    it('should not dedupe adjacent at-rules with the same prelude but different bodies', async () => {
      expect(
        optimize(css`
          @font-face {
            font-family: 'A';
            src: url('/fonts/a.woff2');
          }

          @font-face {
            font-family: 'B';
            src: url('/fonts/b.woff2');
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes spin {
            to {
              transform: rotate(-360deg);
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        "
        @font-face {
          font-family: 'A';
          src: url('/fonts/a.woff2');
        }
        @font-face {
          font-family: 'B';
          src: url('/fonts/b.woff2');
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(-360deg);
          }
        }
        "
      `)
    })
  })
})
