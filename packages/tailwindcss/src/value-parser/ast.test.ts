import { describe, expect, it } from 'vitest'
import { toCss, walk, word } from './ast'
import { parse } from './parser'

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
        replaceWith(word('64rem'))
      }
    })

    expect(toCss(ast)).toBe('(min-width: 600px) and (max-width: 64rem)')
  })
})
