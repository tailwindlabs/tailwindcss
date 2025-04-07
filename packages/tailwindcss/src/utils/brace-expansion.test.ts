import { describe, expect, test } from 'vitest'
import { expand } from './brace-expansion'

describe('expand(…)', () => {
  test.each([
    ['a/b/c', ['a/b/c']],

    // Groups
    ['a/{x,y,z}/b', ['a/x/b', 'a/y/b', 'a/z/b']],
    ['{a,b}/{x,y}', ['a/x', 'a/y', 'b/x', 'b/y']],
    ['{{xs,sm,md,lg}:,}hidden', ['xs:hidden', 'sm:hidden', 'md:hidden', 'lg:hidden', 'hidden']],

    // Numeric ranges
    ['a/{0..5}/b', ['a/0/b', 'a/1/b', 'a/2/b', 'a/3/b', 'a/4/b', 'a/5/b']],
    ['a/{-5..0}/b', ['a/-5/b', 'a/-4/b', 'a/-3/b', 'a/-2/b', 'a/-1/b', 'a/0/b']],
    ['a/{0..-5}/b', ['a/0/b', 'a/-1/b', 'a/-2/b', 'a/-3/b', 'a/-4/b', 'a/-5/b']],
    ['a/{0..10..5}/b', ['a/0/b', 'a/5/b', 'a/10/b']],
    ['a/{0..10..-5}/b', ['a/10/b', 'a/5/b', 'a/0/b']],
    ['a/{10..0..5}/b', ['a/10/b', 'a/5/b', 'a/0/b']],
    ['a/{10..0..-5}/b', ['a/0/b', 'a/5/b', 'a/10/b']],

    // Numeric range with padding (we do not support padding)
    ['a/{00..05}/b', ['a/0/b', 'a/1/b', 'a/2/b', 'a/3/b', 'a/4/b', 'a/5/b']],
    ['a{001..9}b', ['a1b', 'a2b', 'a3b', 'a4b', 'a5b', 'a6b', 'a7b', 'a8b', 'a9b']],

    // Numeric range with step
    ['a/{0..5..2}/b', ['a/0/b', 'a/2/b', 'a/4/b']],
    [
      'bg-red-{100..900..100}',
      [
        'bg-red-100',
        'bg-red-200',
        'bg-red-300',
        'bg-red-400',
        'bg-red-500',
        'bg-red-600',
        'bg-red-700',
        'bg-red-800',
        'bg-red-900',
      ],
    ],

    // Nested braces
    ['a{b,c,/{x,y}}/e', ['ab/e', 'ac/e', 'a/x/e', 'a/y/e']],
    ['a{b,c,/{x,y},{z,w}}/e', ['ab/e', 'ac/e', 'a/x/e', 'a/y/e', 'az/e', 'aw/e']],
    ['a{b,c,/{x,y},{0..2}}/e', ['ab/e', 'ac/e', 'a/x/e', 'a/y/e', 'a0/e', 'a1/e', 'a2/e']],
    [
      'bg-red-{50,{100..900..100},950}',
      [
        'bg-red-50',
        'bg-red-100',
        'bg-red-200',
        'bg-red-300',
        'bg-red-400',
        'bg-red-500',
        'bg-red-600',
        'bg-red-700',
        'bg-red-800',
        'bg-red-900',
        'bg-red-950',
      ],
    ],

    // Should not try to expand ranges with decimals
    ['{1.1..2.2}', ['1.1..2.2']],
  ])('should expand %s (%#)', (input, expected) => {
    expect(expand(input).sort()).toEqual(expected.sort())
  })

  test('throws on unbalanced braces', () => {
    expect(() => expand('a{b,c{d,e},{f,g}h}x{y,z')).toThrowErrorMatchingInlineSnapshot(
      `[Error: The pattern \`x{y,z\` is not balanced.]`,
    )
  })

  test('throws when step is set to zero', () => {
    expect(() => expand('a{0..5..0}/b')).toThrowErrorMatchingInlineSnapshot(
      `[Error: Step cannot be zero in sequence expansion.]`,
    )
  })
})
