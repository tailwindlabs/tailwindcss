import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { migrateBgGradient } from './migrate-bg-gradient'

test.each([
  ['bg-gradient-to-t', 'bg-linear-to-t'],
  ['bg-gradient-to-tr', 'bg-linear-to-tr'],
  ['bg-gradient-to-r', 'bg-linear-to-r'],
  ['bg-gradient-to-br', 'bg-linear-to-br'],
  ['bg-gradient-to-b', 'bg-linear-to-b'],
  ['bg-gradient-to-bl', 'bg-linear-to-bl'],
  ['bg-gradient-to-l', 'bg-linear-to-l'],
  ['bg-gradient-to-tl', 'bg-linear-to-tl'],

  ['max-lg:hover:bg-gradient-to-t', 'max-lg:hover:bg-linear-to-t'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(migrateBgGradient(designSystem, {}, candidate)).toEqual(result)
})
