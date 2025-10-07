import { describe, expect, it } from 'vitest'
import { parse } from './attribute-selector-parser'

describe('parse', () => {
  it.each([
    [''],
    [']'],
    ['[]'],
    ['['],
    ['="value"'],
    ['data-foo]'],
    ['[data-foo'],
    ['[data-foo="foo]'],
    ['[data-foo * = foo]'],
    ['[data-foo*=]'],
    ['[data-foo=value x]'],
    ['[data-foo=value ix]'],
  ])('should parse an invalid attribute selector (%s) as `null`', (input) => {
    expect(parse(input)).toBeNull()
  })

  it.each([
    [
      '[data-foo]',
      { attribute: 'data-foo', operator: null, quote: null, value: null, sensitivity: null },
    ],
    [
      '[ data-foo ]',
      { attribute: 'data-foo', operator: null, quote: null, value: null, sensitivity: null },
    ],
    [
      '[data-state=expanded]',
      { attribute: 'data-state', operator: '=', quote: null, value: 'expanded', sensitivity: null },
    ],
    [
      '[data-state = expanded ]',
      { attribute: 'data-state', operator: '=', quote: null, value: 'expanded', sensitivity: null },
    ],
    [
      '[data-state*="expanded"]',
      { attribute: 'data-state', operator: '*=', quote: '"', value: 'expanded', sensitivity: null },
    ],
    [
      '[data-state*="expanded"i]',
      { attribute: 'data-state', operator: '*=', quote: '"', value: 'expanded', sensitivity: 'i' },
    ],
    [
      '[data-state*=expanded i]',
      { attribute: 'data-state', operator: '*=', quote: null, value: 'expanded', sensitivity: 'i' },
    ],
  ])('should parse correctly: %s', (selector, expected) => {
    expect(parse(selector)).toEqual(expected)
  })

  it('should work with a real-world example', () => {
    expect(parse('[data-url$=".com"i]')).toEqual({
      attribute: 'data-url',
      operator: '$=',
      quote: '"',
      value: '.com',
      sensitivity: 'i',
    })
  })
})
