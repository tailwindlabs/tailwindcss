import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { migrateAutomaticVarInjection } from './migrate-automatic-var-injection'

test.each([
  // Arbitrary candidates
  ['[color:--my-color]', '[color:var(--my-color)]'],
  ['[--my-color:red]', '[--my-color:red]'],
  ['[--my-color:--my-other-color]', '[--my-color:var(--my-other-color)]'],

  // Arbitrary values for functional candidates
  ['bg-[--my-color]', 'bg-(--my-color)'],
  ['bg-[color:--my-color]', 'bg-(color:--my-color)'],
  ['border-[length:--my-length]', 'border-(length:--my-length)'],
  ['border-[line-width:--my-width]', 'border-(line-width:--my-width)'],

  // Can clean up the workaround for opting out of automatic var injection
  ['bg-[_--my-color]', 'bg-[--my-color]'],
  ['bg-[color:_--my-color]', 'bg-[color:--my-color]'],
  ['border-[length:_--my-length]', 'border-[length:--my-length]'],
  ['border-[line-width:_--my-width]', 'border-[line-width:--my-width]'],

  // Modifiers
  ['[color:--my-color]/[--my-opacity]', '[color:var(--my-color)]/(--my-opacity)'],
  ['bg-red-500/[--my-opacity]', 'bg-red-500/(--my-opacity)'],
  ['bg-[--my-color]/[--my-opacity]', 'bg-(--my-color)/(--my-opacity)'],
  ['bg-[color:--my-color]/[--my-opacity]', 'bg-(color:--my-color)/(--my-opacity)'],

  // Can clean up the workaround for opting out of automatic var injection
  ['[color:--my-color]/[_--my-opacity]', '[color:var(--my-color)]/[--my-opacity]'],
  ['bg-red-500/[_--my-opacity]', 'bg-red-500/[--my-opacity]'],
  ['bg-[--my-color]/[_--my-opacity]', 'bg-(--my-color)/[--my-opacity]'],
  ['bg-[color:--my-color]/[_--my-opacity]', 'bg-(color:--my-color)/[--my-opacity]'],

  // Variants
  ['supports-[--test]:flex', 'supports-(--test):flex'],
  ['supports-[_--test]:flex', 'supports-[--test]:flex'],

  // Custom CSS functions that look like variables should not be converted
  ['w-[--spacing(5)]', 'w-[--spacing(5)]'],
  ['bg-[--theme(--color-red-500)]', 'bg-[--theme(--color-red-500)]'],

  // Some properties never had var() injection in v3.
  ['[scroll-timeline-name:--myTimeline]', '[scroll-timeline-name:--myTimeline]'],
  ['[timeline-scope:--myScope]', '[timeline-scope:--myScope]'],
  ['[view-timeline-name:--myTimeline]', '[view-timeline-name:--myTimeline]'],
  ['[font-palette:--myPalette]', '[font-palette:--myPalette]'],
  ['[anchor-name:--myAnchor]', '[anchor-name:--myAnchor]'],
  ['[anchor-scope:--myScope]', '[anchor-scope:--myScope]'],
  ['[position-anchor:--myAnchor]', '[position-anchor:--myAnchor]'],
  ['[position-try-options:--myAnchor]', '[position-try-options:--myAnchor]'],
  ['[scroll-timeline:--myTimeline]', '[scroll-timeline:--myTimeline]'],
  ['[animation-timeline:--myAnimation]', '[animation-timeline:--myAnimation]'],
  ['[view-timeline:--myTimeline]', '[view-timeline:--myTimeline]'],
  ['[position-try:--myAnchor]', '[position-try:--myAnchor]'],
])('%s => %s', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  let migrated = migrateAutomaticVarInjection(designSystem, {}, candidate)
  expect(migrated).toEqual(result)
})
