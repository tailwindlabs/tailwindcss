import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { printCandidate } from '../candidates'
import { automaticVarInjection } from './automatic-var-injection'

test.each([
  // Arbitrary candidates
  ['[color:--my-color]', '[color:var(--my-color)]'],
  ['[--my-color:red]', null],
  ['[--my-color:--my-other-color]', '[--my-color:var(--my-other-color)]'],

  // Arbitrary values for functional candidates
  ['bg-[--my-color]', 'bg-[var(--my-color)]'],
  ['bg-[color:--my-color]', 'bg-[color:var(--my-color)]'],
  ['border-[length:--my-length]', 'border-[length:var(--my-length)]'],
  ['border-[line-width:--my-width]', 'border-[line-width:var(--my-width)]'],

  // Can clean up the workaround for opting out of automatic var injection
  ['bg-[_--my-color]', 'bg-[--my-color]'],
  ['bg-[color:_--my-color]', 'bg-[color:--my-color]'],
  ['border-[length:_--my-length]', 'border-[length:--my-length]'],
  ['border-[line-width:_--my-width]', 'border-[line-width:--my-width]'],

  // Modifiers
  ['[color:--my-color]/[--my-opacity]', '[color:var(--my-color)]/[var(--my-opacity)]'],
  ['bg-red-500/[--my-opacity]', 'bg-red-500/[var(--my-opacity)]'],
  ['bg-[--my-color]/[--my-opacity]', 'bg-[var(--my-color)]/[var(--my-opacity)]'],
  ['bg-[color:--my-color]/[--my-opacity]', 'bg-[color:var(--my-color)]/[var(--my-opacity)]'],

  // Can clean up the workaround for opting out of automatic var injection
  ['[color:--my-color]/[_--my-opacity]', '[color:var(--my-color)]/[--my-opacity]'],
  ['bg-red-500/[_--my-opacity]', 'bg-red-500/[--my-opacity]'],
  ['bg-[--my-color]/[_--my-opacity]', 'bg-[var(--my-color)]/[--my-opacity]'],
  ['bg-[color:--my-color]/[_--my-opacity]', 'bg-[color:var(--my-color)]/[--my-opacity]'],

  // Variants
  ['supports-[--test]:flex', 'supports-[var(--test)]:flex'],
  ['supports-[_--test]:flex', 'supports-[--test]:flex'],

  // Some properties never had var() injection in v3.
  ['[scroll-timeline-name:--myTimeline]', null],
  ['[timeline-scope:--myScope]', null],
  ['[view-timeline-name:--myTimeline]', null],
  ['[font-palette:--myPalette]', null],
  ['[anchor-name:--myAnchor]', null],
  ['[anchor-scope:--myScope]', null],
  ['[position-anchor:--myAnchor]', null],
  ['[position-try-options:--myAnchor]', null],
  ['[scroll-timeline:--myTimeline]', null],
  ['[animation-timeline:--myAnimation]', null],
  ['[view-timeline:--myTimeline]', null],
  ['[position-try:--myAnchor]', null],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  let migrated = automaticVarInjection(designSystem, designSystem.parseCandidate(candidate)[0]!)
  expect(migrated ? printCandidate(migrated) : migrated).toEqual(result)
})
