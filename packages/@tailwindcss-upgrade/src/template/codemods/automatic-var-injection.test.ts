import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { printCandidate } from '../candidates'
import { automaticVarInjection } from './automatic-var-injection'

test.each([
  // Arbitrary candidates
  ['[color:--my-color]', '[color:var(--my-color)]'],

  // Arbitrary values for functional candidates
  ['bg-[--my-color]', 'bg-[var(--my-color)]'],
  ['bg-[color:--my-color]', 'bg-[color:var(--my-color)]'],
  ['border-[length:--my-length]', 'border-[length:var(--my-length)]'],
  ['border-[line-width:--my-width]', 'border-[line-width:var(--my-width)]'],

  // Does not add var() if there is a _ before the variable name
  ['bg-[_--my-color]', null],
  ['bg-[color:_--my-color]', null],
  ['border-[length:_--my-length]', null],
  ['border-[line-width:_--my-width]', null],

  // Modifiers
  ['[color:--my-color]/[--my-opacity]', '[color:var(--my-color)]/[var(--my-opacity)]'],
  ['bg-red-500/[--my-opacity]', 'bg-red-500/[var(--my-opacity)]'],
  ['bg-[--my-color]/[--my-opacity]', 'bg-[var(--my-color)]/[var(--my-opacity)]'],
  ['bg-[color:--my-color]/[--my-opacity]', 'bg-[color:var(--my-color)]/[var(--my-opacity)]'],

  ['[color:--my-color]/[_--my-opacity]', '[color:var(--my-color)]/[_--my-opacity]'],
  ['bg-red-500/[_--my-opacity]', null],
  ['bg-[--my-color]/[_--my-opacity]', 'bg-[var(--my-color)]/[_--my-opacity]'],
  ['bg-[color:--my-color]/[_--my-opacity]', 'bg-[color:var(--my-color)]/[_--my-opacity]'],

  // Variants
  ['supports-[--test]:flex', 'supports-[var(--test)]:flex'],
  ['supports-[_--test]:flex', null],

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
