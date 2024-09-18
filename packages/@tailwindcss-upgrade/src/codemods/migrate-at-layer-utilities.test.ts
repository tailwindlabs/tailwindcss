import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { migrateAtLayerUtilities } from './migrate-at-layer-utilities'

const css = dedent

function migrate(input: string) {
  return postcss()
    .use(migrateAtLayerUtilities())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it('should migrate simple `@layer utilities` to `@utility`', async () => {
  expect(
    await migrate(css`
      @layer utilities {
        .foo {
          color: red;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      color: red;
    }
    "
  `)
})

it('should migrate simple `@layer utilities` with nesting to `@utility`', async () => {
  expect(
    await migrate(css`
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
    }
    "
  `)
})

it('should migrate multiple simple `@layer utilities` to `@utility`', async () => {
  expect(
    await migrate(css`
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
    }
    "
  `)
})

it('should not migrate Rules inside of Rules to a `@utility`', async () => {
  expect(
    await migrate(css`
      @layer utilities {
        .foo {
          color: red;
        }

        .bar {
          color: blue;

          .baz {
            color: green;
          }
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      color: red;
    }
    @utility bar {
      color: blue;

      .baz {
        color: green;
      }
    }
    "
  `)
})

it('should invert at-rules to make them migrate-able', async () => {
  expect(
    await migrate(css`
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
    }
    "
  `)
})

it('should migrate at-rules with multiple utilities and invert them', async () => {
  expect(
    await migrate(css`
      @layer utilities {
        @media (min-width: 640px) {
          .foo {
            color: red;
          }
        }
      }

      @layer utilities {
        @media (min-width: 640px) {
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
    }
    "
  `)
})

it('should migrate deeply nested at-rules with multiple utilities and invert them', async () => {
  expect(
    await migrate(css`
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
      @media (min-width: 640px) {
        @media (min-width: 1024px) {
          color: green;
        }
      }
    }
    @utility qux {
      @media (min-width: 640px) {
        @media (min-width: 1024px) {
          @media (min-width: 1280px) {
            color: yellow;
          }
        }
      }
    }
    "
  `)
})

it('should migrate classes with pseudo elements', async () => {
  expect(
    await migrate(css`
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
    }
    "
  `)
})

it('should migrate classes with attribute selectors', async () => {
  expect(
    await migrate(css`
      @layer utilities {
        .no-scrollbar[data-checked=''] {
          display: none;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility no-scrollbar {
      &[data-checked=""] {
        display: none;
      }
    }
    "
  `)
})

it('should migrate classes with element selectors', async () => {
  expect(
    await migrate(css`
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
    }
    "
  `)
})

it('should migrate classes attached to an element selector', async () => {
  expect(
    await migrate(css`
      @layer utilities {
        main.no-scrollbar {
          display: none;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility no-scrollbar {
      &main {
        display: none;
      }
    }
    "
  `)
})

it('should migrate classes with id selectors', async () => {
  expect(
    await migrate(css`
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
    }
    "
  `)
})

it('should migrate classes with another attached class', async () => {
  expect(
    await migrate(css`
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
    }
    @utility main {
      &.no-scrollbar {
        display: none;
      }
    }
    "
  `)
})

it('should migrate a selector with multiple classes to multiple @utility definitions', async () => {
  expect(
    await migrate(css`
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
    }
    "
  `)
})

it('should merge `@utility` definitions with the same name', async () => {
  expect(
    await migrate(css`
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
    }

    "
  `)
})

it('should not migrate nested classes inside a `:not(…)`', async () => {
  expect(
    await migrate(css`
      @layer utilities {
        .foo .bar:not(.qux):has(.baz) {
          display: none;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      & .bar:not(.qux):has(.baz) {
        display: none;
      }
    }
    @utility bar {
      .foo &:not(.qux):has(.baz) {
        display: none;
      }
    }
    @utility baz {
      .foo .bar:not(.qux):has(&) {
        display: none;
      }
    }
    "
  `)
})

it('should migrate advanced combinations', async () => {
  expect(
    await migrate(css`
      @layer utilities {
        @media (width >= 100px) {
          @supports (display: none) {
            .foo .bar:not(.qux):has(.baz) {
              display: none;
            }
          }

          .bar {
            color: red;
          }
        }

        @media (width >= 200px) {
          .foo {
            &:hover {
              @apply bg-red-500;

              .bar {
                color: red;
              }
            }
          }
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      @media (width >= 100px) {
        @supports (display: none) {
          & .bar:not(.qux):has(.baz) {
            display: none;
          }
        }
      }
      @media (width >= 200px) {
        &:hover {
          @apply bg-red-500;

          .bar {
            color: red;
          }
        }
      }
    }
    @utility bar {
      @media (width >= 100px) {
        @supports (display: none) {
          .foo &:not(.qux):has(.baz) {
            display: none;
          }
        }
      }
      @media (width >= 100px) {
        color: red;
      }
    }
    @utility baz {
      @media (width >= 100px) {
        @supports (display: none) {
          .foo .bar:not(.qux):has(&) {
            display: none;
          }
        }
      }
    }


    "
  `)
})
