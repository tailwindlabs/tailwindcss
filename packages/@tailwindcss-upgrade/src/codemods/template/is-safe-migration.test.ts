import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { describe, expect, test, vi } from 'vitest'
import * as versions from '../../utils/version'
import { migrateCandidate } from './migrate'
vi.spyOn(versions, 'isMajor').mockReturnValue(true)

describe('is-safe-migration', async () => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  test.each([
    [`let notBorder = !border    \n`, '!border'],
    [`{ "foo": !border.something + ""}\n`, '!border'],
    [`<div v-if="something && !border"></div>\n`, '!border'],
    [`<div v-else-if="something && !border"></div>\n`, '!border'],
    [`<div v-show="something && !border"></div>\n`, '!border'],
    [`<div v-if="!border || !border"></div>\n`, '!border'],
    [`<div v-else-if="!border || !border"></div>\n`, '!border'],
    [`<div v-show="!border || !border"></div>\n`, '!border'],
    [`<div v-if="!border"></div>\n`, '!border'],
    [`<div v-else-if="!border"></div>\n`, '!border'],
    [`<div v-show="!border"></div>\n`, '!border'],
    [`<div x-if="!border"></div>\n`, '!border'],

    [`let notShadow = shadow    \n`, 'shadow'],
    [`{ "foo": shadow.something + ""}\n`, 'shadow'],
    [`<div v-if="something && shadow"></div>\n`, 'shadow'],
    [`<div v-else-if="something && shadow"></div>\n`, 'shadow'],
    [`<div v-show="something && shadow"></div>\n`, 'shadow'],
    [`<div v-if="shadow || shadow"></div>\n`, 'shadow'],
    [`<div v-else-if="shadow || shadow"></div>\n`, 'shadow'],
    [`<div v-show="shadow || shadow"></div>\n`, 'shadow'],
    [`<div v-if="shadow"></div>\n`, 'shadow'],
    [`<div v-else-if="shadow"></div>\n`, 'shadow'],
    [`<div v-show="shadow"></div>\n`, 'shadow'],
    [`<div x-if="shadow"></div>\n`, 'shadow'],
    [`<div style={{filter: 'drop-shadow(30px 10px 4px #4444dd)'}}/>\n`, 'shadow'],

    // Next.js Image placeholder cases
    [`<Image placeholder="blur" src="/image.jpg" />`, 'blur'],
    [`<Image placeholder={'blur'} src="/image.jpg" />`, 'blur'],
    [`<Image placeholder={blur} src="/image.jpg" />`, 'blur'],

    // https://github.com/tailwindlabs/tailwindcss/issues/17974
    ['<div v-if="!duration">', '!duration'],
    ['<div :active="!duration">', '!duration'],
    ['<div :active="!visible">', '!visible'],

    // Alpine/Livewire wire:…
    ['<x-input.number required="foo" wire:model.blur="coins" />', 'blur'],

    // Vue 3 events
    [`emit('blur', props.modelValue)\n`, 'blur'],
    [`$emit('blur', props.modelValue)\n`, 'blur'],
  ])('does not replace classes in invalid positions #%#', async (example, candidate) => {
    expect(
      await migrateCandidate(designSystem, {}, candidate, {
        contents: example,
        start: example.indexOf(candidate),
        end: example.indexOf(candidate) + candidate.length,
      }),
    ).toEqual(candidate)
  })
})
