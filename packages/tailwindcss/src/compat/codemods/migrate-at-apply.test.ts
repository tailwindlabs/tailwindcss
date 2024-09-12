import dedent from 'dedent'
import { expect, it } from 'vitest'
import { toCss } from '../../ast'
import * as CSS from '../../css-parser'
import { migrateAtApply } from './migrate-at-apply'

const css = dedent

function migrate(input: string) {
  let ast = CSS.parse(input)
  migrateAtApply(ast)
  return toCss(ast).trim()
}

it('should not migrate `@apply`, when there are no issues', () => {
  expect(
    migrate(css`
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

it('should append `!` to each utility, when using `!important`', () => {
  expect(
    migrate(css`
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

// Sass/SCSS
it('should append `!` to each utility, when using `#{!important}`', () => {
  expect(
    migrate(css`
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

it('should move the legacy `!` prefix, to the new `!` postfix notation', () => {
  expect(
    migrate(css`
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
