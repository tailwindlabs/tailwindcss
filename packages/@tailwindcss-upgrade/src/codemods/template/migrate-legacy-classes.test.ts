import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { migrateLegacyClasses } from './migrate-legacy-classes'

test.each([
  ['shadow', 'shadow-sm'],
  ['shadow-sm', 'shadow-xs'],
  ['shadow-xs', 'shadow-2xs'],

  ['inset-shadow', 'inset-shadow-sm'],
  ['inset-shadow-sm', 'inset-shadow-xs'],
  ['inset-shadow-xs', 'inset-shadow-2xs'],

  ['drop-shadow', 'drop-shadow-sm'],
  ['drop-shadow-sm', 'drop-shadow-xs'],

  ['rounded', 'rounded-sm'],
  ['rounded-sm', 'rounded-xs'],

  ['blur', 'blur-sm'],
  ['blur-sm', 'blur-xs'],

  ['backdrop-blur', 'backdrop-blur-sm'],
  ['backdrop-blur-sm', 'backdrop-blur-xs'],

  ['ring', 'ring-3'],

  ['blur!', 'blur-sm!'],
  ['hover:blur', 'hover:blur-sm'],
  ['hover:blur!', 'hover:blur-sm!'],

  ['hover:blur-sm', 'hover:blur-xs'],
  ['blur-sm!', 'blur-xs!'],
  ['hover:blur-sm!', 'hover:blur-xs!'],
])('%s => %s (%#)', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(await migrateLegacyClasses(designSystem, {}, candidate)).toEqual(result)
})

test('does not replace classes in invalid positions', async () => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  async function shouldNotReplace(example: string, candidate = 'shadow') {
    expect(
      await migrateLegacyClasses(designSystem, {}, candidate, {
        contents: example,
        start: example.indexOf(candidate),
        end: example.indexOf(candidate) + candidate.length,
      }),
    ).toEqual(candidate)
  }

  await shouldNotReplace(`let notShadow = shadow    \n`)
  await shouldNotReplace(`{ "foo": shadow.something + ""}\n`)
  await shouldNotReplace(`<div v-if="something && shadow"></div>\n`)
  await shouldNotReplace(`<div v-else-if="something && shadow"></div>\n`)
  await shouldNotReplace(`<div v-show="something && shadow"></div>\n`)
  await shouldNotReplace(`<div v-if="shadow || shadow"></div>\n`)
  await shouldNotReplace(`<div v-else-if="shadow || shadow"></div>\n`)
  await shouldNotReplace(`<div v-show="shadow || shadow"></div>\n`)
  await shouldNotReplace(`<div v-if="shadow"></div>\n`)
  await shouldNotReplace(`<div v-else-if="shadow"></div>\n`)
  await shouldNotReplace(`<div v-show="shadow"></div>\n`)
  await shouldNotReplace(`<div x-if="shadow"></div>\n`)
  await shouldNotReplace(`<div style={{filter: 'drop-shadow(30px 10px 4px #4444dd)'}}/>\n`)

  // Next.js Image placeholder cases
  await shouldNotReplace(`<Image placeholder="blur" src="/image.jpg" />`, 'blur')
  await shouldNotReplace(`<Image placeholder={'blur'} src="/image.jpg" />`, 'blur')
  await shouldNotReplace(`<Image placeholder={blur} src="/image.jpg" />`, 'blur')
})
