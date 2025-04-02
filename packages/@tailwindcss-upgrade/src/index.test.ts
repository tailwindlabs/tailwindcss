import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import dedent from 'dedent'
import path from 'node:path'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { formatNodes } from './codemods/css/format-nodes'
import { migrateContents } from './codemods/css/migrate'
import { sortBuckets } from './codemods/css/sort-buckets'

const css = dedent

let designSystem = await __unstable__loadDesignSystem(
  css`
    @import 'tailwindcss';
  `,
  { base: __dirname },
)

let config = {
  designSystem,
  userConfig: {},
  newPrefix: null,
  configFilePath: path.resolve(__dirname, './tailwind.config.js'),
  jsConfigMigration: null,
}

function migrate(input: string, config: any) {
  return migrateContents(input, config, expect.getState().testPath)
    .then((result) => postcss([sortBuckets(), formatNodes()]).process(result.root, result.opts))
    .then((result) => result.css)
}

it('should print the input as-is', async () => {
  expect(
    await migrate(
      css`
        /* above */
        .foo/* after */ {
          /* above */
          color:  /* before */ red /* after */;
          /* below */
        }
      `,
      config,
    ),
  ).toMatchInlineSnapshot(`
    "/* above */
    .foo/* after */ {
      /* above */
      color:  /* before */ red /* after */;
      /* below */
    }"
  `)
})

it('should migrate a stylesheet', async () => {
  expect(
    await migrate(
      css`
        @tailwind base;

        html {
          overflow: hidden;
        }

        @tailwind components;

        .a {
          z-index: 1;
        }

        @layer components {
          .b {
            z-index: 2;
          }
        }

        .c {
          z-index: 3;
        }

        @tailwind utilities;

        .d {
          z-index: 4;
        }

        @layer utilities {
          .e {
            z-index: 5;
          }
        }
      `,
      config,
    ),
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
    }

    @utility b {
      z-index: 2;
    }

    @utility e {
      z-index: 5;
    }

    @layer base {
      html {
        overflow: hidden;
      }
    }

    @layer components {
      .a {
        z-index: 1;
      }
    }

    @layer components {
      .c {
        z-index: 3;
      }
    }

    @layer utilities {
      .d {
        z-index: 4;
      }
    }"
  `)
})

it('should migrate a stylesheet (with imports)', async () => {
  expect(
    await migrate(
      css`
        @import 'tailwindcss/base';
        @import './my-base.css';
        @import 'tailwindcss/components';
        @import './my-components.css';
        @import 'tailwindcss/utilities';
        @import './my-utilities.css';
      `,
      config,
    ),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss';
    @import './my-base.css' layer(base);
    @import './my-components.css' layer(components);
    @import './my-utilities.css' layer(utilities);

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

it('should migrate a stylesheet (with preceding rules that should be wrapped in an `@layer`)', async () => {
  expect(
    await migrate(
      css`
        @charset "UTF-8";
        @layer foo, bar, baz;
        /**! My license comment */
        html {
          color: red;
        }
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
      config,
    ),
  ).toMatchInlineSnapshot(`
    "@charset "UTF-8";
    @layer foo, bar, baz;
    /**! My license comment */
    @import 'tailwindcss';

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

    @layer base {
      html {
        color: red;
      }
    }"
  `)
})

it('should keep CSS as-is before existing `@layer` at-rules', async () => {
  expect(
    await migrate(
      css`
        .foo {
          color: blue;
        }

        @layer components {
          .bar {
            color: red;
          }
        }
      `,
      config,
    ),
  ).toMatchInlineSnapshot(`
    "@utility bar {
      color: red;
    }

    .foo {
      color: blue;
    }"
  `)
})
