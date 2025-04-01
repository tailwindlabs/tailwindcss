import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { migrateImportant } from './migrate-important'

test.each([
  ['!flex', 'flex!'],
  ['min-[calc(1000px+12em)]:!flex', 'min-[calc(1000px+12em)]:flex!'],
  ['md:!block', 'md:block!'],

  // Does not change non-important candidates
  ['bg-blue-500', 'bg-blue-500'],
  ['min-[calc(1000px+12em)]:flex', 'min-[calc(1000px+12em)]:flex'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(
    migrateImportant(designSystem, {}, candidate, {
      contents: `"${candidate}"`,
      start: 1,
      end: candidate.length + 1,
    }),
  ).toEqual(result)
})

test('does not match false positives', async () => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(
    migrateImportant(designSystem, {}, '!border', {
      contents: `let notBorder = !border\n`,
      start: 16,
      end: 16 + '!border'.length,
    }),
  ).toEqual('!border')
})

test('does not replace classes in invalid positions', async () => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  function shouldNotReplace(example: string, candidate = '!border') {
    expect(
      migrateImportant(designSystem, {}, candidate, {
        contents: example,
        start: example.indexOf(candidate),
        end: example.indexOf(candidate) + candidate.length,
      }),
    ).toEqual(candidate)
  }

  shouldNotReplace(`let notBorder = !border    \n`)
  shouldNotReplace(`{ "foo": !border.something + ""}\n`)
  shouldNotReplace(`<div v-if="something && !border"></div>\n`)
  shouldNotReplace(`<div v-else-if="something && !border"></div>\n`)
  shouldNotReplace(`<div v-show="something && !border"></div>\n`)
  shouldNotReplace(`<div v-if="!border || !border"></div>\n`)
  shouldNotReplace(`<div v-else-if="!border || !border"></div>\n`)
  shouldNotReplace(`<div v-show="!border || !border"></div>\n`)
  shouldNotReplace(`<div v-if="!border"></div>\n`)
  shouldNotReplace(`<div v-else-if="!border"></div>\n`)
  shouldNotReplace(`<div v-show="!border"></div>\n`)
  shouldNotReplace(`<div x-if="!border"></div>\n`)
})
