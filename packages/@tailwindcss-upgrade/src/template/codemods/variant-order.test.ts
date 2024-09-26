import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { printCandidate } from '../candidates'
import { variantOrder } from './variant-order'

test.each([
  // Does nothing unless there are at least two variants
  ['flex', null],
  ['hover:flex', null],
  ['[color:red]', null],
  ['[&:focus]:[color:red]', null],

  // // Reorders simple variants
  ['data-[invalid]:data-[hover]:flex', 'data-[hover]:data-[invalid]:flex'],

  // // Does not reorder some known combinations where the order does not matter
  ['hover:focus:flex', null],
  ['focus:hover:flex', null],
  ['[&:hover]:[&:focus]:flex', null],
  ['[&:focus]:[&:hover]:flex', null],

  // Handles pseudo-elements that cannot have anything after them
  // c.f. https://github.com/tailwindlabs/tailwindcss/pull/13478/files#diff-7779a0eebf6b980dd3abd63b39729b3023cf9a31c91594f5a25ea020b066e1c0
  ['dark:before:flex', 'dark:before:flex'],
  ['before:dark:flex', 'dark:before:flex'],

  // Puts some pseudo-elements that must appear at the end of the selector at
  // the end of the candidate
  ['dark:*:before:after:flex', 'dark:*:after:before:flex'],
  ['dark:before:after:*:flex', 'dark:*:after:before:flex'],

  // Some pseudo-elements are treated as regular variants
  ['dark:*:hover:file:focus:underline', 'dark:focus:file:hover:*:underline'],

  // Keeps @media-variants and the dark variant in the beginning and keeps their
  // order
  ['sm:dark:hover:flex', 'sm:dark:hover:flex'],
  ['[@media(print)]:group-hover:flex', '[@media(print)]:group-hover:flex'],
  ['sm:max-xl:data-[a]:data-[b]:dark:hover:flex', 'sm:max-xl:dark:hover:data-[b]:data-[a]:flex'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  let migrated = variantOrder(designSystem, designSystem.parseCandidate(candidate)[0]!)
  expect(migrated ? printCandidate(migrated) : migrated).toEqual(result)
})
