import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { formatNodes } from './format-nodes'
import { migrateFormsReset } from './migrate-forms-reset'
import { sortBuckets } from './sort-buckets'

const css = dedent

async function migrate(input: string) {
  return postcss()
    .use(migrateFormsReset())
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
      In Tailwind CSS v4, form elements have basic styling applied to them. For
      compatibility with v3, we've applied the following resets:
    */
    @layer base {
      input,
      textarea,
      select,
      button {
        border: 0px solid;
        border-radius: 0;
        padding: 0;
        background-color: transparent;
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
      In Tailwind CSS v4, form elements have basic styling applied to them. For
      compatibility with v3, we've applied the following resets:
    */
    @layer base {
      input,
      textarea,
      select,
      button {
        border: 0px solid;
        border-radius: 0;
        padding: 0;
        background-color: transparent;
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
      In Tailwind CSS v4, form elements have basic styling applied to them. For
      compatibility with v3, we've applied the following resets:
    */
    @layer base {
      input,
      textarea,
      select,
      button {
        border: 0px solid;
        border-radius: 0;
        padding: 0;
        background-color: transparent;
      }
    }"
  `)
})

it('should add the compatibility CSS before the first `@layer base` (if the "tailwindcss" import exists)', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss';

      @variant foo {
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

    @variant foo {
    }

    /*
      In Tailwind CSS v4, form elements have basic styling applied to them. For
      compatibility with v3, we've applied the following resets:
    */
    @layer base {
      input,
      textarea,
      select,
      button {
        border: 0px solid;
        border-radius: 0;
        padding: 0;
        background-color: transparent;
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

      @variant foo {
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

    @variant foo {
    }

    /*
      In Tailwind CSS v4, form elements have basic styling applied to them. For
      compatibility with v3, we've applied the following resets:
    */
    @layer base {
      input,
      textarea,
      select,
      button {
        border: 0px solid;
        border-radius: 0;
        padding: 0;
        background-color: transparent;
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
      @variant foo {
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
    "@variant foo {
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

      @variant foo {
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

    @variant foo {
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
