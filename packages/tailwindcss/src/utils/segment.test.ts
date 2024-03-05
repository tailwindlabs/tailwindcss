import { expect, it } from 'vitest'
import { segment } from './segment'

it('should result in a single segment when the separator is not present', () => {
  expect(segment('foo', ':')).toEqual(['foo'])
})

it('should split by the separator', () => {
  expect(segment('foo:bar:baz', ':')).toEqual(['foo', 'bar', 'baz'])
})

it('should not split inside of parens', () => {
  expect(segment('a:(b:c):d', ':')).toEqual(['a', '(b:c)', 'd'])
})

it('should not split inside of brackets', () => {
  expect(segment('a:[b:c]:d', ':')).toEqual(['a', '[b:c]', 'd'])
})

it('should not split inside of curlies', () => {
  expect(segment('a:{b:c}:d', ':')).toEqual(['a', '{b:c}', 'd'])
})

it('should split by the escape sequence which is escape as well', () => {
  expect(segment('a\\b\\c\\d', '\\')).toEqual(['a', 'b', 'c', 'd'])
  expect(segment('a\\(b\\c)\\d', '\\')).toEqual(['a', '(b\\c)', 'd'])
  expect(segment('a\\[b\\c]\\d', '\\')).toEqual(['a', '[b\\c]', 'd'])
  expect(segment('a\\{b\\c}\\d', '\\')).toEqual(['a', '{b\\c}', 'd'])
})
