import { describe, expect, it } from 'vitest'
import { parse, toCss } from './value-parser'
import { walk, WalkAction } from './walk'

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
          { kind: 'word', value: '/' },
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

  it('should not error when extra `)` was passed', () => {
    expect(parse('calc(1 + 2))')).toEqual([
      {
        kind: 'function',
        value: 'calc',
        nodes: [
          { kind: 'word', value: '1' },
          { kind: 'separator', value: ' ' },
          { kind: 'word', value: '+' },
          { kind: 'separator', value: ' ' },
          { kind: 'word', value: '2' },
        ],
      },
    ])
  })

  it('should lowercase the name of a function', () => {
    expect(parse('CALC(1px + 2px)')).toEqual([
      {
        kind: 'function',
        value: 'calc',
        nodes: [
          { kind: 'word', value: '1px' },
          { kind: 'separator', value: ' ' },
          { kind: 'word', value: '+' },
          { kind: 'separator', value: ' ' },
          { kind: 'word', value: '2px' },
        ],
      },
    ])

    // Only the name, not the arguments
    expect(toCss(parse('VAR(--MY-VAR, FOO)'))).toBe('var(--MY-VAR, FOO)')
    expect(toCss(parse('1+CALC(1px)'))).toBe('1+calc(1px)')
    expect(toCss(parse('-WEBKIT-CALC(1px)'))).toBe('-webkit-calc(1px)')

    // The functions that CSS spells in camelCase
    expect(toCss(parse('ROTATEX(1deg) rotateY(1deg) scalez(2)'))).toBe(
      'rotateX(1deg) rotateY(1deg) scalez(2)',
    )
  })

  it('should not lowercase the name of a dashed function', () => {
    expect(toCss(parse('--MY-FN(1px)'))).toBe('--MY-FN(1px)')
    expect(toCss(parse('--my_FN(1px)'))).toBe('--my_FN(1px)')
    expect(toCss(parse('--my\\_FN(1px)'))).toBe('--my\\_FN(1px)')
  })

  it('should only lowercase the function name at the end of a word', () => {
    // A `-` after a number is a math operator, so the name is `theme`
    expect(toCss(parse('calc(100PX-theme(spacing.1))'))).toBe('calc(100PX-theme(spacing.1))')
    expect(toCss(parse('calc(1E-3-CALC(1px))'))).toBe('calc(1E-3-calc(1px))')

    // An `_` in an arbitrary value becomes a space, so the name is `CALC`
    expect(toCss(parse('Spin_CALC(1s*2)'))).toBe('Spin_calc(1s*2)')
    expect(toCss(parse('a_--MY-FN(1px)'))).toBe('a_--MY-FN(1px)')
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

    walk(ast, (node) => {
      if (node.kind === 'function' && node.value === 'theme') {
        return WalkAction.Replace({ kind: 'word', value: '64rem' } as const)
      }
    })

    expect(toCss(ast)).toBe('(min-width: 600px) and (max-width: 64rem)')
  })
})
