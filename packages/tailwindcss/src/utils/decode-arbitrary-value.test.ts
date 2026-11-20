import { describe, expect, it } from 'vitest'
import {
  decodeArbitraryValue,
  normalizeFunctionNames,
  normalizeUnits,
  normalizeUrlSchemes,
} from './decode-arbitrary-value'

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

  it('should lowercase function names', () => {
    expect(decodeArbitraryValue('URL(./my_file.jpg)')).toBe('url(./my_file.jpg)')
    expect(decodeArbitraryValue('VAR(--spacing-1_5,_1rem)')).toBe('var(--spacing-1_5, 1rem)')
    expect(decodeArbitraryValue('ROTATEX(45deg)_SCALEZ(2)')).toBe('rotateX(45deg) scaleZ(2)')
    expect(decodeArbitraryValue('Spin_CALC(1s*2)_linear')).toBe('Spin calc(1s * 2) linear')
    expect(decodeArbitraryValue('--MY-FN(1px)')).toBe('--MY-FN(1px)')
  })
})

describe('normalizeFunctionNames', () => {
  it.each([
    ['URL(./my_file.jpg)', 'url(./my_file.jpg)'],
    ['no-repeat_URL(./my_file.jpg)', 'no-repeat_url(./my_file.jpg)'],
    ['Spin_CALC(1s*2)_linear', 'Spin_calc(1s*2)_linear'],
    ['ROTATEX(45deg)_SCALEZ(2)', 'rotateX(45deg)_scaleZ(2)'],
    ['-WEBKIT-CALC(1px)', '-webkit-calc(1px)'],
    ['C\\ALC(1px)', 'c\\alc(1px)'],

    // A `-` after a number is a math operator, so the name starts after it
    ['calc(100PX-theme(spacing.1))', 'calc(100PX-theme(spacing.1))'],
    ['calc(1E-3-CALC(1px))', 'calc(1E-3-calc(1px))'],
    ['calc(-1PX-CALC(1px))', 'calc(-1PX-calc(1px))'],

    // Dashed functions are case-sensitive
    ['--MY-FN(1px)', '--MY-FN(1px)'],
    ['a_--MY-FN(1px)', 'a_--MY-FN(1px)'],
    ['--my\\_FN(1px)', '--my\\_FN(1px)'],

    // An `_` becomes a space, so `FN` is a function of its own
    ['--my_FN(1px)', '--my_fn(1px)'],

    // Strings and words without a `(` are not function names
    ["'FN('_X(1)", "'FN('_x(1)"],
    ['"A\\"B(1)"', '"A\\"B(1)"'],
    ['FOO_BAR', 'FOO_BAR'],
  ])('%s', (input, output) => {
    expect(normalizeFunctionNames(input)).toBe(output)
  })
})

describe('normalizeUnits', () => {
  it.each([
    // Units and exponents are case-insensitive
    ['10PX', '10px'],
    ['10Px 20pX', '10px 20px'],
    ['-.5EM', '-.5em'],
    ['+1.5REM', '+1.5rem'],
    ['1E3', '1e3'],
    ['1E-3PX', '1e-3px'],
    ['calc(100% - 1REM)', 'calc(100% - 1rem)'],
    ['var(--my-var, 10PX)', 'var(--my-var, 10px)'],
    ['image-set(url(a.png) 2X)', 'image-set(url(a.png) 2x)'],

    // Strings, URLs, hashes and identifiers stay as written
    ["'10PX'", "'10PX'"],
    ['url(/A10PX.png)', 'url(/A10PX.png)'],
    ['#1E3A8A', '#1E3A8A'],
    ['theme(spacing.10PX)', 'theme(spacing.10PX)'],
    ['--My-Var-1A', '--My-Var-1A'],
    ['U+1F600', 'U+1F600'],

    // Dashed units are case-sensitive
    ['10--Foo', '10--Foo'],
  ])('%s', (input, output) => {
    expect(normalizeUnits(input)).toBe(output)
  })
})

describe('normalizeUrlSchemes', () => {
  it.each([
    // URL schemes are case-insensitive
    ['url(HTTPS://example.com/A.png)', 'url(https://example.com/A.png)'],
    ["url('HTTP://example.com/A.png')", "url('http://example.com/A.png')"],
    ['url("DATA:image/png;base64,AA==")', 'url("data:image/png;base64,AA==")'],
    [
      'url(HTTPS://example.com/A.png),url(HTTP://example.com/B.png)',
      'url(https://example.com/A.png),url(http://example.com/B.png)',
    ],
    [
      'image-set(url(HTTPS://example.com/A.png) 1x)',
      'image-set(url(https://example.com/A.png) 1x)',
    ],
    [
      'var(--my-image,url(HTTPS://example.com/A.png))',
      'var(--my-image,url(https://example.com/A.png))',
    ],

    // The rest of a URL stays as written
    ['url(https://Example.com/A.png)', 'url(https://Example.com/A.png)'],
    ['url(./HTTP-Image.png)', 'url(./HTTP-Image.png)'],
    ['url(C:/Images/A.png)', 'url(C:/Images/A.png)'],
    ['url(var(--MY-URL))', 'url(var(--MY-URL))'],

    // Strings and other functions stay as written
    ["'url(HTTPS://example.com/A.png)'", "'url(HTTPS://example.com/A.png)'"],
    ['--my-url(HTTPS://example.com/A.png)', '--my-url(HTTPS://example.com/A.png)'],
  ])('%s', (input, output) => {
    expect(normalizeUrlSchemes(input)).toBe(output)
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

    // With percentages
    ['calc(100%-var(--foo))', 'calc(100% - var(--foo))'],

    // With uppercase units
    ['calc(100PX-theme(spacing.1))', 'calc(100PX - theme(spacing.1))'],

    // Preserving CSS keyword tokens like fit-content without splitting around hyphens in complex expressions
    ['min(fit-content,calc(100dvh-4rem))', 'min(fit-content, calc(100dvh - 4rem))'],
    [
      'min(theme(spacing.foo-bar),fit-content,calc(20*calc(40-30)))',
      'min(theme(spacing.foo-bar), fit-content, calc(20 * calc(40 - 30)))',
    ],
    [
      'min(fit-content,calc(100dvh-4rem)-calc(50dvh--2px))',
      'min(fit-content, calc(100dvh - 4rem) - calc(50dvh - -2px))',
    ],
    ['min(-3.4e-2-var(--foo),calc-size(auto))', 'min(-3.4e-2 - var(--foo), calc-size(auto))'],
    [
      'clamp(-10e3-var(--foo),calc-size(max-content),var(--foo)+-10e3)',
      'clamp(-10e3 - var(--foo), calc-size(max-content), var(--foo) + -10e3)',
    ],

    // A negative number immediately after a `,` should not have spaces inserted
    ['clamp(-3px+4px,-3px+4px,-3px+4px)', 'clamp(-3px + 4px, -3px + 4px, -3px + 4px)'],

    // Prevent formatting inside `var()` functions
    ['calc(var(--foo-bar-bar)*2)', 'calc(var(--foo-bar-bar) * 2)'],

    // Prevent formatting inside `env()` functions
    ['calc(env(safe-area-inset-bottom)*2)', 'calc(env(safe-area-inset-bottom) * 2)'],

    // Handle dashed functions that look like known dashed idents
    [
      'fit-content(min(max-content,max(min-content,calc(20px+1em))))',
      'fit-content(min(max-content, max(min-content, calc(20px + 1em))))',
    ],

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
    ['round(to-zero,1+2,1+3)', 'round(to-zero, 1 + 2, 1 + 3)'],

    // abs(…) and sign(…) functions
    ['abs(20%-100px)', 'abs(20% - 100px)'],
    ['sign(10px-20px)', 'sign(10px - 20px)'],
    ['calc(abs(1rem-2rem)*2)', 'calc(abs(1rem - 2rem) * 2)'],
    ['calc(1px*sign(var(--x)-50%))', 'calc(1px * sign(var(--x) - 50%))'],

    // Nested parens in non-math functions don't format their contents
    ['env((safe-area-inset-bottom))', 'env((safe-area-inset-bottom))'],

    // `-infinity` is a keyword and should not have spaces around the `-`
    ['atan(1 + -infinity)', 'atan(1 + -infinity)'],

    // A `-` before a math function can be an operator or a sign
    ['calc(1px-min(2px,3px))', 'calc(1px - min(2px, 3px))'],
    ['calc(100%-min(2px,3px))', 'calc(100% - min(2px, 3px))'],
    ['calc(1px*-min(2px,3px))', 'calc(1px * -min(2px, 3px))'],

    // Custom functions whose name ends in a math function name are not math
    // functions
    ['--my-calc(1px-2px)', '--my-calc(1px-2px)'],
    ['--item-rem(1px-2px,3px)', '--item-rem(1px-2px,3px)'],
    ['--calc(1px-2px)', '--calc(1px-2px)'],
    ['--my-calc(calc(1px-2px))', '--my-calc(calc(1px - 2px))'],
    ['calc(--my-min(1px-2px)+3px)', 'calc(--my-min(1px-2px) + 3px)'],
    ['--my-Calc(1px-2px)', '--my-Calc(1px-2px)'],

    // Function names are case-insensitive, so we print them in lowercase
    ['Asin(0.5+0.2)', 'asin(0.5 + 0.2)'],
    ['Calc(1px+min(2px,3px))', 'calc(1px + min(2px, 3px))'],
    ['CALC(1px+2px)', 'calc(1px + 2px)'],
  ]

  it.each(table)('%s', (input, output) => {
    expect(decodeArbitraryValue(input)).toBe(output)
  })
})
