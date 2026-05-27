import { describe, expect, it, test } from 'vitest'
import * as SelectorParser from '../src/selector-parser'
import {
  atRule,
  cloneAstNode,
  context,
  cssContext,
  decl,
  DROPPABLE_IF_EMPTY_AT_RULES,
  HOISTABLE_AT_RULES,
  optimizeAst,
  optimizeSelector,
  rule,
  styleRule,
  toCss,
  type AstNode,
} from './ast'
import * as CSS from './css-parser'
import { buildDesignSystem } from './design-system'
import { SourceLocation } from './source-maps/source'
import { pretty } from './test-utils/run'
import { Theme } from './theme'
import { segment } from './utils/segment'
import { walk, WalkAction } from './walk'

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
        color: blue;
        color: green;
      }
      color: red;
    }
    .foo {
      color: green;
      color: blue;
      color: red;
      background: blue;
      .bar {
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
    let ast = CSS.parse(input)

    let cssOracle = pretty(toCss(handleNestingOracle(ast)))

    return cssOracle
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

    it('shoud be possible to change the combinator', async () => {
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
        :scope {
          --x: 3;
        }
        @supports (--y: 2) {
          :scope {
            --x: 4;
          }
        }
        :scope, .a {
          --x: 5;
        }
        :scope, .b {
          --x: 6;
        }
        @supports (--y: 3) {
          :scope, .c {
            --x: 7;
          }
        }
        @supports (--y: 4) {
          :scope, .d {
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
        .a {
          --x: 1;
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
        }
        :is(:is(.a, .b) .c, .d :is(.a, .b)):hover {
          --x: 2;
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
      ['element', '&element', 'element:is(element)'],
      ['element', 'element&', 'element:is(element)'],
      ['element', '&.class', 'element.class'],
      ['element', '.class&', 'element.class'],
      ['element', '&#id', 'element#id'],
      ['element', '#id&', 'element#id'],
      ['element', '&:pseudo-class', 'element:pseudo-class'],
      ['element', ':pseudo-class&', 'element:pseudo-class'],
      ['element', '&::pseudo-element', 'element::pseudo-element'],
      ['element', '::pseudo-element&', 'element::pseudo-element'],
      ['element', '&:pseudo-fn()', 'element:pseudo-fn()'],
      ['element', ':pseudo-fn()&', 'element:pseudo-fn()'],
      ['element', '&[attribute]', 'element[attribute]'],
      ['element', '[attribute]&', 'element[attribute]'],
      ['element', '&*', 'element:is(*)'],
      ['element', '*&', 'element:is(*)'],

      ['.class', '&element', 'element.class'],
      ['.class', 'element&', 'element.class'],
      ['.class', '&.class', '.class.class'],
      ['.class', '.class&', '.class.class'],
      ['.class', '&#id', '.class#id'],
      ['.class', '#id&', '#id.class'],
      ['.class', '&:pseudo-class', '.class:pseudo-class'],
      ['.class', ':pseudo-class&', ':pseudo-class.class'],
      ['.class', '&::pseudo-element', '.class::pseudo-element'],
      ['.class', '::pseudo-element&', '::pseudo-element.class'],
      ['.class', '&:pseudo-fn()', '.class:pseudo-fn()'],
      ['.class', ':pseudo-fn()&', ':pseudo-fn().class'],
      ['.class', '&[attribute]', '.class[attribute]'],
      ['.class', '[attribute]&', '[attribute].class'],
      ['.class', '&*', '*.class'],
      ['.class', '*&', '*.class'],

      ['#id', '&element', 'element#id'],
      ['#id', 'element&', 'element#id'],
      ['#id', '&.class', '#id.class'],
      ['#id', '.class&', '.class#id'],
      ['#id', '&#id', '#id#id'],
      ['#id', '#id&', '#id#id'],
      ['#id', '&:pseudo-class', '#id:pseudo-class'],
      ['#id', ':pseudo-class&', ':pseudo-class#id'],
      ['#id', '&::pseudo-element', '#id::pseudo-element'],
      ['#id', '::pseudo-element&', '::pseudo-element#id'],
      ['#id', '&:pseudo-fn()', '#id:pseudo-fn()'],
      ['#id', ':pseudo-fn()&', ':pseudo-fn()#id'],
      ['#id', '&[attribute]', '#id[attribute]'],
      ['#id', '[attribute]&', '[attribute]#id'],
      ['#id', '&*', '*#id'],
      ['#id', '*&', '*#id'],

      [':pseudo-class', '&element', 'element:pseudo-class'],
      [':pseudo-class', 'element&', 'element:pseudo-class'],
      [':pseudo-class', '&.class', ':pseudo-class.class'],
      [':pseudo-class', '.class&', '.class:pseudo-class'],
      [':pseudo-class', '&#id', ':pseudo-class#id'],
      [':pseudo-class', '#id&', '#id:pseudo-class'],
      [':pseudo-class', '&:pseudo-class', ':pseudo-class:pseudo-class'],
      [':pseudo-class', ':pseudo-class&', ':pseudo-class:pseudo-class'],
      [':pseudo-class', '&::pseudo-element', ':pseudo-class::pseudo-element'],
      [':pseudo-class', '::pseudo-element&', '::pseudo-element:pseudo-class'],
      [':pseudo-class', '&:pseudo-fn()', ':pseudo-class:pseudo-fn()'],
      [':pseudo-class', ':pseudo-fn()&', ':pseudo-fn():pseudo-class'],
      [':pseudo-class', '&[attribute]', ':pseudo-class[attribute]'],
      [':pseudo-class', '[attribute]&', '[attribute]:pseudo-class'],
      [':pseudo-class', '&*', '*:pseudo-class'],
      [':pseudo-class', '*&', '*:pseudo-class'],

      ['::pseudo-element', '&element', 'element::pseudo-element'],
      ['::pseudo-element', 'element&', 'element::pseudo-element'],
      ['::pseudo-element', '&.class', '::pseudo-element.class'],
      ['::pseudo-element', '.class&', '.class::pseudo-element'],
      ['::pseudo-element', '&#id', '::pseudo-element#id'],
      ['::pseudo-element', '#id&', '#id::pseudo-element'],
      ['::pseudo-element', '&:pseudo-class', '::pseudo-element:pseudo-class'],
      ['::pseudo-element', ':pseudo-class&', ':pseudo-class::pseudo-element'],
      ['::pseudo-element', '&::pseudo-element', '::pseudo-element::pseudo-element'],
      ['::pseudo-element', '::pseudo-element&', '::pseudo-element::pseudo-element'],
      ['::pseudo-element', '&:pseudo-fn()', '::pseudo-element:pseudo-fn()'],
      ['::pseudo-element', ':pseudo-fn()&', ':pseudo-fn()::pseudo-element'],
      ['::pseudo-element', '&[attribute]', '::pseudo-element[attribute]'],
      ['::pseudo-element', '[attribute]&', '[attribute]::pseudo-element'],
      ['::pseudo-element', '&*', '*::pseudo-element'],
      ['::pseudo-element', '*&', '*::pseudo-element'],

      [':pseudo-fn()', '&element', 'element:pseudo-fn()'],
      [':pseudo-fn()', 'element&', 'element:pseudo-fn()'],
      [':pseudo-fn()', '&.class', ':pseudo-fn().class'],
      [':pseudo-fn()', '.class&', '.class:pseudo-fn()'],
      [':pseudo-fn()', '&#id', ':pseudo-fn()#id'],
      [':pseudo-fn()', '#id&', '#id:pseudo-fn()'],
      [':pseudo-fn()', '&:pseudo-class', ':pseudo-fn():pseudo-class'],
      [':pseudo-fn()', ':pseudo-class&', ':pseudo-class:pseudo-fn()'],
      [':pseudo-fn()', '&::pseudo-element', ':pseudo-fn()::pseudo-element'],
      [':pseudo-fn()', '::pseudo-element&', '::pseudo-element:pseudo-fn()'],
      [':pseudo-fn()', '&:pseudo-fn()', ':pseudo-fn():pseudo-fn()'],
      [':pseudo-fn()', ':pseudo-fn()&', ':pseudo-fn():pseudo-fn()'],
      [':pseudo-fn()', '&[attribute]', ':pseudo-fn()[attribute]'],
      [':pseudo-fn()', '[attribute]&', '[attribute]:pseudo-fn()'],
      [':pseudo-fn()', '&*', '*:pseudo-fn()'],
      [':pseudo-fn()', '*&', '*:pseudo-fn()'],

      ['[attribute]', '&element', 'element[attribute]'],
      ['[attribute]', 'element&', 'element[attribute]'],
      ['[attribute]', '&.class', '[attribute].class'],
      ['[attribute]', '.class&', '.class[attribute]'],
      ['[attribute]', '&#id', '[attribute]#id'],
      ['[attribute]', '#id&', '#id[attribute]'],
      ['[attribute]', '&:pseudo-class', '[attribute]:pseudo-class'],
      ['[attribute]', ':pseudo-class&', ':pseudo-class[attribute]'],
      ['[attribute]', '&::pseudo-element', '[attribute]::pseudo-element'],
      ['[attribute]', '::pseudo-element&', '::pseudo-element[attribute]'],
      ['[attribute]', '&:pseudo-fn()', '[attribute]:pseudo-fn()'],
      ['[attribute]', ':pseudo-fn()&', ':pseudo-fn()[attribute]'],
      ['[attribute]', '&[attribute]', '[attribute][attribute]'],
      ['[attribute]', '[attribute]&', '[attribute][attribute]'],
      ['[attribute]', '&*', '*[attribute]'],
      ['[attribute]', '*&', '*[attribute]'],

      ['*', '&element', 'element:is(*)'],
      ['*', 'element&', 'element:is(*)'],
      ['*', '&.class', '*.class'],
      ['*', '.class&', '*.class'],
      ['*', '&#id', '*#id'],
      ['*', '#id&', '*#id'],
      ['*', '&:pseudo-class', '*:pseudo-class'],
      ['*', ':pseudo-class&', '*:pseudo-class'],
      ['*', '&::pseudo-element', '*::pseudo-element'],
      ['*', '::pseudo-element&', '*::pseudo-element'],
      ['*', '&:pseudo-fn()', '*:pseudo-fn()'],
      ['*', ':pseudo-fn()&', '*:pseudo-fn()'],
      ['*', '&[attribute]', '*[attribute]'],
      ['*', '[attribute]&', '*[attribute]'],
      ['*', '&*', '*:is(*)'],
      ['*', '*&', '*:is(*)'],

      ['&', '&element', 'element:scope'],
      ['&', 'element&', 'element:scope'],
      ['&', '&.class', ':scope.class'],
      ['&', '.class&', '.class:scope'],
      ['&', '&#id', ':scope#id'],
      ['&', '#id&', '#id:scope'],
      ['&', '&:pseudo-class', ':scope:pseudo-class'],
      ['&', ':pseudo-class&', ':pseudo-class:scope'],
      ['&', '&::pseudo-element', ':scope::pseudo-element'],
      ['&', '::pseudo-element&', '::pseudo-element:scope'],
      ['&', '&:pseudo-fn()', ':scope:pseudo-fn()'],
      ['&', ':pseudo-fn()&', ':pseudo-fn():scope'],
      ['&', '&[attribute]', ':scope[attribute]'],
      ['&', '[attribute]&', '[attribute]:scope'],
      ['&', '&*', '*:scope'],
      ['&', '*&', '*:scope'],
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
        }
        :is(.a, .b) + .c {
          --x: 2;
        }
        :is(.a, .b).d {
          --x: 3;
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
        }
        .c :is(.a, .b) {
          --x: 2;
        }
        :is(.c :is(.a, .b)):hover, :is(.c :is(.a, .b)):focus {
          --x: 3;
        }
        :is(:is(.c :is(.a, .b)):hover, :is(.c :is(.a, .b)):focus) .d {
          --x: 4;
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
        }
        .a:hover {
          --inside: 1;
        }
        .a {
          --after: 1;
        }
        "
      `)
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
  })
})

// A simple step-by-step but slow implementation of CSS nesting used as an
// oracle to test faster and more efficient solutions against.
export function handleNestingOracle(ast: AstNode[]): AstNode[] {
  // Remove empty nodes
  //
  // Inside-out such that a node containing another node that is empty, also gets
  // cleaned up when walking up the tree.
  //
  // For at-rules, we only want to get rid of at-rules like `@supports` and
  // `@media` that we know are safe to remove when they are empty.
  //
  // Known at-rules that are not safe to delete: `@charset`, `@layer`,
  // `@namespace`, `@custom-media`, `@apply`, …
  //
  // ```css
  // .foo {}
  // @media (min-width: 123px) {
  //   .bar {}
  // }
  // @layer base;
  // ```
  //
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //
  // ```css
  // @layer base;
  // ```
  {
    walk(ast, {
      exit(node) {
        if (!('nodes' in node)) return
        if (node.nodes.length > 0) return
        if (node.kind === 'at-rule' && !DROPPABLE_IF_EMPTY_AT_RULES.has(node.name)) return

        return WalkAction.ReplaceSkip([])
      },
    })
  }

  // A rule with an `&` selector should be converted to a `:scope` if that rule
  // has no parent rule. Parent at-rules don't count since they don't contain
  // selectors.
  //
  // ```css
  // & {
  //   color: red;
  // }
  // :is(&) {
  //   color: blue;
  // }
  // ```
  //
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //
  // ```css
  // :scope {
  //   color: red;
  // }
  // :scope {
  //   color: blue;
  // }
  // ```
  {
    walk(ast, (node) => {
      if (node.kind !== 'rule') return

      let ast = SelectorParser.parse(node.selector)

      walk(ast, (node) => {
        // Nested in `:is(…)`, unwrap
        while (node.kind === 'function' && node.value === ':is' && node.nodes.length === 1) {
          node = node.nodes[0]
        }

        // Just `&`, replace with `:scope`
        if (node.kind === 'selector' && node.value === '&') {
          return WalkAction.ReplaceSkip(SelectorParser.selector(':scope'))
        }
      })

      node.selector = SelectorParser.toCss(ast)

      return WalkAction.Skip
    })
  }

  // Remove intermediate nodes with an `&` selector, or `&` nested inside
  // `:is(…)` n-levels deep, and replace them by its `nodes`.
  //
  // ```css
  // .foo {
  //   & {
  //     color: red;
  //   }
  //   :is(&) {
  //     color: green;
  //   }
  //   :is(:is(&)) {
  //     color: blue;
  //     & {
  //       color: black
  //     }
  //   }
  // }
  // ```
  //
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //
  // ```css
  // .foo {
  //   color: red;
  //   color: green;
  //   color: blue;
  //   color: black;
  // }
  // ```
  {
    walk(ast, (node) => {
      if (node.kind !== 'rule') return

      let ast = SelectorParser.parse(node.selector)

      while (
        ast.length === 1 &&
        ast[0].kind === 'function' &&
        ast[0].value === ':is' &&
        ast[0].nodes.length === 1
      ) {
        ast = ast[0].nodes
      }

      // Just `&`, replace by its `nodes`
      if (ast.length === 1 && ast[0].kind === 'selector' && ast[0].value === '&') {
        return WalkAction.Replace(node.nodes)
      }
    })
  }

  // Split into groups, this allows us to reduce the problem space, and only
  // have to think about linear nesting because there will only ever be a single
  // rule or at-rule at each level.
  //
  // ```css
  // .foo {
  //   --x: 1;
  //   .bar {
  //     --x: 2;
  //   }
  //   --x: 3;
  // }
  // ```
  //
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //
  // ```css
  // .foo {
  //   --x: 1;
  // }
  // .foo {
  //   .bar {
  //     --x: 2;
  //   }
  // }
  // .foo {
  //   --x: 3;
  // }
  // ```
  {
    walk(ast, {
      exit(node) {
        if (!('nodes' in node)) return

        let last: AstNode | null = null
        let groups: AstNode[][] = []
        for (let child of node.nodes) {
          if (last === null || 'nodes' in child) {
            groups.push([child])
          } else {
            if ('nodes' in last) {
              groups.push([child])
            } else {
              groups[groups.length - 1].push(child)
            }
          }
          last = child
        }

        if (groups.length <= 1) {
          return
        }

        node.nodes = []
        return WalkAction.Replace(
          groups.map((nodes) => Object.assign(cloneAstNode(node), { nodes })),
        )
      },
    })
  }

  // Hoist at-rules to the top in the order they were seen in
  //
  // ```css
  // .foo {
  //   @media (print) {
  //     @supports (display: grid) {
  //       color: red;
  //     }
  //   }
  // }
  // ```
  //
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //
  // ```css
  // @media (print) {
  //   @supports (display: grid) {
  //     .foo {
  //       color: red;
  //     }
  //   }
  // }
  // ```
  {
    for (let [idx, node] of ast.entries()) {
      if (!('nodes' in node)) continue

      let nodes: AstNode[] = [node]
      let atRules: [
        name: string,
        params: string,
        src: SourceLocation | undefined,
        dst: SourceLocation | undefined,
      ][] = []
      walk(nodes, (node) => {
        if (node.kind !== 'at-rule') return
        if (node.nodes.length <= 0) return
        if (!HOISTABLE_AT_RULES.has(node.name)) return

        // Track the at-rule
        atRules.unshift([node.name, node.params, node.src, node.dst])

        // Replace the at-rule by its nodes
        return WalkAction.Replace(node.nodes)
      })

      // No at-rules found
      if (atRules.length <= 0) continue

      // Wrap `node` in the at-rules
      {
        let root: AstNode | null = null
        for (let [name, params, src, dst] of atRules) {
          root = atRule(name, params, root ? [root] : nodes)
          if (src || dst) Object.assign(root, { src, dst })
        }
        if (root) ast[idx] = root
      }
    }
  }

  // Insert explicit `&`, when one was not used
  //
  // ```css
  // .foo {
  //   .a, .b:is(&) {
  //     --x: 1;
  //   }
  // }
  // ```
  //
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //
  // ```css
  // .foo {
  //   & .a, .b:is(&) {
  //     --x: 1;
  //   }
  // }
  // ```
  {
    walk(ast, (node, ctx) => {
      if (node.kind !== 'rule') return
      if (!ctx.path().some((node) => node.kind === 'rule')) return // Only inject `&` when it's not the first rule

      node.selector = segment(node.selector, ',')
        .map((selector) => {
          selector = selector.trim()

          let hasAmpersand = false
          walk(SelectorParser.parse(selector.trim()), (node) => {
            if (node.kind === 'selector' && node.value === '&') {
              hasAmpersand = true
              return WalkAction.Stop
            }
          })

          return hasAmpersand ? selector : `& ${selector}`
        })
        .join(', ')
    })
  }

  // Flatten selectors with `:is(…)` semantics
  //
  // ```css
  // .foo, .bar {
  //   &:hover {
  //     --x: 1;
  //   }
  // }
  // ```
  //
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //
  // ```css
  // :is(.foo, .bar):hover {
  //   --x: 1;
  // }
  // ```
  {
    walk(ast, {
      exit(node, ctx) {
        if (node.kind !== 'rule') return
        if (ctx.parent?.kind !== 'rule') return

        let parentAst = SelectorParser.parse(`:is(${ctx.parent.selector})`)

        // Wrap parent selector in `:is(…)`
        let ast = SelectorParser.parse(node.selector)
        walk(ast, (node) => {
          if (node.kind === 'selector' && node.value === '&') {
            return WalkAction.ReplaceSkip(parentAst.map(SelectorParser.cloneAstNode))
          }
        })
        ctx.parent.selector = SelectorParser.toCss(ast)

        // Override the parent's nodes with our nodes now that we merged the
        // selectors together.
        ctx.parent.nodes = node.nodes
      },
    })
  }

  // Optimize the selector by unwrapping unnecessary `:is(…)`
  //
  // ```css
  // .a:is(.b) {
  //   color: red;
  // }
  // ```
  //
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //
  // ```css
  // .a.b {
  //   color: red;
  // }
  // ```
  {
    walk(ast, (node) => {
      if (node.kind !== 'rule') return
      node.selector = optimizeSelector(node.selector)
    })
  }

  // Merge adjacent at-rules
  //
  // ```css
  // @media (print) {
  //   .a, .b {
  //     --x: 1;
  //   }
  // }
  //
  // @media (print) {
  //   @media (min-width: 123px) {
  //     :is(.a, .b) .c {
  //       --x: 2;
  //     }
  //   }
  // }
  // ```
  //
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //
  // ```css
  // @media (print) {
  //   .a, .b {
  //     --x: 1;
  //   }
  //
  //   @media (min-width: 123px) {
  //     :is(.a, .b) .c {
  //       --x: 2;
  //     }
  //   }
  // }
  // ```
  {
    walk(ast, {
      enter(node, ctx) {
        if (node.kind !== 'at-rule') return

        let next = ctx.siblings[ctx.index + 1]

        if (!next) return
        if (next.kind !== 'at-rule') return
        if (next.name !== node.name) return
        if (next.params !== node.params) return

        // Move our nodes over
        next.nodes = node.nodes.concat(next.nodes)

        // We merge everything into the last at-rule, but from a CSS perspective
        // this should look as-if we merged it into the first one.
        next.src = node.src
        next.dst = node.dst

        return WalkAction.Replace([])
      },
    })
  }

  // Merge adjacent rules with the same selector
  //
  // ```css
  // .a {
  //   --x: 1;
  // }
  // .a {
  //   --y: 1;
  // }
  // ```
  //
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //
  // ```css
  // .a {
  //   --x: 1;
  //   --y: 1;
  // }
  // ```
  {
    walk(ast, {
      enter(node, ctx) {
        if (node.kind !== 'rule') return

        let next = ctx.siblings[ctx.index + 1]

        if (!next) return
        if (next.kind !== 'rule') return
        if (next.selector !== node.selector) return

        // Move our nodes over
        next.nodes = node.nodes.concat(next.nodes)

        // We merge everything into the last at-rule, but from a CSS perspective
        // this should look as-if we merged it into the first one.
        next.src = node.src
        next.dst = node.dst

        return WalkAction.Replace([])
      },
    })
  }

  // Remove declarations that occur later with the same property / value /
  // important information. A potential future improvement could be getting rid
  // of overrides, but often a fallback value is used this way.
  //
  // ```css
  // .foo {
  //   --x: 1;
  //   --x: 2;
  //   --x: 1;
  // }
  // ```
  //
  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //
  // ```css
  // .foo {
  //   --x: 2;
  //   --x: 1;
  // }
  // ```
  {
    walk(ast, (node, ctx) => {
      if (node.kind !== 'declaration') return

      for (let i = ctx.index + 1; i < ctx.siblings.length; i++) {
        let next = ctx.siblings[i]
        if (
          next.kind === 'declaration' &&
          next.property === node.property &&
          next.value === node.value &&
          next.important === node.important
        ) {
          return WalkAction.Replace([])
        }
      }
    })
  }

  return ast
}
