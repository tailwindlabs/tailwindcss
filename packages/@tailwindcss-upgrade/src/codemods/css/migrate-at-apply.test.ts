import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import { migrateAtApply } from './migrate-at-apply'

const css = dedent

async function migrate(input: string, config: Config = {}) {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @import 'tailwindcss';
    `,
    { base: __dirname },
  )

  return postcss()
    .use(
      migrateAtApply({
        designSystem,
        userConfig: config,
      }),
    )
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it('should not migrate `@apply`, when there are no issues', async () => {
  expect(
    await migrate(css`
      .foo {
        @apply flex flex-col items-center;
      }
    `),
  ).toMatchInlineSnapshot(`
    ".foo {
      @apply flex flex-col items-center;
    }"
  `)
})

it('should append `!` to each utility, when using `!important`', async () => {
  expect(
    await migrate(css`
      .foo {
        @apply flex flex-col !important;
      }
    `),
  ).toMatchInlineSnapshot(`
    ".foo {
      @apply flex! flex-col!;
    }"
  `)
})

// TODO: Handle SCSS syntax
it.skip('should append `!` to each utility, when using `#{!important}`', async () => {
  expect(
    await migrate(css`
      .foo {
        @apply flex flex-col #{!important};
      }
    `),
  ).toMatchInlineSnapshot(`
    ".foo {
      @apply flex! flex-col!;
    }"
  `)
})

it('should move the legacy `!` prefix, to the new `!` postfix notation', async () => {
  expect(
    await migrate(css`
      .foo {
        @apply !flex flex-col! hover:!items-start items-center;
      }
    `),
  ).toMatchInlineSnapshot(`
    ".foo {
      @apply flex! flex-col! hover:items-start! items-center;
    }"
  `)
})

it('should apply all candidate migration when migrating with a config', async () => {
  async function migrateWithPrefix(input: string) {
    return postcss()
      .use(
        migrateAtApply({
          designSystem: await __unstable__loadDesignSystem(
            css`
              @import 'tailwindcss' prefix(tw);
            `,
            { base: __dirname },
          ),
          userConfig: {
            prefix: 'tw_',
          },
        }),
      )
      .process(input, { from: expect.getState().testPath })
      .then((result) => result.css)
  }

  expect(
    await migrateWithPrefix(css`
      .foo {
        @apply !tw_flex [color:--my-color] tw_bg-gradient-to-t;
      }
    `),
  ).toMatchInlineSnapshot(`
    ".foo {
      @apply tw:flex! tw:[color:var(--my-color)] tw:bg-linear-to-t;
    }"
  `)
})
