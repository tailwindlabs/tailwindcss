import { expect, it } from 'vitest'
import { normalizeAtRuleName } from './normalize-at-rule-name'

it.each([
  // The name of the at-rule is lowercased, the rest stays as written
  ['@MEDIA print', '@media print'],
  ['@MEDIA PRINT', '@media PRINT'],
  ['@Media(width>=40rem)', '@media(width>=40rem)'],
  ['@CONTAINER sidebar (width>=24rem)', '@container sidebar (width>=24rem)'],
  ['@SUPPORTS\t(display:grid)', '@supports\t(display:grid)'],
  ['@SCOPE{', '@scope{'],
  ['@STARTING-STYLE', '@starting-style'],

  // Only ASCII letters are lowercased
  ['@FOO-İ print', '@foo-İ print'],

  // Other selectors stay as they are
  ['@media print', '@media print'],
  ['&:HOVER', '&:HOVER'],
  ['.FOO &', '.FOO &'],
  ['', ''],
])('normalizeAtRuleName(%j) → %j', (input, expected) => {
  expect(normalizeAtRuleName(input)).toBe(expected)
})
