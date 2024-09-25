import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'
import { __unstable__loadDesignSystem } from '../../../tailwindcss/src/index'
import { formatNodes } from './format-nodes'
import { migratePrefixConfigOption } from './migrate-prefix-config-option'

const css = dedent

function migrate(input: string, designSystem?: DesignSystem) {
  return postcss()
    .use(migratePrefixConfigOption(designSystem))
    .use(formatNodes())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it('Does not add prefix when not configured`', async () => {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @config "config.js";
    `,
    {
      base: __dirname,
      loadModule: async (id, base) => ({ base, module: {} }),
    },
  )

  expect(
    await migrate(
      css`
        @import 'tailwindcss';
        @import 'tailwindcss/theme';
      `,
      designSystem,
    ),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss';
    @import 'tailwindcss/theme';"
  `)
})

it('Adds prefix to imports', async () => {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @config "config.js";
    `,
    {
      base: __dirname,
      loadModule: async (id, base) => ({ base, module: { prefix: 'tw' } }),
    },
  )

  expect(
    await migrate(
      css`
        @import 'tailwindcss';
        @import 'tailwindcss' layer(tailwind);
        @import 'tailwindcss/theme';
        @import 'tailwindcss/theme' layer(theme);
      `,
      designSystem,
    ),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss' prefix(tw);
    @import 'tailwindcss' layer(tailwind) prefix(tw);
    @import 'tailwindcss/theme' prefix(tw);
    @import 'tailwindcss/theme' layer(theme) prefix(tw);"
  `)
})

it('Does not add prefix if it is already there', async () => {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @config "config.js";
    `,
    {
      base: __dirname,
      loadModule: async (id, base) => ({ base, module: { prefix: 'tw' } }),
    },
  )

  expect(
    await migrate(
      css`
        @import 'tailwindcss' prefix(wat);
        @import 'tailwindcss/theme' prefix(wat);
      `,
      designSystem,
    ),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss' prefix(wat);
    @import 'tailwindcss/theme' prefix(wat);"
  `)
})

it('Migrates a prefix ending with a dash', async () => {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @config "config.js";
    `,
    {
      base: __dirname,
      loadModule: async (id, base) => ({ base, module: { prefix: 'tw-' } }),
    },
  )

  expect(
    await migrate(
      css`
        @import 'tailwindcss';
        @import 'tailwindcss/theme';
      `,
      designSystem,
    ),
  ).toMatchInlineSnapshot(`
    "@import 'tailwindcss' prefix(tw);
    @import 'tailwindcss/theme' prefix(tw);"
  `)
})
