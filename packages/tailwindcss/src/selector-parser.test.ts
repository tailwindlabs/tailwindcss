import { describe, expect, it } from 'vitest'
import { parse, toCss } from './selector-parser'
import { walk, WalkAction } from './walk'

describe('parse', () => {
  it('should parse a simple selector', () => {
    expect(parse('.foo')).toEqual([{ kind: 'selector', value: '.foo' }])
  })

  it('should parse a compound selector', () => {
    expect(parse('.foo.bar:hover#id')).toEqual([
      {
        kind: 'compound',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'selector', value: '.bar' },
          { kind: 'selector', value: ':hover' },
          { kind: 'selector', value: '#id' },
        ],
      },
    ])
  })

  it('should parse a pseudo-element selector with double ::', () => {
    expect(parse('.foo::before')).toEqual([
      {
        kind: 'compound',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'selector', value: '::before' },
        ],
      },
    ])
  })

  it('should parse a selector list', () => {
    expect(parse('.foo,.bar')).toEqual([
      {
        kind: 'list',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'selector', value: '.bar' },
        ],
      },
    ])
  })

  // We've got 3 options here:
  //
  // 1. We could throw, but then it becomes more annoying when you don't have
  //    control over the CSS (for example when it's coming from a package).
  // 2. We could parse it and ignore the invalid cases as-if they weren't there.
  //    Re-printing the AST would turn it into a valid situation.
  // 3. We could parse the invalid case and turn it into a `compound` such that
  //    it stays invalid. When we re-print we would re-introduce the error.
  //
  // Before this change, we would keep the errors, and pass it along:
  // - In a browser environment, these would be ignored
  // - In Lightning CSS, these are thrown out
  //
  // For that reason alone, let's go with option 3 for now, such that the
  // behavior is the same as before. This does mean that we see "weird" empty
  // compound nodes.
  it('should safely parse an invalid selector list', () => {
    expect(parse('.foo,')).toEqual([
      {
        kind: 'list',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'compound', nodes: [] },
        ],
      },
    ])
    expect(parse(',.foo')).toEqual([
      {
        kind: 'list',
        nodes: [
          { kind: 'compound', nodes: [] },
          { kind: 'selector', value: '.foo' },
        ],
      },
    ])
    expect(parse(',.foo,')).toEqual([
      {
        kind: 'list',
        nodes: [
          { kind: 'compound', nodes: [] },
          { kind: 'selector', value: '.foo' },
          { kind: 'compound', nodes: [] },
        ],
      },
    ])
    expect(parse('.foo,,.bar')).toEqual([
      {
        kind: 'list',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'compound', nodes: [] },
          { kind: 'selector', value: '.bar' },
        ],
      },
    ])
  })

  it('should parse selector lists with whitespace around the comma', () => {
    expect(parse('.foo, .bar')).toEqual([
      {
        kind: 'list',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'selector', value: '.bar' },
        ],
      },
    ])

    expect(parse('.foo , .bar')).toEqual([
      {
        kind: 'list',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'selector', value: '.bar' },
        ],
      },
    ])

    expect(parse('.foo ,.bar')).toEqual([
      {
        kind: 'list',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'selector', value: '.bar' },
        ],
      },
    ])
  })

  it('should parse a list of attribute selectors', () => {
    expect(parse('[foo],[bar]')).toEqual([
      {
        kind: 'list',
        nodes: [
          { kind: 'selector', value: '[foo]' },
          { kind: 'selector', value: '[bar]' },
        ],
      },
    ])
  })

  it('should parse a list of selectors with just functions', () => {
    expect(parse(':is(.a),:is(.b)')).toEqual([
      {
        kind: 'list',
        nodes: [
          { kind: 'function', value: ':is', nodes: [{ kind: 'selector', value: '.a' }] },
          { kind: 'function', value: ':is', nodes: [{ kind: 'selector', value: '.b' }] },
        ],
      },
    ])
  })

  it('should parse selector lists with more than two selectors', () => {
    expect(parse('.foo,.bar,.baz')).toEqual([
      {
        kind: 'list',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'selector', value: '.bar' },
          { kind: 'selector', value: '.baz' },
        ],
      },
    ])
  })

  it('should group selectors with combinators in a selector list', () => {
    expect(parse('.a+.b, .c .d[attr], .e')).toEqual([
      {
        kind: 'list',
        nodes: [
          {
            kind: 'complex',
            nodes: [
              { kind: 'selector', value: '.a' },
              { kind: 'combinator', value: '+' },
              { kind: 'selector', value: '.b' },
            ],
          },
          {
            kind: 'complex',
            nodes: [
              { kind: 'selector', value: '.c' },
              { kind: 'combinator', value: ' ' },
              {
                kind: 'compound',
                nodes: [
                  { kind: 'selector', value: '.d' },
                  { kind: 'selector', value: '[attr]' },
                ],
              },
            ],
          },
          { kind: 'selector', value: '.e' },
        ],
      },
    ])
  })

  it('should parse complex selectors in a selector list', () => {
    expect(parse('#a.b > .c, .d')).toEqual([
      {
        kind: 'list',
        nodes: [
          {
            kind: 'complex',
            nodes: [
              {
                kind: 'compound',
                nodes: [
                  { kind: 'selector', value: '#a' },
                  { kind: 'selector', value: '.b' },
                ],
              },
              { kind: 'combinator', value: '>' },
              { kind: 'selector', value: '.c' },
            ],
          },
          { kind: 'selector', value: '.d' },
        ],
      },
    ])
  })

  it('should combine everything within attribute selectors', () => {
    expect(parse('.foo[bar="baz"]')).toEqual([
      {
        kind: 'compound',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'selector', value: '[bar="baz"]' },
        ],
      },
    ])
  })

  it('should parse functions', () => {
    expect(parse('.foo:hover:not(.bar:focus)')).toEqual([
      {
        kind: 'compound',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'selector', value: ':hover' },
          {
            kind: 'function',
            value: ':not',
            nodes: [
              {
                kind: 'compound',
                nodes: [
                  { kind: 'selector', value: '.bar' },
                  { kind: 'selector', value: ':focus' },
                ],
              },
            ],
          },
        ],
      },
    ])
  })

  it('should parse selector lists in functions', () => {
    expect(parse(':is(.foo, .bar)')).toEqual([
      {
        kind: 'function',
        value: ':is',
        nodes: [
          {
            kind: 'list',
            nodes: [
              { kind: 'selector', value: '.foo' },
              { kind: 'selector', value: '.bar' },
            ],
          },
        ],
      },
    ])
  })

  it('should handle next-children combinator', () => {
    expect(parse('.foo + p')).toEqual([
      {
        kind: 'complex',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'combinator', value: '+' },
          { kind: 'selector', value: 'p' },
        ],
      },
    ])
  })

  it('should normalize combinators', () => {
    expect(parse('.foo + .bar')).toEqual([
      {
        kind: 'complex',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'combinator', value: '+' },
          { kind: 'selector', value: '.bar' },
        ],
      },
    ])

    expect(parse('.foo  \n\t .bar')).toEqual([
      {
        kind: 'complex',
        nodes: [
          { kind: 'selector', value: '.foo' },
          { kind: 'combinator', value: ' ' },
          { kind: 'selector', value: '.bar' },
        ],
      },
    ])
  })

  it('should handle escaped characters', () => {
    expect(parse('foo\\.bar')).toEqual([{ kind: 'selector', value: 'foo\\.bar' }])
  })

  it('parses :nth-child()', () => {
    // The `An+B` part is not a selector, it stays an opaque value
    expect(parse(':nth-child(n+1)')).toEqual([
      {
        kind: 'function',
        value: ':nth-child',
        nodes: [{ kind: 'value', value: 'n+1' }],
      },
    ])

    // The selector list after `of` is parsed as a selector
    expect(parse(':nth-child(2 of &)')).toEqual([
      {
        kind: 'function',
        value: ':nth-child',
        nodes: [
          { kind: 'value', value: '2 of ' },
          { kind: 'selector', value: '&' },
        ],
      },
    ])

    expect(parse(':nth-child(2n + 1 of .foo, .bar)')).toEqual([
      {
        kind: 'function',
        value: ':nth-child',
        nodes: [
          { kind: 'value', value: '2n + 1 of ' },
          {
            kind: 'list',
            nodes: [
              { kind: 'selector', value: '.foo' },
              { kind: 'selector', value: '.bar' },
            ],
          },
        ],
      },
    ])
  })

  it('parses &:has(.child:nth-child(2))', () => {
    expect(parse('&:has(.child:nth-child(2))')).toEqual([
      {
        kind: 'compound',
        nodes: [
          {
            kind: 'selector',
            value: '&',
          },
          {
            kind: 'function',
            value: ':has',
            nodes: [
              {
                kind: 'compound',
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
            ],
          },
        ],
      },
    ])
  })

  it('parses &:has(:nth-child(2))', () => {
    expect(parse('&:has(:nth-child(2))')).toEqual([
      {
        kind: 'compound',
        nodes: [
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
        ],
      },
    ])
  })

  it('parses nesting selector before attribute selector', () => {
    expect(parse('&[data-foo]')).toEqual([
      {
        kind: 'compound',
        nodes: [
          { kind: 'selector', value: '&' },
          { kind: 'selector', value: '[data-foo]' },
        ],
      },
    ])
  })

  it('parses nesting selector after an attribute selector', () => {
    expect(parse('[data-foo]&')).toEqual([
      {
        kind: 'compound',
        nodes: [
          { kind: 'selector', value: '[data-foo]' },
          { kind: 'selector', value: '&' },
        ],
      },
    ])
  })

  it('parses universal selector before attribute selector', () => {
    expect(parse('*[data-foo]')).toEqual([
      {
        kind: 'compound',
        nodes: [
          { kind: 'selector', value: '*' },
          { kind: 'selector', value: '[data-foo]' },
        ],
      },
    ])
  })

  it('parses the universal selector after an attribute selector', () => {
    expect(parse('[data-foo]*')).toEqual([
      {
        kind: 'compound',
        nodes: [
          { kind: 'selector', value: '[data-foo]' },
          { kind: 'selector', value: '*' },
        ],
      },
    ])
  })

  it('parses another attribute selector after an attribute selector', () => {
    expect(parse('[data-foo][data-bar]')).toEqual([
      {
        kind: 'compound',
        nodes: [
          { kind: 'selector', value: '[data-foo]' },
          { kind: 'selector', value: '[data-bar]' },
        ],
      },
    ])
  })

  it('parses a type selector before an attribute selector', () => {
    expect(parse('div[data-foo]')).toEqual([
      {
        kind: 'compound',
        nodes: [
          { kind: 'selector', value: 'div' },
          { kind: 'selector', value: '[data-foo]' },
        ],
      },
    ])
  })

  it('parses a type selector after an attribute selector', () => {
    expect(parse('[data-foo]div')).toEqual([
      {
        kind: 'compound',
        nodes: [
          { kind: 'selector', value: '[data-foo]' },
          { kind: 'selector', value: 'div' },
        ],
      },
    ])
  })

  it('should parse selector lists as real selectors', () => {
    expect(parse('.foo[attr], .bar#id, .baz + .qux')).toEqual([
      {
        kind: 'list',
        nodes: [
          {
            kind: 'compound',
            nodes: [
              { kind: 'selector', value: '.foo' },
              { kind: 'selector', value: '[attr]' },
            ],
          },
          {
            kind: 'compound',
            nodes: [
              { kind: 'selector', value: '.bar' },
              { kind: 'selector', value: '#id' },
            ],
          },
          {
            kind: 'complex',
            nodes: [
              { kind: 'selector', value: '.baz' },
              { kind: 'combinator', value: '+' },
              { kind: 'selector', value: '.qux' },
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
    expect(toCss(parse('.foo, .bar'))).toBe('.foo, .bar')
  })

  it('should print a selector list with normalized commas', () => {
    expect(toCss(parse('.foo,.bar'))).toBe('.foo, .bar')
    expect(toCss(parse('.foo, .bar'))).toBe('.foo, .bar')
    expect(toCss(parse('.foo , .bar'))).toBe('.foo, .bar')
    expect(toCss(parse('.foo ,.bar'))).toBe('.foo, .bar')
  })

  it('should print a selector list but minimized', () => {
    expect(toCss(parse('.foo, .bar'), true)).toBe('.foo,.bar')
    expect(toCss(parse('.foo , .bar'), true)).toBe('.foo,.bar')
    expect(toCss(parse('.foo ,.bar'), true)).toBe('.foo,.bar')
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
    // The `An+B` part is printed verbatim, whitespace in the selector list
    // after `of` is normalized
    expect(toCss(parse(':nth-child(n+1)'))).toBe(':nth-child(n+1)')
    expect(toCss(parse(':nth-child(+2)'))).toBe(':nth-child(+2)')
    expect(toCss(parse(':nth-child(2n + 1 of .foo,.bar)'))).toBe(':nth-child(2n + 1 of .foo, .bar)')
  })

  it('should pretty print a complex selector', () => {
    expect(toCss(parse('.a+.b, .c .d[attr], .e'))).toBe('.a + .b, .c .d[attr], .e')
  })

  it('should minify a complex selector during printing', () => {
    expect(toCss(parse('.a+.b, .c .d[attr], .e'), true)).toBe('.a+.b,.c .d[attr],.e')
    //                                                                 ^ This space is significant to indicate a descendant combinator
  })
})

describe('walk', () => {
  it('can be used to replace a function call', () => {
    const ast = parse('.foo:hover:not(.bar:focus)')
    walk(ast, (node) => {
      if (node.kind === 'function' && node.value === ':not') {
        return WalkAction.Replace({ kind: 'selector', value: '.inverted-bar' } as const)
      }
    })
    expect(toCss(ast)).toBe('.foo:hover.inverted-bar')
  })
})
