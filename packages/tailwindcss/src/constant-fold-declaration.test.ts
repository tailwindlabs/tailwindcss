import { expect, it } from 'vitest'
import { constantFoldDeclaration } from './constant-fold-declaration'

it.each([
  // Simple expression
  ['calc(1 + 1)', '2'],
  ['calc(3 - 2)', '1'],
  ['calc(2 * 3)', '6'],
  ['calc(8 / 2)', '4'],

  // Nested
  ['calc(1 + calc(1 + 1))', '3'],
  ['calc(3 - calc(1 + 2))', '0'],
  ['calc(2 * calc(1 + 3))', '8'],
  ['calc(8 / calc(2 + 2))', '2'],
  ['calc(1 + (1 + 1))', '3'],
  ['calc(3 - (1 + 2))', '0'],
  ['calc(2 * (1 + 3))', '8'],
  ['calc(8 / (2 + 2))', '2'],

  // With units
  ['calc(1rem * 2)', '2rem'],
  ['calc(2rem - 0.5rem)', '1.5rem'],
  ['calc(3rem * 6)', '18rem'],
  ['calc(5rem / 2)', '2.5rem'],

  // Negating with units
  ['calc(2rem * -1)', '-2rem'],
  ['calc(-1 * 2rem)', '-2rem'],

  // Nested partial evaluation
  ['calc(calc(1 + 2) + 2rem)', 'calc(3 + 2rem)'],

  // Nested multiplication with unknown values
  ['calc(2 * calc(3 * var(--foo)))', 'calc(6 * var(--foo))'],
  ['calc(calc(3 * var(--foo)) * 2)', 'calc(6 * var(--foo))'],
  ['calc(2rem * calc(3 * var(--foo)))', 'calc(6rem * var(--foo))'],

  // Nested addition with unknown values
  ['calc(1rem + calc(2rem + var(--foo)))', 'calc(3rem + var(--foo))'],
  ['calc(calc(2rem + var(--foo)) + 1rem)', 'calc(3rem + var(--foo))'],

  // Nested multiplication can collapse away entirely
  ['calc(-1 * calc(-1 * var(--foo)))', 'var(--foo)'],
  ['calc(calc(-1 * var(--foo)) * -1)', 'var(--foo)'],
  ['calc(-1 * calc(var(--foo) * -1))', 'var(--foo)'],
  ['calc(-1 * (-1 * var(--foo)))', 'var(--foo)'],
  ['calc(1 * var(--foo))', 'var(--foo)'],
  ['calc(var(--foo) * 1)', 'var(--foo)'],

  // Evaluation only handles two operands right now, this can change in the future
  ['calc(1 + 2 + 3)', 'calc(1 + 2 + 3)'],
])('should constant fold `%s` into `%s`', (input, expected) => {
  expect(constantFoldDeclaration(input)).toBe(expected)
})

it.each([
  ['calc(1rem * 2%)'],
  ['calc(1rem * 2px)'],
  ['calc(2rem - 6)'],
  ['calc(3rem * 3dvw)'],
  ['calc(3rem * 2dvh)'],
  ['calc(5rem / 17px)'],
  ['calc(2rem * calc(3px * var(--foo)))'],
  ['calc(1rem + 0px + var(--foo))'],
])('should not constant fold different units `%s`', (input) => {
  expect(constantFoldDeclaration(input)).toBe(input)
})

it.each([
  ['calc(0 * 100vw)'],
  ['calc(0 * calc(1 * 2))'],
  ['calc(0 * var(--foo))'],
  ['calc(0 * calc(var(--spacing) * 32))'],

  ['calc(100vw * 0)'],
  ['calc(calc(1 * 2) * 0)'],
  ['calc(var(--foo) * 0)'],
  ['calc(calc(var(--spacing, 0.25rem) * 32) * 0)'],
  ['calc(var(--spacing, 0.25rem) * -0)'],

  // Zeroes
  ['0px'],
  ['0rem'],
  ['0em'],
  ['0dvh'],
  ['-0'],
  ['+0'],
  ['-0.0rem'],
  ['+0.00rem'],

  // Expressions
  ['calc(-0px * -1)'],
  ['calc(-1 * -0px)'],
])('should constant fold `%s` to `0` (%#)', (input) => {
  expect(constantFoldDeclaration(input)).toBe('0')
})

it.each([
  // Expressions, keep unit when they are nested
  //
  // TODO: We might be able to fold this further to just `1rem`, but we can't do
  // that for any `0<unit>`. E.g.: `calc(0s + 1rem)` which is invalid, would
  // become valid if we just use `1rem`.
  ['calc(calc(0px * -1) + 1rem)', 'calc(0px + 1rem)'],
  ['calc(calc(-1 * 0px) + 1rem)', 'calc(0px + 1rem)'],

  // Non-foldable units
  ['0deg', '0deg'],
  ['0rad', '0deg'],
  ['0%', '0%'],
  ['0turn', '0deg'],
  ['0fr', '0fr'],
  ['0ms', '0s'],
  ['0s', '0s'],
  ['-0.0deg', '0deg'],
  ['-0.0rad', '0deg'],
  ['-0.0%', '0%'],
  ['-0.0turn', '0deg'],
  ['-0.0fr', '0fr'],
  ['-0.0ms', '0s'],
  ['-0.0s', '0s'],
])('should not fold non-foldable units to `0`. Constant fold `%s` into `%s`', (input, expected) => {
  expect(constantFoldDeclaration(input)).toBe(expected)
})

it('should not constant fold when dividing by `0`', () => {
  expect(constantFoldDeclaration('calc(123rem / 0)')).toBe('calc(123rem / 0)')
})

it('should not constant fold when a computation has a high-precision result', () => {
  expect(constantFoldDeclaration('calc(100% / 3.5)')).toBe('calc(100% / 3.5)')
})

it('should constant fold division results with floating-point error after scaling', () => {
  expect(constantFoldDeclaration('calc(29% / 100)')).toBe('0.29%')
})

it.each([
  // addition
  ['calc(0.1 + 0.2)', '0.3'],
  ['calc(0.1rem + 0.2rem)', '0.3rem'],
  ['calc(0.7 + 0.1)', '0.8'],
  ['calc(0.57 + 1)', '1.57'],

  // subtraction
  ['calc(0.3 - 0.1)', '0.2'],
  ['calc(4.35 - 4)', '0.35'],
  ['calc(1.1rem - 1rem)', '0.1rem'],

  // subtraction with catastrophic cancellation
  ['calc(100.1 - 100)', '0.1'],

  // multiplication
  ['calc(0.1 * 3)', '0.3'],
  ['calc(0.1 * 0.1)', '0.01'],
  ['calc(1.1 * 1.1)', '1.21'],
  ['calc(0.07 * 100)', '7'],
  ['calc(1.15 * 100)', '115'],
  ['calc(4.35 * 100)', '435'],
  ['calc(0.1rem * 0.2)', '0.02rem'],

  // division
  ['calc(0.3 / 0.1)', '3'],
  ['calc(0.7 / 0.1)', '7'],
  ['calc(0.6 / 3)', '0.2'],
  ['calc(0.69 / 3)', '0.23'],
  ['calc(3.3 / 1.1)', '3'],
  ['calc(4.8px / 1.6)', '3px'],
  ['calc(-1 / 4)', '-0.25'],

  // nested re-association
  ['calc(0.1 * calc(3 * var(--foo)))', 'calc(0.3 * var(--foo))'],
  ['calc(0.1rem + calc(0.2rem + var(--foo)))', 'calc(0.3rem + var(--foo))'],
])('should constant fold `%s` into `%s` without floating-point noise', (input, expected) => {
  expect(constantFoldDeclaration(input)).toBe(expected)
})

it.each([
  // more than 2 decimals
  ['calc(10 / 3)', 'calc(10 / 3)'],
  ['calc(1 / 8)', 'calc(1 / 8)'],
  ['calc(1rem / 3)', 'calc(1rem / 3)'],

  // dividing by (negative) zero
  ['calc(1 / 0.0)', 'calc(1 / 0)'],
  ['calc(1 / -0.0)', 'calc(1 / 0)'],
])(
  'should not constant fold division `%s` that exceeds 2 decimals or divides by zero',
  (input, expected) => {
    expect(constantFoldDeclaration(input)).toBe(expected)
  },
)

it.each([
  // rem with a root font-size that isn't a power of 2
  ['0.1rem', 14, '1.4px'],
  ['0.7rem', 14, '9.8px'],
  ['1.1rem', 14, '15.4px'],
  ['0.35rem', 14, '4.9px'],
  ['0.3rem', 18, '5.4px'],
  ['calc(0.1rem + 0.2rem)', 16, '4.8px'],
  ['calc(3 * 0.1rem)', 16, '4.8px'],
])(
  'should canonicalize `%s` with rem `%s` into `%s` without floating-point noise',
  (input, rem, expected) => {
    expect(constantFoldDeclaration(input, rem)).toBe(expected)
  },
)

it.each([
  // terminating conversions are exact
  ['0.1in', '9.6px'],
  ['25.4mm', '96px'],
  ['101.6q', '96px'],
  ['0.3pt', '0.4px'],
  ['0.0001ms', '0.0000001s'],
])('should convert `%s` into `%s` without floating-point noise', (input, expected) => {
  expect(constantFoldDeclaration(input)).toBe(expected)
})

it('should convert equivalent lengths into the same canonical value', () => {
  expect(constantFoldDeclaration('10mm')).toBe(constantFoldDeclaration('1cm'))
  expect(constantFoldDeclaration('40q')).toBe(constantFoldDeclaration('1cm'))
  expect(constantFoldDeclaration('5mm')).toBe(constantFoldDeclaration('0.5cm'))
})

it.each([
  ['1rad', '57.2957795131deg'],
  ['3.141592653589793rad', '180deg'],

  // rounding to 10 decimals treats values that differ by less than that as
  // equal, like π/4 truncated to 12 digits is 44.999999999974314deg
  ['0.785398163397rad', '45deg'],
])('should convert angle `%s` into `%s` rounded to 10 decimals', (input, expected) => {
  expect(constantFoldDeclaration(input)).toBe(expected)
})

it.each([
  // would need more than 16 digits after rounding to 10 decimals
  ['1000000pt'],
  ['100000cm'],
])('should not convert `%s` when the result is too large to be exact', (input) => {
  expect(constantFoldDeclaration(input)).toBe(input)
})

it.each([
  // not a safe integer once scaled
  [0.30000000000000004],

  // stringifies to 1e+21
  [1e21],
])('should not convert `rem` when the root font-size is `%s`', (rem) => {
  expect(constantFoldDeclaration('1rem', rem)).toBe('1rem')
})

it.each([
  ['calc(0.000001 * 0.1)', '0.0000001'],
  ['calc(0.0000001 + 0)', '0.0000001'],
  ['calc(calc(0.000001 * 0.1) * 10)', '0.000001'],
])('should not use exponent notation when folding `%s`', (input, expected) => {
  expect(constantFoldDeclaration(input)).toBe(expected)
})

it.each([
  // beyond Number.MAX_SAFE_INTEGER`
  ['9007199254740993', '9007199254740993'],
  ['calc(9007199254740993 + 0)', 'calc(9007199254740993 + 0)'],

  //beyond Number.MAX_VALUE
  ['a 400 digit number', '9'.repeat(400)],
  ['a product of two 200 digit numbers', `calc(${'9'.repeat(200)}px * ${'9'.repeat(200)})`],
])('should not lose precision or overflow when folding %s', (_, input) => {
  let output = constantFoldDeclaration(input)
  expect(output).not.toMatch(/Infinity|NaN|e[+-]?\d/)
  expect(output).not.toContain('9007199254740992')
})
