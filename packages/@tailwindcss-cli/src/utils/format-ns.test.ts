import { expect, it } from 'vitest'
import { formatNanoseconds } from './format-ns'

it.each([
  [0, '0ns'],
  [1, '1ns'],
  [999, '999ns'],
  [1000, '1µs'],
  [1001, '1µs'],
  [999999, '999µs'],
  [1000000, '1ms'],
  [1000001, '1ms'],
  [999999999, '999ms'],
  [1000000000, '1s'],
  [1000000001, '1s'],
  [59999999999, '59s'],
  [60000000000, '1m'],
  [60000000001, '1m'],
  [3599999999999n, '59m'],
  [3600000000000n, '1h'],
  [3600000000001n, '1h'],
  [86399999999999n, '23h'],
  [86400000000000n, '1d'],
  [86400000000001n, '1d'],
  [8640000000000000n, '100d'],
])('should format %s nanoseconds as %s', (ns, expected) => {
  expect(formatNanoseconds(ns)).toBe(expected)
})
