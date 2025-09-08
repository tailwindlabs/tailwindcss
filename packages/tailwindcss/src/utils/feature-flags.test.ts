import { describe, expect, test } from 'vitest'
import { greaterThanOrEqual } from './feature-flags'

describe('featureFlagVersion', () => {
  test.each([
    ['1.2.3', '1.2.3', true], // Equal

    ['1.2.3', '1.2.4', false], // Smaller patch
    ['1.2.3', '1.3.0', false], // Smaller minor
    ['1.2.3', '2.0.0', false], // Smaller major

    ['1.2.4', '1.2.4', true], // Greater patch
    ['1.3.0', '1.3.0', true], // Greater minor
    ['2.0.0', '2.0.0', true], // Greater major

    ['0.0.0-insiders.12345', '0.0.0-insiders.54321', true], // Equal version and pre-release
    ['0.0.0-alpha.12345', '0.0.0-beta.54321', false], // Pre-release doesn't match

    ['1.2.3-alpha.1', '1.2.3-beta.1', false], // Pre-release doesn't match
    ['1.0.0-alpha.1', '2.0.0-beta.1', false], // Pre-release doesn't match
    ['2.0.0-alpha.1', '1.0.0-beta.1', true], // Pre-release doesn't match, but greater major
  ])('featureFlagVersion(%s, %s) === %s', (a, b, expected) => {
    expect(greaterThanOrEqual(a, b)).toBe(expected)
  })
})
