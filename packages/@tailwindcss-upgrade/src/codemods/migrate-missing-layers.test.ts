import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { formatNodes } from './format-nodes'
import { migrateMissingLayers } from './migrate-missing-layers'

const css = dedent

function migrate(input: string) {
  return postcss()
    .use(migrateMissingLayers())
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

    @layer base {
      .base {
      }
    }

    @tailwind components;

    @layer components {
      .component-a {
      }
      .component-b {
      }
    }

    @tailwind utilities;

    .utility-a {
    }
    .utility-b {
    }"
  `)
})
