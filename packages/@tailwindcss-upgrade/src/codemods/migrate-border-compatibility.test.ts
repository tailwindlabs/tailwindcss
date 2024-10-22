import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { formatNodes } from './format-nodes'
import { migrateBorderCompatibility } from './migrate-border-compatibility'

const css = dedent

async function migrate(input: string) {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @import 'tailwindcss';
    `,
    { base: __dirname },
  )

  return postcss()
    .use(migrateBorderCompatibility({ designSystem }))
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
      The default border color has changed to \`currentColor\` in Tailwind CSS v4,
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
        border-color: var(--color-gray-200, currentColor);
      }
    }

    /*
      Form elements have a 1px border by default in Tailwind CSS v4, so we've
      added these compatibility styles to make sure everything still looks the
      same as it did with Tailwind CSS v3.

      If we ever want to remove these styles, we need to add \`border-0\` to
      any form elements that shouldn't have a border.
    */
    @layer base {
      input:where(:not([type='button'], [type='reset'], [type='submit'])),
      select,
      textarea {
        border-width: 0;
      }
    }"
  `)
})

it('should add the compatibility CSS after the last `@import`', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/base';
      @import 'tailwindcss/components';
      @import 'tailwindcss/utilities';
    `),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';

    /*
      The default border color has changed to \`currentColor\` in Tailwind CSS v4,
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
        border-color: var(--color-gray-200, currentColor);
      }
    }
    /*
      Form elements have a 1px border by default in Tailwind CSS v4, so we've
      added these compatibility styles to make sure everything still looks the
      same as it did with Tailwind CSS v3.

      If we ever want to remove these styles, we need to add \`border-0\` to
      any form elements that shouldn't have a border.
    */
    @layer base {
      input:where(:not([type='button'], [type='reset'], [type='submit'])),
      select,
      textarea {
        border-width: 0;
      }
    }"
  `)
})

it('should add the compatibility CSS after the last import, even if a body-less `@layer` exists', async () => {
  expect(
    await migrate(css`
      @charset "UTF-8";
      @layer foo, bar, baz;

      /**!
       * License header
       */

      @import 'tailwindcss/base';
      @import 'tailwindcss/components';
      @import 'tailwindcss/utilities';
    `),
  ).toMatchInlineSnapshot(`
    "@charset "UTF-8";
    @layer foo, bar, baz;

    /**!
     * License header
     */

    @import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';

    /*
      The default border color has changed to \`currentColor\` in Tailwind CSS v4,
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
        border-color: var(--color-gray-200, currentColor);
      }
    }
    /*
      Form elements have a 1px border by default in Tailwind CSS v4, so we've
      added these compatibility styles to make sure everything still looks the
      same as it did with Tailwind CSS v3.

      If we ever want to remove these styles, we need to add \`border-0\` to
      any form elements that shouldn't have a border.
    */
    @layer base {
      input:where(:not([type='button'], [type='reset'], [type='submit'])),
      select,
      textarea {
        border-width: 0;
      }
    }"
  `)
})

it('should add the compatibility CSS before the first `@layer base`', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/base';
      @import 'tailwindcss/components';
      @import 'tailwindcss/utilities';

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
    "@import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';

    @variant foo {
    }

    @utility bar {
    }

    /*
      The default border color has changed to \`currentColor\` in Tailwind CSS v4,
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
        border-color: var(--color-gray-200, currentColor);
      }
    }

    /*
      Form elements have a 1px border by default in Tailwind CSS v4, so we've
      added these compatibility styles to make sure everything still looks the
      same as it did with Tailwind CSS v3.

      If we ever want to remove these styles, we need to add \`border-0\` to
      any form elements that shouldn't have a border.
    */
    @layer base {
      input:where(:not([type='button'], [type='reset'], [type='submit'])),
      select,
      textarea {
        border-width: 0;
      }
    }

    @layer base {
    }

    @utility baz {
    }

    @layer base {
    }"
  `)
})
