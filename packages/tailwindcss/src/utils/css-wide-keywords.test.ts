import { expect, it } from 'vitest'
import { normalizeCssWideKeyword } from './css-wide-keywords'

it.each([
  // CSS-wide keywords
  ['initial', 'initial'],
  ['INITIAL', 'initial'],
  ['Inherit', 'inherit'],
  ['REVERT', 'revert'],
  ['Revert-Layer', 'revert-layer'],
  ['REVERT-RULE', 'revert-rule'],
  ['unSET', 'unset'],

  // Other values stay as written
  ['', ''],
  ['INHERITED', 'INHERITED'],
  ['UNSET UNSET', 'UNSET UNSET'],
  ['RED', 'RED'],
  ["'INHERIT'", "'INHERIT'"],
  ['İNHERIT', 'İNHERIT'],
])('normalizeCssWideKeyword(%j) → %j', (input, expected) => {
  expect(normalizeCssWideKeyword(input)).toBe(expected)
})
