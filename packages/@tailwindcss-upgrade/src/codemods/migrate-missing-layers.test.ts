import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { formatNodes } from './format-nodes'
import { migrateMissingLayers } from './migrate-missing-layers'
import { sortBuckets } from './sort-buckets'

const css = dedent

function migrate(input: string) {
  return postcss()
    .use(migrateMissingLayers())
    .use(sortBuckets())
    .use(formatNodes())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it('should not migrate already migrated `@import` at-rules', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss';
    `),
  ).toMatchInlineSnapshot(`"@import 'tailwindcss';"`)
})

it('should add missing `layer(…)` to imported files', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/utilities'; /* Expected no layer */
      @import './foo.css'; /* Expected layer(utilities) */
      @import './bar.css'; /* Expected layer(utilities) */
      @import 'tailwindcss/components'; /* Expected no layer */
    `),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss/utilities'; /* Expected no layer */
    @import './foo.css' layer(utilities); /* Expected layer(utilities) */
    @import './bar.css' layer(utilities); /* Expected layer(utilities) */
    @import 'tailwindcss/components'; /* Expected no layer */"
  `)
})

it('should add missing `layer(…)` as the first param after the import itself', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/utilities' supports(--foo); /* Expected no layer */
      @import './foo.css' supports(--foo); /* Expected layer(utilities) supports(--foo) */
      @import './bar.css' supports(--foo); /* Expected layer(utilities) supports(--foo) */
      @import 'tailwindcss/components' supports(--foo); /* Expected no layer */
    `),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss/utilities' supports(--foo); /* Expected no layer */
    @import './foo.css' layer(utilities) supports(--foo); /* Expected layer(utilities) supports(--foo) */
    @import './bar.css' layer(utilities) supports(--foo); /* Expected layer(utilities) supports(--foo) */
    @import 'tailwindcss/components' supports(--foo); /* Expected no layer */"
  `)
})

it('should not migrate anything if no `@tailwind` directives (or imports) are found', async () => {
  expect(
    await migrate(css`
      /* Base */
      html {
        color: red;
      }

      /* Utilities */
      .foo {
        color: blue;
      }
    `),
  ).toMatchInlineSnapshot(`
    "/* Base */
    html {
      color: red;
    }

    /* Utilities */
    .foo {
      color: blue;
    }"
  `)
})

it('should not wrap comments in a layer, if they are the only nodes', async () => {
  expect(
    await migrate(css`
      @tailwind base;

      /* BASE */

      @tailwind components;

      /* COMPONENTS */

      @tailwind utilities;

      /** UTILITIES */
      /** - Another comment */
    `),
  ).toMatchInlineSnapshot(`
    "@tailwind base;

    /* BASE */

    @tailwind components;

    /* COMPONENTS */

    @tailwind utilities;

    /** UTILITIES */
    /** - Another comment */"
  `)
})

it('should migrate rules above the `@tailwind base` directive in an `@layer base`', async () => {
  expect(
    await migrate(css`
      @charset "UTF-8";
      @layer foo, bar, baz;

      /**! 
       * License header
       */

      html {
        color: red;
      }

      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `),
  ).toMatchInlineSnapshot(`
    "@charset "UTF-8";
    @layer foo, bar, baz;

    /**! 
     * License header
     */

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer base {
      html {
        color: red;
      }
    }"
  `)
})

it('should migrate rules between tailwind directives', async () => {
  expect(
    await migrate(css`
      @tailwind base;

      .base {
      }

      @tailwind components;

      .component-a {
      }
      .component-b {
      }

      @tailwind utilities;

      .utility-a {
      }
      .utility-b {
      }
    `),
  ).toMatchInlineSnapshot(`
    "@tailwind base;

    @tailwind components;

    @tailwind utilities;

    @layer base {
      .base {
      }
    }

    @layer components {
      .component-a {
      }
      .component-b {
      }
    }

    .utility-a {
    }
    .utility-b {
    }"
  `)
})

it('should keep CSS above a layer unlayered', async () => {
  expect(
    await migrate(css`
      .foo {
        color: red;
      }

      @layer components {
        .bar {
          color: blue;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    ".foo {
      color: red;
    }

    @layer components {
      .bar {
        color: blue;
      }
    }"
  `)
})
