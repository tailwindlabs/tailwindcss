import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { describe, expect, test, vi } from 'vitest'
import * as versions from '../../utils/version'
import { migrateCandidate } from './migrate'
vi.spyOn(versions, 'isMajor').mockReturnValue(true)

const css = String.raw

describe('is-safe-migration', async () => {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @import 'tailwindcss';

      /* TODO(perf): Only here to speed up the tests */
      @theme {
        --*: initial;
        --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      }
    `,
    { base: __dirname },
  )

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

    // JavaScript / TypeScript
    [`document.addEventListener('blur',handleBlur)`, 'blur'],
    [`document.addEventListener('blur', handleBlur)`, 'blur'],

    [`function foo({ outline = true })`, 'outline'],
    [`function foo({ before = false, outline = true })`, 'outline'],
    [`function foo({before=false,outline=true })`, 'outline'],
    [`function foo({outline=true })`, 'outline'],
    // https://github.com/tailwindlabs/tailwindcss/issues/18675
    [
      // With default value
      `function foo({ size = "1.25rem", digit, outline = true, textClass = "", className = "" })`,
      'outline',
    ],
    [
      // Without default value
      `function foo({ size = "1.25rem", digit, outline, textClass = "", className = "" })`,
      'outline',
    ],
    [
      // As the last argument
      `function foo({ size = "1.25rem", digit, outline })`,
      'outline',
    ],
    [
      // As the last argument, but there is techinically another `"` on the same line
      `function foo({ size = "1.25rem", digit, outline }): { return "foo" }`,
      'outline',
    ],
    [
      // Tricky quote balancing
      `function foo({ before = "'", outline, after = "'" }): { return "foo" }`,
      'outline',
    ],

    [`function foo(blur, foo)`, 'blur'],
    [`function foo(blur,foo)`, 'blur'],

    // shadcn/ui variants
    [`<Button variant="outline" />`, 'outline'],
    [`<Button variant='outline' />`, 'outline'],
    [`<Button variant={"outline"} />`, 'outline'],
    [`<Button variant={'outline'} />`, 'outline'],
    [`function Button({ variant = "outline" }) {}`, 'outline'],
    [`function Button({ variant = 'outline' }) {}`, 'outline'],
    [`function Button({ variant="outline" }) {}`, 'outline'],
    [`function Button({ variant='outline' }) {}`, 'outline'],
    [`Button({ variant: "outline" })`, 'outline'],
    [`Button({ variant: 'outline' })`, 'outline'],
  ])('does not replace classes in invalid positions #%#', async (example, candidate) => {
    expect(
      await migrateCandidate(designSystem, {}, candidate, {
        contents: example,
        start: example.indexOf(candidate),
        end: example.indexOf(candidate) + candidate.length,
      }),
    ).toEqual(candidate)
  })

  test.each([
    // Vue classes
    [`<div class="shadow"></div>`, 'shadow', 'shadow-sm'],
    [`<div :class="{ shadow: true }"></div>`, 'shadow', 'shadow-sm'],
    [`<div enter-class="shadow"></div>`, 'shadow', 'shadow-sm'],
    [`<div :enter-class="{ shadow: true }"></div>`, 'shadow', 'shadow-sm'],

    // React classes
    [`<div className="shadow"></div>`, 'shadow', 'shadow-sm'],
    [`<div enterClassName="shadow"></div>`, 'shadow', 'shadow-sm'],

    // Preact-style
    [`<div enterClass="shadow"></div>`, 'shadow', 'shadow-sm'],
  ])('replaces classes in valid positions #%#', async (example, candidate, expected) => {
    expect(
      await migrateCandidate(designSystem, {}, candidate, {
        contents: example,
        start: example.indexOf(candidate),
        end: example.indexOf(candidate) + candidate.length,
      }),
    ).toEqual(expected)
  })
})
