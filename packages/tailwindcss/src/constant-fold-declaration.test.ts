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
