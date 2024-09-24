import dedent from 'dedent'
import { expect, it } from 'vitest'
import { migrateContents } from './migrate'

const css = dedent

it('should print the input as-is', async () => {
  expect(
    await migrateContents(
      css`
        /* above */
        .foo/* after */ {
          /* above */
          color:  /* before */ red /* after */;
          /* below */
        }
      `,
      expect.getState().testPath,
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
    await migrateContents(css`
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
    `),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss';

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

    @utility b {
      z-index: 2;
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
    }

    @utility e {
      z-index: 5;
    }"
  `)
})

it('should migrate a stylesheet (with imports)', async () => {
  expect(
    await migrateContents(css`
      @import 'tailwindcss/base';
      @import './my-base.css';
      @import 'tailwindcss/components';
      @import './my-components.css';
      @import 'tailwindcss/utilities';
      @import './my-utilities.css';
    `),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss';
    @import './my-base.css' layer(base);
    @import './my-components.css' layer(components);
    @import './my-utilities.css' layer(utilities);"
  `)
})
