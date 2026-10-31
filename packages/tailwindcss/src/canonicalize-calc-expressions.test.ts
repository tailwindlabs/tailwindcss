import { expect, it } from 'vitest'
import { canonicalizeCalcExpressions } from './canonicalize-calc-expressions'

it.each([
  ['calc(-1 * var(--foo))', 'calc(var(--foo) * -1)'],
  ['calc(1rem + var(--foo))', 'calc(var(--foo) + 1rem)'],
  ['calc(2rem * calc(3px * var(--foo)))', 'calc(calc(var(--foo) * 3px) * 2rem)'],
  ['calc(var(--b) + var(--a))', 'calc(var(--a) + var(--b))'],
  ['calc(3px * 2rem)', 'calc(2rem * 3px)'],
  ['calc(5px * 3px)', 'calc(3px * 5px)'],
  ['calc(1 * 1rem)', 'calc(1rem * 1)'],
  ['calc(10 + 2)', 'calc(2 + 10)'],
])('`%s` → `%s` (%#)', (input, expected) => {
  expect(canonicalizeCalcExpressions(input)).toBe(expected)
})

it.each([
  ['calc(1rem - var(--foo))'],
  ['calc(1rem / 2)'],
  ['calc(var(--a) + 1rem)'],
  ['calc(2rem * 3px)'],
])('should keep `%s` (%#)', (input) => {
  expect(canonicalizeCalcExpressions(input)).toBe(input)
})
