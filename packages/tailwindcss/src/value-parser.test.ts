import { describe, expect, it } from 'vitest'
import { parse, toCss, walk } from './value-parser'

describe('parse', () => {
  it('should parse a value', () => {
    expect(parse('123px')).toEqual([{ kind: 'word', value: '123px' }])
  })

  it('should parse a string value', () => {
    expect(parse("'hello world'")).toEqual([{ kind: 'word', value: "'hello world'" }])
  })

  it('should parse a list', () => {
    expect(parse('hello world')).toEqual([
      { kind: 'word', value: 'hello' },
      { kind: 'separator', value: ' ' },
      { kind: 'word', value: 'world' },
    ])
  })

  it('should parse a string containing parentheses', () => {
    expect(parse("'hello ( world )'")).toEqual([{ kind: 'word', value: "'hello ( world )'" }])
  })

  it('should parse a function with no arguments', () => {
    expect(parse('theme()')).toEqual([{ kind: 'function', value: 'theme', nodes: [] }])
  })

  it('should parse a function with a single argument', () => {
    expect(parse('theme(foo)')).toEqual([
      { kind: 'function', value: 'theme', nodes: [{ kind: 'word', value: 'foo' }] },
    ])
  })

  it('should parse a function with a single string argument', () => {
    expect(parse("theme('foo')")).toEqual([
      { kind: 'function', value: 'theme', nodes: [{ kind: 'word', value: "'foo'" }] },
    ])
  })

  it('should parse a function with multiple arguments', () => {
    expect(parse('theme(foo, bar)')).toEqual([
      {
        kind: 'function',
        value: 'theme',
        nodes: [
          { kind: 'word', value: 'foo' },
          { kind: 'separator', value: ', ' },
          { kind: 'word', value: 'bar' },
        ],
      },
    ])
  })

  it('should parse a function with multiple arguments across lines', () => {
    expect(parse('theme(\n\tfoo,\n\tbar\n)')).toEqual([
      {
        kind: 'function',
        value: 'theme',
        nodes: [
          { kind: 'separator', value: '\n\t' },
          { kind: 'word', value: 'foo' },
          { kind: 'separator', value: ',\n\t' },
          { kind: 'word', value: 'bar' },
          { kind: 'separator', value: '\n' },
        ],
      },
    ])
  })

  it('should parse a function with nested arguments', () => {
    expect(parse('theme(foo, theme(bar))')).toEqual([
      {
        kind: 'function',
        value: 'theme',
        nodes: [
          { kind: 'word', value: 'foo' },
          { kind: 'separator', value: ', ' },
          { kind: 'function', value: 'theme', nodes: [{ kind: 'word', value: 'bar' }] },
        ],
      },
    ])
  })

  it('should parse a function with nested arguments separated by `/`', () => {
    expect(parse('theme(colors.red.500/var(--opacity))')).toEqual([
      {
        kind: 'function',
        value: 'theme',
        nodes: [
          { kind: 'word', value: 'colors.red.500' },
          { kind: 'separator', value: '/' },
          { kind: 'function', value: 'var', nodes: [{ kind: 'word', value: '--opacity' }] },
        ],
      },
    ])
  })

  it('should handle calculations', () => {
    expect(parse('calc((1 + 2) * 3)')).toEqual([
      {
        kind: 'function',
        value: 'calc',
        nodes: [
          {
            kind: 'function',
            value: '',
            nodes: [
              { kind: 'word', value: '1' },
              { kind: 'separator', value: ' ' },
              { kind: 'word', value: '+' },
              { kind: 'separator', value: ' ' },
              { kind: 'word', value: '2' },
            ],
          },
          { kind: 'separator', value: ' ' },
          { kind: 'word', value: '*' },
          { kind: 'separator', value: ' ' },
          { kind: 'word', value: '3' },
        ],
      },
    ])
  })

  it('should handle media query params with functions', () => {
    expect(
      parse(
        '(min-width: 600px) and (max-width:theme(colors.red.500)) and (theme(--breakpoint-sm)<width<=theme(--breakpoint-md))',
      ),
    ).toEqual([
      {
        kind: 'function',
        value: '',
        nodes: [
          { kind: 'word', value: 'min-width' },
          { kind: 'separator', value: ': ' },
          { kind: 'word', value: '600px' },
        ],
      },
      { kind: 'separator', value: ' ' },
      { kind: 'word', value: 'and' },
      { kind: 'separator', value: ' ' },
      {
        kind: 'function',
        value: '',
        nodes: [
          { kind: 'word', value: 'max-width' },
          { kind: 'separator', value: ':' },
          { kind: 'function', value: 'theme', nodes: [{ kind: 'word', value: 'colors.red.500' }] },
        ],
      },
      { kind: 'separator', value: ' ' },
      { kind: 'word', value: 'and' },
      { kind: 'separator', value: ' ' },
      {
        kind: 'function',
        value: '',
        nodes: [
          { kind: 'function', value: 'theme', nodes: [{ kind: 'word', value: '--breakpoint-sm' }] },
          { kind: 'separator', value: '<' },
          { kind: 'word', value: 'width' },
          { kind: 'separator', value: '<=' },
          { kind: 'function', value: 'theme', nodes: [{ kind: 'word', value: '--breakpoint-md' }] },
        ],
      },
    ])
  })
})

describe('toCss', () => {
  it('should pretty print calculations', () => {
    expect(toCss(parse('calc((1 + 2) * 3)'))).toBe('calc((1 + 2) * 3)')
  })

  it('should pretty print nested function calls', () => {
    expect(toCss(parse('theme(foo, theme(bar))'))).toBe('theme(foo, theme(bar))')
  })

  it('should pretty print media query params with functions', () => {
    expect(toCss(parse('(min-width: 600px) and (max-width:theme(colors.red.500))'))).toBe(
      '(min-width: 600px) and (max-width:theme(colors.red.500))',
    )
  })

  it('preserves multiple spaces', () => {
    expect(toCss(parse('foo(   bar  )'))).toBe('foo(   bar  )')
  })
})

describe('walk', () => {
  it('can be used to replace a function call', () => {
    const ast = parse('(min-width: 600px) and (max-width: theme(lg))')

    walk(ast, (node, { replaceWith }) => {
      if (node.kind === 'function' && node.value === 'theme') {
        replaceWith({ kind: 'word', value: '64rem' })
      }
    })

    expect(toCss(ast)).toBe('(min-width: 600px) and (max-width: 64rem)')
  })
})
