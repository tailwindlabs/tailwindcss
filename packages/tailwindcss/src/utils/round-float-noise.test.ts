import { expect, it } from 'vitest'
import { roundFloatNoise } from './round-float-noise'

it.each([
  [0.1 + 0.2, 0.3], // +
  [0.3 - 0.1, 0.2], // -
  [0.1 * 3, 0.3], // *
  [0.3 / 3, 0.1], // /
  [-(0.1 + 0.2), -0.3], // negative
])('should drop floating point noise from `%s` into `%s`', (input, expected) => {
  expect(roundFloatNoise(input)).toBe(expected)
})

it.each([0, -0, 1, -1, 42, 100000000000000, 1e21])('should keep the integer `%s`', (input) => {
  expect(roundFloatNoise(input)).toBe(input)
})

it.each([0.5, 0.25, 1.21, 28.5714285714286, -3.75])('should keep the clean value `%s`', (input) => {
  expect(roundFloatNoise(input)).toBe(input)
})

it.each([1e-12, 1e-300, 1.5e-7, 123456789.123])(
  'should keep small and large values intact `%s`',
  (input) => {
    expect(roundFloatNoise(input)).toBe(input)
  },
)

it.each([Infinity, -Infinity])('should keep `%s`', (input) => {
  expect(roundFloatNoise(input)).toBe(input)
})

it('should keep `NaN`', () => {
  expect(roundFloatNoise(NaN)).toBeNaN()
})
