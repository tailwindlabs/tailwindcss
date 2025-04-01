import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { formatNodes } from './format-nodes'
import { migrateThemeToVar } from './migrate-theme-to-var'
import { sortBuckets } from './sort-buckets'

const css = dedent

async function migrate(input: string) {
  return postcss()
    .use(
      migrateThemeToVar({
        designSystem: await __unstable__loadDesignSystem(`@import 'tailwindcss';`, {
          base: __dirname,
        }),
      }),
    )
    .use(sortBuckets())
    .use(formatNodes())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it('should migrate `theme(…)` to `var(…)`', async () => {
  expect(
    await migrate(css`
      @media theme(screens.sm) {
        .foo {
          background-color: theme(colors.red.900);
          color: theme(colors.red.900 / 75%);
          border-color: theme(colors.red.200/75%);
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@media --theme(--breakpoint-sm) {
      .foo {
        background-color: var(--color-red-900);
        color: --theme(--color-red-900 / 75%);
        border-color: --theme(--color-red-200 / 75%);
      }
    }"
  `)
})
