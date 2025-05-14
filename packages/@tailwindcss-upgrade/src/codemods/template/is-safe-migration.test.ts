import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { migrateCandidate } from './migrate'

test('does not replace classes in invalid positions', async () => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  async function shouldNotReplace(example: string, candidate = '!border') {
    expect(
      await migrateCandidate(designSystem, {}, candidate, {
        contents: example,
        start: example.indexOf(candidate),
        end: example.indexOf(candidate) + candidate.length,
      }),
    ).toEqual(candidate)
  }

  await shouldNotReplace(`let notBorder = !border    \n`)
  await shouldNotReplace(`{ "foo": !border.something + ""}\n`)
  await shouldNotReplace(`<div v-if="something && !border"></div>\n`)
  await shouldNotReplace(`<div v-else-if="something && !border"></div>\n`)
  await shouldNotReplace(`<div v-show="something && !border"></div>\n`)
  await shouldNotReplace(`<div v-if="!border || !border"></div>\n`)
  await shouldNotReplace(`<div v-else-if="!border || !border"></div>\n`)
  await shouldNotReplace(`<div v-show="!border || !border"></div>\n`)
  await shouldNotReplace(`<div v-if="!border"></div>\n`)
  await shouldNotReplace(`<div v-else-if="!border"></div>\n`)
  await shouldNotReplace(`<div v-show="!border"></div>\n`)
  await shouldNotReplace(`<div x-if="!border"></div>\n`)
})
