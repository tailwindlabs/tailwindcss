import { expect, it } from 'vitest'
import { isSimpleClassSelector } from './is-simple-class-selector'

it.each([
  // Simple class selector
  ['.foo', true],

  // Class selectors with escaped characters
  ['.w-\\[123px\\]', true],
  ['.content-\\[\\+\\>\\~\\*\\]', true],

  // ID selector
  ['#foo', false],
  ['.foo#foo', false],

  // Element selector
  ['h1', false],
  ['h1.foo', false],

  // Attribute selector
  ['[data-foo]', false],
  ['.foo[data-foo]', false],
  ['[data-foo].foo', false],

  // Pseudo-class selector
  ['.foo:hover', false],

  // Additional class selector
  ['.foo.bar', false],

  // Combinator
  ['.foo>.bar', false],
  ['.foo+.bar', false],
  ['.foo~.bar', false],
  ['.foo .bar', false],

  // Selector list
  ['.foo, .bar', false],
  ['.foo,.bar', false],
])('should validate %s', (selector, expected) => {
  expect(isSimpleClassSelector(selector)).toBe(expected)
})
