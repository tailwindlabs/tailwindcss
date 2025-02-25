import { describe, expect, it } from 'vitest'
import { parse, toCss, walk } from './selector-parser'

describe('parse', () => {
  it('should parse a simple selector', () => {
    expect(parse('.foo')).toEqual([{ kind: 'selector', value: '.foo' }])
  })

  it('should parse a compound selector', () => {
    expect(parse('.foo.bar:hover#id')).toEqual([
      { kind: 'selector', value: '.foo' },
      { kind: 'selector', value: '.bar' },
      { kind: 'selector', value: ':hover' },
      { kind: 'selector', value: '#id' },
    ])
  })

  it('should parse a selector list', () => {
    expect(parse('.foo,.bar')).toEqual([
      { kind: 'selector', value: '.foo' },
      { kind: 'separator', value: ',' },
      { kind: 'selector', value: '.bar' },
    ])
  })

  it('should combine everything within attribute selectors', () => {
    expect(parse('.foo[bar="baz"]')).toEqual([
      { kind: 'selector', value: '.foo' },
      { kind: 'selector', value: '[bar="baz"]' },
    ])
  })

  it('should parse functions', () => {
    expect(parse('.foo:hover:not(.bar:focus)')).toEqual([
      { kind: 'selector', value: '.foo' },
      { kind: 'selector', value: ':hover' },
      {
        kind: 'function',
        nodes: [
          {
            kind: 'selector',
            value: '.bar',
          },
          {
            kind: 'selector',
            value: ':focus',
          },
        ],
        value: ':not',
      },
    ])
  })

  it('should handle next-children combinator', () => {
    expect(parse('.foo + p')).toEqual([
      { kind: 'selector', value: '.foo' },
      { kind: 'combinator', value: ' + ' },
      { kind: 'selector', value: 'p' },
    ])
  })

  it('should handle escaped characters', () => {
    expect(parse('foo\\.bar')).toEqual([{ kind: 'selector', value: 'foo\\.bar' }])
  })

  it('parses :nth-child()', () => {
    expect(parse(':nth-child(n+1)')).toEqual([
      {
        kind: 'function',
        value: ':nth-child',
        nodes: [
          {
            kind: 'value',
            value: 'n+1',
          },
        ],
      },
    ])
  })

  it('parses &:has(.child:nth-child(2))', () => {
    expect(parse('&:has(.child:nth-child(2))')).toEqual([
      {
        kind: 'selector',
        value: '&',
      },
      {
        kind: 'function',
        value: ':has',
        nodes: [
          {
            kind: 'selector',
            value: '.child',
          },
          {
            kind: 'function',
            value: ':nth-child',
            nodes: [
              {
                kind: 'value',
                value: '2',
              },
            ],
          },
        ],
      },
    ])
  })

  it('parses &:has(:nth-child(2))', () => {
    expect(parse('&:has(:nth-child(2))')).toEqual([
      {
        kind: 'selector',
        value: '&',
      },
      {
        kind: 'function',
        value: ':has',
        nodes: [
          {
            kind: 'function',
            value: ':nth-child',
            nodes: [
              {
                kind: 'value',
                value: '2',
              },
            ],
          },
        ],
      },
    ])
  })
})

describe('toCss', () => {
  it('should print a simple selector', () => {
    expect(toCss(parse('.foo'))).toBe('.foo')
  })

  it('should print a compound selector', () => {
    expect(toCss(parse('.foo.bar:hover#id'))).toBe('.foo.bar:hover#id')
  })

  it('should print a selector list', () => {
    expect(toCss(parse('.foo,.bar'))).toBe('.foo,.bar')
  })

  it('should print an attribute selectors', () => {
    expect(toCss(parse('.foo[bar="baz"]'))).toBe('.foo[bar="baz"]')
  })

  it('should print a function', () => {
    expect(toCss(parse('.foo:hover:not(.bar:focus)'))).toBe('.foo:hover:not(.bar:focus)')
  })

  it('should print escaped characters', () => {
    expect(toCss(parse('foo\\.bar'))).toBe('foo\\.bar')
  })

  it('should print :nth-child()', () => {
    expect(toCss(parse(':nth-child(n+1)'))).toBe(':nth-child(n+1)')
  })
})

describe('walk', () => {
  it('can be used to replace a function call', () => {
    const ast = parse('.foo:hover:not(.bar:focus)')
    walk(ast, (node, { replaceWith }) => {
      if (node.kind === 'function' && node.value === ':not') {
        replaceWith({ kind: 'selector', value: '.inverted-bar' })
      }
    })
    expect(toCss(ast)).toBe('.foo:hover.inverted-bar')
  })
})
