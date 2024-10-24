import { describe, expect, it } from 'vitest'
import { decodeArbitraryValue } from './decode-arbitrary-value'

describe('decoding arbitrary values', () => {
  it('should replace an underscore with a space', () => {
    expect(decodeArbitraryValue('foo_bar')).toBe('foo bar')
  })

  it('should replace multiple underscores with spaces', () => {
    expect(decodeArbitraryValue('__foo__bar__')).toBe('  foo  bar  ')
  })

  it('should replace escaped underscores with a normal underscore', () => {
    expect(decodeArbitraryValue('foo\\_bar')).toBe('foo_bar')
  })

  it('should not replace underscores in url()', () => {
    expect(decodeArbitraryValue('url(./my_file.jpg)')).toBe('url(./my_file.jpg)')
    expect(decodeArbitraryValue('no-repeat_url(./my_file.jpg)')).toBe(
      'no-repeat url(./my_file.jpg)',
    )
  })

  it('should not replace underscores in the first argument of var()', () => {
    expect(decodeArbitraryValue('var(--spacing-1_5)')).toBe('var(--spacing-1_5)')
    expect(decodeArbitraryValue('var(--spacing-1_5,_1rem)')).toBe('var(--spacing-1_5, 1rem)')
    expect(decodeArbitraryValue('var(--spacing-1_5,_var(--spacing-2_5,_1rem))')).toBe(
      'var(--spacing-1_5, var(--spacing-2_5, 1rem))',
    )
  })

  it('should not replace underscores in the first argument of theme()', () => {
    expect(decodeArbitraryValue('theme(--spacing-1_5)')).toBe('theme(--spacing-1_5)')
    expect(decodeArbitraryValue('theme(--spacing-1_5,_1rem)')).toBe('theme(--spacing-1_5, 1rem)')
    expect(decodeArbitraryValue('theme(--spacing-1_5,_theme(--spacing-2_5,_1rem))')).toBe(
      'theme(--spacing-1_5, theme(--spacing-2_5, 1rem))',
    )
  })

  it('should leave var(…) as is', () => {
    expect(decodeArbitraryValue('var(--foo)')).toBe('var(--foo)')
    expect(decodeArbitraryValue('var(--headings-h1-size)')).toBe('var(--headings-h1-size)')
  })
})

describe('adds spaces around math operators', () => {
  let table = [
    // math functions like calc(…) get spaces around operators
    ['calc(1+2)', 'calc(1 + 2)'],
    ['calc(100%+1rem)', 'calc(100% + 1rem)'],
    ['calc(1+calc(100%-20px))', 'calc(1 + calc(100% - 20px))'],
    ['calc(var(--headings-h1-size)*100)', 'calc(var(--headings-h1-size) * 100)'],
    [
      'calc(var(--headings-h1-size)*calc(100%+50%))',
      'calc(var(--headings-h1-size) * calc(100% + 50%))',
    ],
    ['min(1+2)', 'min(1 + 2)'],
    ['max(1+2)', 'max(1 + 2)'],
    ['clamp(1+2,1+3,1+4)', 'clamp(1 + 2, 1 + 3, 1 + 4)'],
    ['var(--width, calc(100%+1rem))', 'var(--width, calc(100% + 1rem))'],
    ['calc(1px*(7--12/24))', 'calc(1px * (7 - -12 / 24))'],
    ['calc((7-32)/(1400-782))', 'calc((7 - 32) / (1400 - 782))'],
    ['calc((7-3)/(1400-782))', 'calc((7 - 3) / (1400 - 782))'],
    ['calc((7-32)/(1400-782))', 'calc((7 - 32) / (1400 - 782))'],
    ['calc((70-3)/(1400-782))', 'calc((70 - 3) / (1400 - 782))'],
    ['calc((70-32)/(1400-782))', 'calc((70 - 32) / (1400 - 782))'],
    ['calc((704-3)/(1400-782))', 'calc((704 - 3) / (1400 - 782))'],
    ['calc((704-320))', 'calc((704 - 320))'],
    ['calc((704-320)/1)', 'calc((704 - 320) / 1)'],
    ['calc((704-320)/(1400-782))', 'calc((704 - 320) / (1400 - 782))'],
    ['calc(24px+-1rem)', 'calc(24px + -1rem)'],
    ['calc(24px+(-1rem))', 'calc(24px + (-1rem))'],
    ['calc(24px_+_-1rem)', 'calc(24px + -1rem)'],
    ['calc(24px+(-1rem))', 'calc(24px + (-1rem))'],
    ['calc(24px_+_(-1rem))', 'calc(24px + (-1rem))'],
    [
      'calc(var(--10-10px,calc(-20px-(-30px--40px)-50px)))',
      'calc(var(--10-10px,calc(-20px - (-30px - -40px) - 50px)))',
    ],
    ['calc(theme(spacing.1-bar))', 'calc(theme(spacing.1-bar))'],
    ['theme(spacing.1-bar)', 'theme(spacing.1-bar)'],
    ['calc(theme(spacing.1-bar))', 'calc(theme(spacing.1-bar))'],
    ['calc(1rem-theme(spacing.1-bar))', 'calc(1rem - theme(spacing.1-bar))'],
    ['calc(theme(spacing.foo-2))', 'calc(theme(spacing.foo-2))'],
    ['calc(theme(spacing.foo-bar))', 'calc(theme(spacing.foo-bar))'],

    // A negative number immediately after a `,` should not have spaces inserted
    ['clamp(-3px+4px,-3px+4px,-3px+4px)', 'clamp(-3px + 4px, -3px + 4px, -3px + 4px)'],

    // Prevent formatting inside `var()` functions
    ['calc(var(--foo-bar-bar)*2)', 'calc(var(--foo-bar-bar) * 2)'],

    // Prevent formatting inside `env()` functions
    ['calc(env(safe-area-inset-bottom)*2)', 'calc(env(safe-area-inset-bottom) * 2)'],

    // Should format inside `calc()` nested in `env()`
    [
      'env(safe-area-inset-bottom,calc(10px+20px))',
      'env(safe-area-inset-bottom,calc(10px + 20px))',
    ],

    [
      'calc(env(safe-area-inset-bottom,calc(10px+20px))+5px)',
      'calc(env(safe-area-inset-bottom,calc(10px + 20px)) + 5px)',
    ],

    // Prevent formatting keywords
    ['minmax(min-content,25%)', 'minmax(min-content,25%)'],

    // Prevent formatting keywords
    [
      'radial-gradient(calc(1+2)),radial-gradient(calc(1+2))',
      'radial-gradient(calc(1 + 2)),radial-gradient(calc(1 + 2))',
    ],
    ['w-[calc(anchor-size(width)+8px)]', 'w-[calc(anchor-size(width) + 8px)]'],
    ['w-[calc(anchor-size(foo(bar))+8px)]', 'w-[calc(anchor-size(foo(bar)) + 8px)]'],

    [
      '[content-start]_calc(100%-1px)_[content-end]_minmax(1rem,1fr)',
      '[content-start] calc(100% - 1px) [content-end] minmax(1rem,1fr)',
    ],

    // round(…) function
    ['round(1+2,1+3)', 'round(1 + 2, 1 + 3)'],
    ['round(to-zero,1+2,1+3)', 'round(to-zero,1 + 2, 1 + 3)'],

    // Nested parens in non-math functions don't format their contents
    ['env((safe-area-inset-bottom))', 'env((safe-area-inset-bottom))'],

    // `-infinity` is a keyword and should not have spaces around the `-`
    ['atan(1 + -infinity)', 'atan(1 + -infinity)'],
  ]

  it.each(table)('%s', (input, output) => {
    expect(decodeArbitraryValue(input)).toBe(output)
  })
})
