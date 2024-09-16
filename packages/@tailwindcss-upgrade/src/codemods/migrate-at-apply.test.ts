import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { migrateAtApply } from './migrate-at-apply'

const css = dedent

function migrate(input: string) {
  return postcss()
    .use(migrateAtApply())
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
