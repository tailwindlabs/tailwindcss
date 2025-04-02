import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { formatNodes } from './format-nodes'
import { migratePreflight } from './migrate-preflight'
import { sortBuckets } from './sort-buckets'

const css = dedent

async function migrate(input: string) {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @import 'tailwindcss';
    `,
    { base: __dirname },
  )

  return postcss()
    .use(migratePreflight({ designSystem }))
    .use(sortBuckets())
    .use(formatNodes())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it("should add compatibility CSS after the `@import 'tailwindcss'`", async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss';
    `),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss';

    /*
      The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
      so we've added these compatibility styles to make sure everything still
      looks the same as it did with Tailwind CSS v3.

      If we ever want to remove these styles, we need to add an explicit border
      color utility to any element that depends on these defaults.
    */
    @layer base {
      *,
      ::after,
      ::before,
      ::backdrop,
      ::file-selector-button {
        border-color: var(--color-gray-200, currentcolor);
      }
    }"
  `)
})

it('should add the compatibility CSS after the last `@import`', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss';
      @import './foo.css';
      @import './bar.css';
    `),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss';
    @import './foo.css';
    @import './bar.css';

    /*
      The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
      so we've added these compatibility styles to make sure everything still
      looks the same as it did with Tailwind CSS v3.

      If we ever want to remove these styles, we need to add an explicit border
      color utility to any element that depends on these defaults.
    */
    @layer base {
      *,
      ::after,
      ::before,
      ::backdrop,
      ::file-selector-button {
        border-color: var(--color-gray-200, currentcolor);
      }
    }"
  `)
})

it('should add the compatibility CSS after the last import, even if a body-less `@layer` exists', async () => {
  expect(
    await migrate(css`
      @charset "UTF-8";
      @layer foo, bar, baz, base;

      /**!
       * License header
       */

      @import 'tailwindcss';
      @import './foo.css';
      @import './bar.css';
    `),
  ).toMatchInlineSnapshot(`
    "@charset "UTF-8";
    @layer foo, bar, baz, base;

    /**!
     * License header
     */

    @import 'tailwindcss';
    @import './foo.css';
    @import './bar.css';

    /*
      The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
      so we've added these compatibility styles to make sure everything still
      looks the same as it did with Tailwind CSS v3.

      If we ever want to remove these styles, we need to add an explicit border
      color utility to any element that depends on these defaults.
    */
    @layer base {
      *,
      ::after,
      ::before,
      ::backdrop,
      ::file-selector-button {
        border-color: var(--color-gray-200, currentcolor);
      }
    }"
  `)
})

it('should add the compatibility CSS before the first `@layer base` (if the "tailwindcss" import exists)', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss';

      @custom-variant foo {
      }

      @utility bar {
      }

      @layer base {
      }

      @utility baz {
      }

      @layer base {
      }
    `),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss';

    @custom-variant foo {
    }

    /*
      The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
      so we've added these compatibility styles to make sure everything still
      looks the same as it did with Tailwind CSS v3.

      If we ever want to remove these styles, we need to add an explicit border
      color utility to any element that depends on these defaults.
    */
    @layer base {
      *,
      ::after,
      ::before,
      ::backdrop,
      ::file-selector-button {
        border-color: var(--color-gray-200, currentcolor);
      }
    }

    @utility bar {
    }

    @utility baz {
    }

    @layer base {
    }

    @layer base {
    }"
  `)
})

it('should add the compatibility CSS before the first `@layer base` (if the "tailwindcss/preflight" import exists)', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/preflight';

      @custom-variant foo {
      }

      @utility bar {
      }

      @layer base {
      }

      @utility baz {
      }

      @layer base {
      }
    `),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss/preflight';

    @custom-variant foo {
    }

    /*
      The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
      so we've added these compatibility styles to make sure everything still
      looks the same as it did with Tailwind CSS v3.

      If we ever want to remove these styles, we need to add an explicit border
      color utility to any element that depends on these defaults.
    */
    @layer base {
      *,
      ::after,
      ::before,
      ::backdrop,
      ::file-selector-button {
        border-color: var(--color-gray-200, currentcolor);
      }
    }

    @utility bar {
    }

    @utility baz {
    }

    @layer base {
    }

    @layer base {
    }"
  `)
})

it('should not add the backwards compatibility CSS when no `@import "tailwindcss"` or `@import "tailwindcss/preflight"` exists', async () => {
  expect(
    await migrate(css`
      @custom-variant foo {
      }

      @utility bar {
      }

      @layer base {
      }

      @utility baz {
      }

      @layer base {
      }
    `),
  ).toMatchInlineSnapshot(`
    "@custom-variant foo {
    }

    @utility bar {
    }

    @utility baz {
    }

    @layer base {
    }

    @layer base {
    }"
  `)
})

it('should not add the backwards compatibility CSS when another `@import "tailwindcss"` import exists such as theme or utilities', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/theme';

      @custom-variant foo {
      }

      @utility bar {
      }

      @layer base {
      }

      @utility baz {
      }

      @layer base {
      }
    `),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss/theme';

    @custom-variant foo {
    }

    @utility bar {
    }

    @utility baz {
    }

    @layer base {
    }

    @layer base {
    }"
  `)
})
