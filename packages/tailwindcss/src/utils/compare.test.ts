import { expect, it } from 'vitest'
import { compare } from './compare'

const LESS = -1
const EQUAL = 0
const GREATER = 1

it.each([
  // Same strings
  ['abc', 'abc', EQUAL],

  // Shorter string comes first
  ['abc', 'abcd', LESS],

  // Longer string comes first
  ['abcd', 'abc', GREATER],

  // Numbers
  ['1', '1', EQUAL],
  ['1', '2', LESS],
  ['2', '1', GREATER],
  ['1', '10', LESS],
  ['10', '1', GREATER],
])('should compare "%s" with "%s" as "%d"', (a, b, expected) => {
  expect(Math.sign(compare(a, b))).toBe(expected)
})

it('should sort strings with numbers consistently using the `compare` function', () => {
  expect(
    ['p-0', 'p-0.5', 'p-1', 'p-1.5', 'p-10', 'p-12', 'p-2', 'p-20', 'p-21']
      .sort(() => Math.random() - 0.5) // Shuffle the array
      .sort(compare), // Sort the array
  ).toMatchInlineSnapshot(`
    [
      "p-0",
      "p-0.5",
      "p-1",
      "p-1.5",
      "p-2",
      "p-10",
      "p-12",
      "p-20",
      "p-21",
    ]
  `)
})
