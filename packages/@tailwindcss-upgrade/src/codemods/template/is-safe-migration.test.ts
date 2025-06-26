import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test, vi } from 'vitest'
import * as versions from '../../utils/version'
import { migrateCandidate } from './migrate'
vi.spyOn(versions, 'isMajor').mockReturnValue(true)

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

  await shouldNotReplace(`let notShadow = shadow    \n`, 'shadow')
  await shouldNotReplace(`{ "foo": shadow.something + ""}\n`, 'shadow')
  await shouldNotReplace(`<div v-if="something && shadow"></div>\n`, 'shadow')
  await shouldNotReplace(`<div v-else-if="something && shadow"></div>\n`, 'shadow')
  await shouldNotReplace(`<div v-show="something && shadow"></div>\n`, 'shadow')
  await shouldNotReplace(`<div v-if="shadow || shadow"></div>\n`, 'shadow')
  await shouldNotReplace(`<div v-else-if="shadow || shadow"></div>\n`, 'shadow')
  await shouldNotReplace(`<div v-show="shadow || shadow"></div>\n`, 'shadow')
  await shouldNotReplace(`<div v-if="shadow"></div>\n`, 'shadow')
  await shouldNotReplace(`<div v-else-if="shadow"></div>\n`, 'shadow')
  await shouldNotReplace(`<div v-show="shadow"></div>\n`, 'shadow')
  await shouldNotReplace(`<div x-if="shadow"></div>\n`, 'shadow')
  await shouldNotReplace(
    `<div style={{filter: 'drop-shadow(30px 10px 4px #4444dd)'}}/>\n`,
    'shadow',
  )

  // Next.js Image placeholder cases
  await shouldNotReplace(`<Image placeholder="blur" src="/image.jpg" />`, 'blur')
  await shouldNotReplace(`<Image placeholder={'blur'} src="/image.jpg" />`, 'blur')
  await shouldNotReplace(`<Image placeholder={blur} src="/image.jpg" />`, 'blur')

  // https://github.com/tailwindlabs/tailwindcss/issues/17974
  await shouldNotReplace('<div v-if="!duration">', '!duration')
  await shouldNotReplace('<div :active="!duration">', '!duration')
  await shouldNotReplace('<div :active="!visible">', '!visible')

  // Alpine/Livewire wire:…
  await shouldNotReplace('<x-input.number required="foo" wire:model.blur="coins" />', 'blur')

  // Vue 3 events
  await shouldNotReplace(`emit('blur', props.modelValue)\n`, 'blur')
  await shouldNotReplace(`$emit('blur', props.modelValue)\n`, 'blur')
})
