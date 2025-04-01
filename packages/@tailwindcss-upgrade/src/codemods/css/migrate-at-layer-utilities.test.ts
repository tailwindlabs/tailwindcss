import dedent from 'dedent'
import postcss from 'postcss'
import { describe, expect, it } from 'vitest'
import { Stylesheet } from '../../stylesheet'
import { formatNodes } from './format-nodes'
import { migrateAtLayerUtilities } from './migrate-at-layer-utilities'
import { sortBuckets } from './sort-buckets'

const css = dedent

async function migrate(
  data:
    | string
    | {
        root: postcss.Root
        layers?: string[]
      },
) {
  let stylesheet: Stylesheet

  if (typeof data === 'string') {
    stylesheet = await Stylesheet.fromString(data)
  } else {
    stylesheet = await Stylesheet.fromRoot(data.root)

    if (data.layers) {
      let meta = { layers: data.layers }
      let parent = await Stylesheet.fromString('.placeholder {}')

      stylesheet.parents.add({ item: parent, meta })
      parent.children.add({ item: stylesheet, meta })
    }
  }

  return postcss()
    .use(migrateAtLayerUtilities(stylesheet))
    .use(sortBuckets())
    .use(formatNodes())
    .process(stylesheet.root!, { from: expect.getState().testPath })
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
    }"
  `)
})

it('should split multiple selectors in separate utilities', async () => {
  expect(
    await migrate(css`
      @layer utilities {
        .foo,
        .bar {
          color: red;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      color: red;
    }

    @utility bar {
      color: red;
    }"
  `)
})

it('should merge `@utility` with the same name', async () => {
  expect(
    await migrate(css`
      @layer utilities {
        .foo {
          color: red;
        }
      }

      .bar {
        color: blue;
      }

      @layer utilities {
        .foo {
          font-weight: bold;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      color: red;
      font-weight: bold;
    }

    .bar {
      color: blue;
    }"
  `)
})

it('should leave non-class utilities alone', async () => {
  expect(
    await migrate(css`
      @layer utilities {
        /* 1. */
        #before {
          /* 1.1. */
          color: red;
          /* 1.2. */
          .bar {
            /* 1.2.1. */
            font-weight: bold;
          }
        }

        /* 2. */
        .foo {
          /* 2.1. */
          color: red;
          /* 2.2. */
          .bar {
            /* 2.2.1. */
            font-weight: bold;
          }
        }

        /* 3. */
        #after {
          /* 3.1. */
          color: blue;
          /* 3.2. */
          .bar {
            /* 3.2.1. */
            font-weight: bold;
          }
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@utility foo {
      /* 2. */
      /* 2.1. */
      color: red;
      /* 2.2. */
      .bar {
        /* 2.2.1. */
        font-weight: bold;
      }
    }

    @layer utilities {
      /* 1. */
      #before {
        /* 1.1. */
        color: red;
        /* 1.2. */
        .bar {
          /* 1.2.1. */
          font-weight: bold;
        }
      }

      /* 3. */
      #after {
        /* 3.1. */
        color: blue;
        /* 3.2. */
        .bar {
          /* 3.2.1. */
          font-weight: bold;
        }
      }
    }"
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
    }"
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
    }"
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
    }"
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
    }"
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
    }"
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
    }"
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
    }"
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
      &[data-checked=''] {
        display: none;
      }
    }"
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
    }"
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
    }"
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
    }"
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
    }"
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
    }"
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
    }"
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
    }"
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
    }"
  `)
})

describe('comments', () => {
  it('should preserve comment location for a simple utility', async () => {
    expect(
      await migrate(css`
        /* Start of utilities: */
        @layer utilities {
          /* Utility #1 */
          .foo {
            /* Declarations: */
            color: red;
          }
        }
      `),
    ).toMatchInlineSnapshot(`
      "/* Start of utilities: */
      @utility foo {
        /* Utility #1 */
        /* Declarations: */
        color: red;
      }"
    `)
  })

  it('should copy comments when creating multiple utilities from a single selector', async () => {
    expect(
      await migrate(css`
        /* Start of utilities: */
        @layer utilities {
          /* Foo & Bar */
          .foo .bar {
            /* Declarations: */
            color: red;
          }
        }
      `),
    ).toMatchInlineSnapshot(`
      "/* Start of utilities: */
      @utility foo {
        /* Foo & Bar */
        & .bar {
          /* Declarations: */
          color: red;
        }
      }
      @utility bar {
        /* Foo & Bar */
        .foo & {
          /* Declarations: */
          color: red;
        }
      }"
    `)
  })

  it('should preserve comments for utilities wrapped in at-rules', async () => {
    expect(
      await migrate(css`
        /* Start of utilities: */
        @layer utilities {
          /* Mobile only */
          @media (width <= 640px) {
            /* Utility #1 */
            .foo {
              /* Declarations: */
              color: red;
            }
          }
        }
      `),
    ).toMatchInlineSnapshot(`
      "/* Start of utilities: */
      @utility foo {
        /* Mobile only */
        @media (width <= 640px) {
          /* Utility #1 */
          /* Declarations: */
          color: red;
        }
      }"
    `)
  })

  it('should preserve comment locations as best as possible', async () => {
    expect(
      await migrate(css`
        /* Above */
        .before {
          /* Inside */
        }
        /* After */

        /* Tailwind Utilities: */
        @layer utilities {
          /* Chrome, Safari and Opera */
          /* Second comment */
          @media (min-width: 640px) {
            /* Foobar */
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          }

          /* Firefox, IE and Edge */
          /* Second comment */
          .no-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        }

        /* Above */
        .after {
          /* Inside */
        }
        /* After */
      `),
    ).toMatchInlineSnapshot(`
      "/* Tailwind Utilities: */
      @utility no-scrollbar {
        /* Chrome, Safari and Opera */
        /* Second comment */
        @media (min-width: 640px) {
          /* Foobar */
          &::-webkit-scrollbar {
            display: none;
          }
        }

        /* Firefox, IE and Edge */
        /* Second comment */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }

      /* Above */
      .before {
        /* Inside */
      }
      /* After */

      /* Above */
      .after {
        /* Inside */
      }
      /* After */"
    `)
  })
})

// Saw this when testing codemods on https://github.com/docker/docs
it('should not lose attribute selectors', async () => {
  expect(
    await migrate(css`
      @layer components {
        #TableOfContents {
          .toc a {
            @apply block max-w-full truncate py-1 pl-2 hover:font-medium hover:no-underline;
            &[aria-current='true'],
            &:hover {
              @apply border-l-2 border-l-gray-light bg-gradient-to-r from-gray-light-100 font-medium text-black dark:border-l-gray-dark dark:from-gray-dark-200 dark:text-white;
            }
            &:not([aria-current='true']) {
              @apply text-gray-light-600 hover:text-black dark:text-gray-dark-700 dark:hover:text-white;
            }
          }
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@layer components {
      #TableOfContents {
        .toc a {
          @apply block max-w-full truncate py-1 pl-2 hover:font-medium hover:no-underline;
          &[aria-current='true'],
          &:hover {
            @apply border-l-2 border-l-gray-light bg-gradient-to-r from-gray-light-100 font-medium text-black dark:border-l-gray-dark dark:from-gray-dark-200 dark:text-white;
          }
          &:not([aria-current='true']) {
            @apply text-gray-light-600 hover:text-black dark:text-gray-dark-700 dark:hover:text-white;
          }
        }
      }
    }"
  `)
})

describe('layered stylesheets', () => {
  it('should transform classes to utilities inside a layered stylesheet (utilities)', async () => {
    expect(
      await migrate({
        root: postcss.parse(css`
          /* Utility #1 */
          .foo {
            /* Declarations: */
            color: red;
          }
        `),
        layers: ['utilities'],
      }),
    ).toMatchInlineSnapshot(`
      "@utility foo {
        /* Utility #1 */
        /* Declarations: */
        color: red;
      }"
    `)
  })

  it('should transform classes to utilities inside a layered stylesheet (components)', async () => {
    expect(
      await migrate({
        root: postcss.parse(css`
          /* Utility #1 */
          .foo {
            /* Declarations: */
            color: red;
          }
        `),
        layers: ['components'],
      }),
    ).toMatchInlineSnapshot(`
      "@utility foo {
        /* Utility #1 */
        /* Declarations: */
        color: red;
      }"
    `)
  })

  it('should NOT transform classes to utilities inside a non-utility, layered stylesheet', async () => {
    expect(
      await migrate({
        root: postcss.parse(css`
          /* Utility #1 */
          .foo {
            /* Declarations: */
            color: red;
          }
        `),
        layers: ['foo'],
      }),
    ).toMatchInlineSnapshot(`
      "/* Utility #1 */
      .foo {
        /* Declarations: */
        color: red;
      }"
    `)
  })

  it('should handle non-classes in utility-layered stylesheets', async () => {
    expect(
      await migrate({
        root: postcss.parse(css`
          /* Utility #1 */
          .foo {
            /* Declarations: */
            color: red;
          }
          #main {
            color: red;
          }
        `),
        layers: ['utilities'],
      }),
    ).toMatchInlineSnapshot(`
      "@utility foo {
        /* Utility #1 */
        /* Declarations: */
        color: red;
      }

      #main {
        color: red;
      }"
    `)
  })

  it('should handle non-classes in utility-layered stylesheets', async () => {
    expect(
      await migrate({
        root: postcss.parse(css`
          @layer utilities {
            @layer utilities {
              /* Utility #1 */
              .foo {
                /* Declarations: */
                color: red;
              }
            }

            /* Utility #2 */
            .bar {
              /* Declarations: */
              color: red;
            }

            #main {
              color: red;
            }
          }

          /* Utility #3 */
          .baz {
            /* Declarations: */
            color: red;
          }

          #secondary {
            color: red;
          }
        `),
        layers: ['utilities'],
      }),
    ).toMatchInlineSnapshot(`
      "@utility foo {
        @layer utilities {
          @layer utilities {
            /* Utility #1 */
            /* Declarations: */
            color: red;
          }
        }
      }

      @utility bar {
        @layer utilities {
          /* Utility #2 */
          /* Declarations: */
          color: red;
        }
      }

      @utility baz {
        /* Utility #3 */
        /* Declarations: */
        color: red;
      }

      @layer utilities {

        #main {
          color: red;
        }
      }

      #secondary {
        color: red;
      }"
    `)
  })

  it('imports are preserved in layered stylesheets', async () => {
    expect(
      await migrate({
        root: postcss.parse(css`
          @import 'thing';

          .foo {
            color: red;
          }
        `),
        layers: ['utilities'],
      }),
    ).toMatchInlineSnapshot(`
      "@import 'thing';

      @utility foo {
        color: red;
      }"
    `)
  })

  it('charset is preserved in layered stylesheets', async () => {
    expect(
      await migrate({
        root: postcss.parse(css`
          @charset "utf-8";

          .foo {
            color: red;
          }
        `),
        layers: ['utilities'],
      }),
    ).toMatchInlineSnapshot(`
      "@charset "utf-8";

      @utility foo {
        color: red;
      }"
    `)
  })
})
