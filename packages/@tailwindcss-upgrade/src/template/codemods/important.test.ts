import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { important } from './important'

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
    important(designSystem, {}, candidate, {
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
    important(designSystem, {}, '!border', {
      contents: `let notBorder = !border\n`,
      start: 16,
      end: 16 + '!border'.length,
    }),
  ).toEqual('!border')
})

test('does not match false positives', async () => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  function shouldNotDetect(example: string, candidate = '!border') {
    expect(
      important(designSystem, {}, candidate, {
        contents: example,
        start: example.indexOf(candidate),
        end: example.indexOf(candidate) + candidate.length,
      }),
    ).toEqual('!border')
  }

  shouldNotDetect(`let notBorder = !border    \n`)
  shouldNotDetect(`{ "foo": !border.something + ""}\n`)
  shouldNotDetect(`<div v-if="something && !border"></div>\n`)
  shouldNotDetect(`<div v-else-if="something && !border"></div>\n`)
  shouldNotDetect(`<div v-show="something && !border"></div>\n`)
  shouldNotDetect(`<div v-if="!border || !border"></div>\n`)
  shouldNotDetect(`<div v-else-if="!border || !border"></div>\n`)
  shouldNotDetect(`<div v-show="!border || !border"></div>\n`)
  shouldNotDetect(`<div v-if="!border"></div>\n`)
  shouldNotDetect(`<div v-else-if="!border"></div>\n`)
  shouldNotDetect(`<div v-show="!border"></div>\n`)
  shouldNotDetect(`<div x-if="!border"></div>\n`)
})
