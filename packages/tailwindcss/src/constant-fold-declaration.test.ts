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

  // Nested partial evaluation
  ['calc(calc(1 + 2) + 2rem)', 'calc(3 + 2rem)'],

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
  ['calc(-0px * -1)'],

  // Zeroes
  ['0px'],
  ['0rem'],
  ['0em'],
  ['0dvh'],
  ['-0'],
  ['+0'],
  ['-0.0rem'],
  ['+0.00rem'],
])('should constant fold `%s` to `0`', (input) => {
  expect(constantFoldDeclaration(input)).toBe('0')
})

it.each([
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
