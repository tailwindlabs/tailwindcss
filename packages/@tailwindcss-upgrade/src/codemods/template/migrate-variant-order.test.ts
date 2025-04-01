import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import dedent from 'dedent'
import { expect, test } from 'vitest'
import { migrateVariantOrder } from './migrate-variant-order'

let css = dedent

test.each([
  // Does nothing unless there are at least two variants
  ['flex', 'flex'],
  ['hover:flex', 'hover:flex'],
  ['[color:red]', '[color:red]'],
  ['[&:focus]:[color:red]', '[&:focus]:[color:red]'],

  // Reorders simple variants that include combinators
  ['*:first:flex', 'first:*:flex'],

  // Does not reorder variants without combinators
  ['data-[invalid]:data-[hover]:flex', 'data-[invalid]:data-[hover]:flex'],

  // Does not reorder some known combinations where the order does not matter
  ['hover:focus:flex', 'hover:focus:flex'],
  ['focus:hover:flex', 'focus:hover:flex'],
  ['[&:hover]:[&:focus]:flex', '[&:hover]:[&:focus]:flex'],
  ['[&:focus]:[&:hover]:flex', '[&:focus]:[&:hover]:flex'],
  ['data-[a]:data-[b]:flex', 'data-[a]:data-[b]:flex'],

  // Handles pseudo-elements that cannot have anything after them
  // c.f. https://github.com/tailwindlabs/tailwindcss/pull/13478/files#diff-7779a0eebf6b980dd3abd63b39729b3023cf9a31c91594f5a25ea020b066e1c0
  ['dark:before:flex', 'dark:before:flex'],
  ['before:dark:flex', 'dark:before:flex'],

  // Puts some pseudo-elements that must appear at the end of the selector at
  // the end of the candidate
  ['dark:*:before:after:flex', 'dark:*:before:after:flex'],
  ['dark:before:after:*:flex', 'dark:*:before:after:flex'],

  // Some pseudo-elements are treated as regular variants
  ['dark:*:hover:file:focus:underline', 'dark:focus:file:hover:*:underline'],

  // Keeps at-rule-variants and the dark variant in the beginning and keeps their
  // order
  ['sm:dark:hover:flex', 'sm:dark:hover:flex'],
  ['[@media(print)]:group-hover:flex', '[@media(print)]:group-hover:flex'],
  ['sm:max-xl:data-[a]:data-[b]:dark:hover:flex', 'sm:max-xl:dark:data-[a]:data-[b]:hover:flex'],
  [
    'sm:data-[root]:*:data-[a]:even:*:data-[b]:even:before:underline',
    'sm:even:data-[b]:*:even:data-[a]:*:data-[root]:before:underline',
  ],
  ['hover:[@supports(display:grid)]:flex', '[@supports(display:grid)]:hover:flex'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(migrateVariantOrder(designSystem, {}, candidate)).toEqual(result)
})

test('it works with custom variants', async () => {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @import 'tailwindcss';
      @custom-variant atrule {
        @media (print) {
          @slot;
        }
      }

      @custom-variant combinator {
        > * {
          @slot;
        }
      }

      @custom-variant pseudo {
        &::before {
          @slot;
        }
      }
    `,
    {
      base: __dirname,
    },
  )

  expect(migrateVariantOrder(designSystem, {}, 'combinator:pseudo:atrule:underline')).toEqual(
    'atrule:combinator:pseudo:underline',
  )
})
