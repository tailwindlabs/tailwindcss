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

  // Numbers of different lengths
  ['75', '700', LESS],
  ['700', '75', GREATER],
  ['75', '770', LESS],
  ['770', '75', GREATER],
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

it('should sort strings with modifiers consistently using the `compare` function', () => {
  expect(
    [
      'text-5xl',
      'text-6xl',
      'text-6xl/loose',
      'text-6xl/wide',
      'bg-red-500',
      'bg-red-500/50',
      'bg-red-500/70',
      'bg-red-500/60',
      'bg-red-50',
      'bg-red-50/50',
      'bg-red-50/70',
      'bg-red-50/60',
    ]
      .sort(() => Math.random() - 0.5) // Shuffle the array
      .sort(compare), // Sort the array
  ).toMatchInlineSnapshot(`
    [
      "bg-red-50",
      "bg-red-50/50",
      "bg-red-50/60",
      "bg-red-50/70",
      "bg-red-500",
      "bg-red-500/50",
      "bg-red-500/60",
      "bg-red-500/70",
      "text-5xl",
      "text-6xl",
      "text-6xl/loose",
      "text-6xl/wide",
    ]
  `)
})

it('should sort strings with multiple numbers consistently using the `compare` function', () => {
  expect(
    [
      'foo-123-bar-456-baz-789',
      'foo-123-bar-456-baz-788',
      'foo-123-bar-456-baz-790',
      'foo-123-bar-455-baz-789',
      'foo-123-bar-456-baz-789',
      'foo-123-bar-457-baz-789',
      'foo-123-bar-456-baz-789',
      'foo-124-bar-456-baz-788',
      'foo-125-bar-456-baz-790',
      'foo-126-bar-455-baz-789',
      'foo-127-bar-456-baz-789',
      'foo-128-bar-457-baz-789',
      'foo-1-bar-2-baz-3',
      'foo-12-bar-34-baz-45',
      'foo-12-bar-34-baz-4',
      'foo-12-bar-34-baz-456',
    ]
      .sort(() => Math.random() - 0.5) // Shuffle the array
      .sort(compare), // Sort the array
  ).toMatchInlineSnapshot(`
    [
      "foo-1-bar-2-baz-3",
      "foo-12-bar-34-baz-4",
      "foo-12-bar-34-baz-45",
      "foo-12-bar-34-baz-456",
      "foo-123-bar-455-baz-789",
      "foo-123-bar-456-baz-788",
      "foo-123-bar-456-baz-789",
      "foo-123-bar-456-baz-789",
      "foo-123-bar-456-baz-789",
      "foo-123-bar-456-baz-790",
      "foo-123-bar-457-baz-789",
      "foo-124-bar-456-baz-788",
      "foo-125-bar-456-baz-790",
      "foo-126-bar-455-baz-789",
      "foo-127-bar-456-baz-789",
      "foo-128-bar-457-baz-789",
    ]
  `)
})

it('sort is stable', () => {
  // Heap's algorithm for permutations
  function* permutations<T>(input: T[]) {
    let pos = 1
    let stack = input.map(() => 0)

    yield input.slice()

    while (pos < input.length) {
      if (stack[pos] < pos) {
        let k = pos % 2 == 0 ? 0 : stack[pos]
        ;[input[k], input[pos]] = [input[pos], input[k]]
        yield input.slice()
        ++stack[pos]
        pos = 1
      } else {
        stack[pos] = 0
        ++pos
      }
    }
  }

  let classes = ['duration-initial', 'duration-75', 'duration-150', 'duration-700', 'duration-1000']

  for (let permutation of permutations(classes)) {
    let sorted = [...permutation].sort(compare)
    expect(sorted).toEqual([
      'duration-75',
      'duration-150',
      'duration-700',
      'duration-1000',
      'duration-initial',
    ])
  }
})
