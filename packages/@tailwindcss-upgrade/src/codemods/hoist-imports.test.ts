import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { hoistImports } from './hoist-imports'

const css = dedent

function migrate(input: string) {
  return postcss()
    .use(hoistImports())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it('should keep imports as-is if they are in the correct spot', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/base';
      @import 'tailwindcss/components';
      @import 'tailwindcss/utilities';
    `),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';"
  `)
})

it('should hoist imports to the top', async () => {
  expect(
    await migrate(css`
      @import 'tailwindcss/base';
      .a {
      }
      @import 'tailwindcss/components';
      .b {
      }
      @import 'tailwindcss/utilities';
      .c {
      }
    `),
  ).toMatchInlineSnapshot(`
    "
    @import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';
    .a {
    }
    .b {
    }
    .c {
    }"
  `)
})

it('should keep @charset at the top', async () => {
  expect(
    await migrate(css`
      @charset 'utf-8';
      @import 'tailwindcss/base';
      .a {
      }
      @import 'tailwindcss/components';
      .b {
      }
      @import 'tailwindcss/utilities';
      .c {
      }
    `),
  ).toMatchInlineSnapshot(`
    "@charset 'utf-8';
    @import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';
    .a {
    }
    .b {
    }
    .c {
    }"
  `)
})

it('should keep the empty @layer at the top', async () => {
  expect(
    await migrate(css`
      @layer foo, bar, baz;
      @import 'tailwindcss/base';
      .a {
      }
      @import 'tailwindcss/components';
      .b {
      }
      @import 'tailwindcss/utilities';
      .c {
      }
    `),
  ).toMatchInlineSnapshot(`
    "@layer foo, bar, baz;
    @import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';
    .a {
    }
    .b {
    }
    .c {
    }"
  `)
})

it('should keep comments above the imports', async () => {
  expect(
    await migrate(css`
      /* Imports: */
      @import 'tailwindcss/base';
      .a {
      }
      @import 'tailwindcss/components';
      .b {
      }
      @import 'tailwindcss/utilities';
      .c {
      }
    `),
  ).toMatchInlineSnapshot(`
    "/* Imports: */
    @import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';
    .a {
    }
    .b {
    }
    .c {
    }"
  `)
})
