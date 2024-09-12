import dedent from 'dedent'
import { expect, it } from 'vitest'
import { toCss } from '../../ast'
import * as CSS from '../../css-parser'
import { migrateAtLayerUtilities } from './migrate-at-layer-utilities'

const css = dedent

function migrate(input: string) {
  let ast = CSS.parse(input)
  migrateAtLayerUtilities(ast)
  return toCss(ast).trim()
}

it('should migrate simple `@layer utilities` to `@utility`', () => {
  expect(
    migrate(css`
      @layer utilities {
        .foo {
          color: red;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      color: red;
    }"
  `)
})

it('should migrate simple `@layer utilities` with nesting to `@utility`', () => {
  expect(
    migrate(css`
      @layer utilities {
        .foo {
          color: red;

          &:hover {
            color: blue;
          }

          &:focus {
            color: green;
          }
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      color: red;
      &:hover {
        color: blue;
      }
      &:focus {
        color: green;
      }
    }"
  `)
})

it('should migrate multiple simple `@layer utilities` to `@utility`', () => {
  expect(
    migrate(css`
      @layer utilities {
        .foo {
          color: red;
        }

        .bar {
          color: blue;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      color: red;
    }
    @utility bar {
      color: blue;
    }"
  `)
})

it('should invert at-rules to make them migrate-able', () => {
  expect(
    migrate(css`
      @layer utilities {
        @media (min-width: 640px) {
          .foo {
            color: red;
          }
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      @media (min-width: 640px) {
        color: red;
      }
    }"
  `)
})

it('should migrate at-rules with multiple utilities and invert them', () => {
  expect(
    migrate(css`
      @layer utilities {
        @media (min-width: 640px) {
          .foo {
            color: red;
          }

          .bar {
            color: blue;
          }
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      @media (min-width: 640px) {
        color: red;
      }
    }
    @utility bar {
      @media (min-width: 640px) {
        color: blue;
      }
    }"
  `)
})

it.skip('should migrate deeply nested at-rules with multiple utilities and invert them', () => {
  expect(
    migrate(css`
      @layer utilities {
        @media (min-width: 640px) {
          .foo {
            color: red;
          }

          .bar {
            color: blue;
          }

          @media (min-width: 1024px) {
            .baz {
              color: green;
            }

            @media (min-width: 1280px) {
              .qux {
                color: yellow;
              }
            }
          }
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      @media (min-width: 640px) {
        color: red;
      }
    }
    @utility bar {
      @media (min-width: 640px) {
        color: blue;
      }
    }
    @utility baz {
      @media (min-width: 1024px) {
        @media (min-width: 640px) {
          color: green;
        }
      }
    }
    "
  `)
})

it('should migrate classes with pseudo elements', () => {
  expect(
    migrate(css`
      @layer utilities {
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility no-scrollbar {
      &::-webkit-scrollbar {
        display: none;
      }
    }"
  `)
})

it.skip('should migrate classes with attribute selectors', () => {
  expect(
    migrate(css`
      @layer utilities {
        .no-scrollbar[data-checked=''] {
          display: none;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility no-scrollbar {
      &[data-checked=''] {
        display: none;
      }
    }"
  `)
})

it.skip('should migrate classes with element selectors', () => {
  expect(
    migrate(css`
      @layer utilities {
        .no-scrollbar main {
          display: none;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility no-scrollbar {
      & main {
        display: none;
      }
    }"
  `)
})

it.skip('should migrate classes with id selectors', () => {
  expect(
    migrate(css`
      @layer utilities {
        .no-scrollbar#main {
          display: none;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility no-scrollbar {
      &#main {
        display: none;
      }
    }"
  `)
})

it.skip('should migrate classes with another attached class', () => {
  expect(
    migrate(css`
      @layer utilities {
        .no-scrollbar.main {
          display: none;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility no-scrollbar {
      &.main {
        display: none;
      }
    }"
  `)
})

it('should migrate a selector with multiple classes to multiple @utility definitions', () => {
  expect(
    migrate(css`
      @layer utilities {
        .foo .bar:hover .baz:focus {
          display: none;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      & .bar:hover .baz:focus {
        display: none;
      }
    }
    @utility bar {
      .foo &:hover .baz:focus {
        display: none;
      }
    }
    @utility baz {
      .foo .bar:hover &:focus {
        display: none;
      }
    }"
  `)
})

it('should merge `@utility` definitions with the same name', () => {
  expect(
    migrate(css`
      @layer utilities {
        .step {
          counter-increment: step;
        }

        .step:before {
          @apply absolute w-7 h-7 bg-default-100 rounded-full font-medium text-center text-base inline-flex items-center justify-center -indent-px;
          @apply ml-[-41px];
          content: counter(step);
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility step {
      counter-increment: step;
      &:before {
        @apply absolute w-7 h-7 bg-default-100 rounded-full font-medium text-center text-base inline-flex items-center justify-center -indent-px;
        @apply ml-[-41px];
        content: counter(step);
      }
    }"
  `)
})

it('should not migrate nested classes inside a selector (e.g.: `:has(…)`)', () => {
  expect(
    migrate(css`
      @layer utilities {
        .foo .bar:has(.baz) {
          display: none;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      & .bar:has(.baz) {
        display: none;
      }
    }
    @utility bar {
      .foo &:has(.baz) {
        display: none;
      }
    }"
  `)
})
