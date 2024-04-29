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

it('should not split inside of double quotes', () => {
  expect(segment('a:"b:c":d', ':')).toEqual(['a', '"b:c"', 'd'])
})

it('should not split inside of single quotes', () => {
  expect(segment("a:'b:c':d", ':')).toEqual(['a', "'b:c'", 'd'])
})

it('should not crash when double quotes are unbalanced', () => {
  expect(segment('a:"b:c:d', ':')).toEqual(['a', '"b:c:d'])
})

it('should not crash when single quotes are unbalanced', () => {
  expect(segment("a:'b:c:d", ':')).toEqual(['a', "'b:c:d"])
})

it('should skip escaped double quotes', () => {
  expect(segment(String.raw`a:"b:c\":d":e`, ':')).toEqual(['a', String.raw`"b:c\":d"`, 'e'])
})

it('should skip escaped single quotes', () => {
  expect(segment(String.raw`a:'b:c\':d':e`, ':')).toEqual(['a', String.raw`'b:c\':d'`, 'e'])
})

it('should split by the escape sequence which is escape as well', () => {
  expect(segment('a\\b\\c\\d', '\\')).toEqual(['a', 'b', 'c', 'd'])
  expect(segment('a\\(b\\c)\\d', '\\')).toEqual(['a', '(b\\c)', 'd'])
  expect(segment('a\\[b\\c]\\d', '\\')).toEqual(['a', '[b\\c]', 'd'])
  expect(segment('a\\{b\\c}\\d', '\\')).toEqual(['a', '{b\\c}', 'd'])
})
