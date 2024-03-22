import resolveConfig from '../src/public/resolve-config'
import { createContext } from '../src/lib/setupContextUtils'
import bigSign from '../src/util/bigSign'

/**
 * This is a function that the prettier-plugin-tailwindcss would use. It would
 * do the actual sorting based on the classes and order we return from `getClassOrder`.
 *
 * This way the actual sorting logic is done in the plugin which allows you to
 * put unknown classes at the end for example.
 *
 * @param {Array<[string, bigint]>} arrayOfTuples
 * @returns {string}
 */
function defaultSort(arrayOfTuples) {
  return arrayOfTuples
    .sort(([, a], [, z]) => {
      if (a === z) return 0
      if (a === null) return -1
      if (z === null) return 1
      return bigSign(a - z)
    })
    .map(([className]) => className)
    .join(' ')
}

it('should return a list of tuples with the sort order', () => {
  let input = 'font-bold underline hover:font-medium unknown'
  let config = {}
  let context = createContext(resolveConfig(config))
  expect(context.getClassOrder(input.split(' '))).toEqual([
    ['font-bold', expect.any(BigInt)],
    ['underline', expect.any(BigInt)],
    ['hover:font-medium', expect.any(BigInt)],

    // Unknown values receive `null`
    ['unknown', null],
  ])
})

it.each([
  // Utitlies
  ['px-3 p-1 py-3', 'p-1 px-3 py-3'],

  // Utitlies and components
  ['px-4 container', 'container px-4'],

  // Utilities with variants
  ['px-3 focus:hover:p-3 hover:p-1 py-3', 'px-3 py-3 hover:p-1 focus:hover:p-3'],

  // Utitlies with important
  ['px-3 !py-4', '!py-4 px-3'],
  ['!py-4 px-3', '!py-4 px-3'],

  // Components with variants
  ['hover:container container', 'container hover:container'],

  // Components and utilities with variants
  [
    'focus:hover:container hover:underline hover:container p-1',
    'p-1 hover:container focus:hover:container hover:underline',
  ],

  // Leave user css order alone, and move to the front
  ['b p-1 a', 'b a p-1'],
  ['hover:b focus:p-1 a', 'hover:b a focus:p-1'],

  // Add special treatment for `group` and `peer`
  ['a peer container underline', 'a peer container underline'],
])('should sort "%s" based on the order we generate them in to "%s"', (input, output) => {
  let config = {}
  let context = createContext(resolveConfig(config))
  expect(defaultSort(context.getClassOrder(input.split(' ')))).toEqual(output)
})

it.each([
  // Utitlies
  ['tw-px-3 tw-p-1 tw-py-3', 'tw-p-1 tw-px-3 tw-py-3'],

  // Utitlies and components
  ['tw-px-4 tw-container', 'tw-container tw-px-4'],

  // Utilities with variants
  [
    'tw-px-3 focus:hover:tw-p-3 hover:tw-p-1 tw-py-3',
    'tw-px-3 tw-py-3 hover:tw-p-1 focus:hover:tw-p-3',
  ],

  // Utitlies with important
  ['tw-px-3 !tw-py-4', '!tw-py-4 tw-px-3'],
  ['!tw-py-4 tw-px-3', '!tw-py-4 tw-px-3'],

  // Components with variants
  ['hover:tw-container tw-container', 'tw-container hover:tw-container'],

  // Components and utilities with variants
  [
    'focus:hover:tw-container hover:tw-underline hover:tw-container tw-p-1',
    'tw-p-1 hover:tw-container focus:hover:tw-container hover:tw-underline',
  ],

  // Leave user css order alone, and move to the front
  ['b tw-p-1 a', 'b a tw-p-1'],
  ['hover:b focus:tw-p-1 a', 'hover:b a focus:tw-p-1'],

  // Add special treatment for `group` and `peer`
  ['a tw-peer tw-container tw-underline', 'a tw-peer tw-container tw-underline'],
])(
  'should sort "%s" with prefixex based on the order we generate them in to "%s"',
  (input, output) => {
    let config = { prefix: 'tw-' }
    let context = createContext(resolveConfig(config))
    expect(defaultSort(context.getClassOrder(input.split(' ')))).toEqual(output)
  }
)

it('sorts classes deterministically across multiple class lists', () => {
  let classes = [
    [
      'a-class px-3 p-1 b-class py-3 bg-red-500 bg-blue-500',
      'a-class b-class bg-blue-500 bg-red-500 p-1 px-3 py-3',
    ],
    [
      'px-3 b-class p-1 py-3 bg-blue-500 a-class bg-red-500',
      'b-class a-class bg-blue-500 bg-red-500 p-1 px-3 py-3',
    ],
  ]

  let config = {}

  // Same context, different class lists
  let context = createContext(resolveConfig(config))
  for (const [input, output] of classes) {
    expect(defaultSort(context.getClassOrder(input.split(' ')))).toEqual(output)
  }

  // Different context, different class lists
  for (const [input, output] of classes) {
    context = createContext(resolveConfig(config))
    expect(defaultSort(context.getClassOrder(input.split(' ')))).toEqual(output)
  }
})

it('sorts based on first occurence of a candidate / rule', () => {
  let classes = [
    ['foo-1 foo', 'foo foo-1'],
    ['bar', 'bar'],
    ['foo-1 foo', 'foo foo-1'],
  ]

  let config = {
    theme: {},
    plugins: [
      function ({ addComponents }) {
        addComponents({
          '.foo': { display: 'block' },
          '.foo-1': { display: 'block' },
          '.bar': { display: 'block' },

          // This rule matches both the candidate `foo` and `bar`
          // But when sorting `foo` — we've already got a
          // position for `foo` so we should use it
          '.bar .foo': { display: 'block' },
        })
      },
    ],
  }

  // Same context, different class lists
  let context = createContext(resolveConfig(config))
  for (const [input, output] of classes) {
    expect(defaultSort(context.getClassOrder(input.split(' ')))).toEqual(output)
  }

  // Different context, different class lists
  for (const [input, output] of classes) {
    context = createContext(resolveConfig(config))
    expect(defaultSort(context.getClassOrder(input.split(' ')))).toEqual(output)
  }
})

it('Sorting is unchanged when multiple candidates share the same rule / object', () => {
  let classes = [
    ['x y', 'x y'],
    ['a', 'a'],
    ['x y', 'x y'],
  ]

  let config = {
    theme: {},
    plugins: [
      function ({ addComponents }) {
        addComponents({
          '.x': { color: 'red' },
          '.a': { color: 'red' },

          // This rule matches both the candidate `a` and `y`
          // When sorting x and y first we would keep that sort order
          // Then sorting `a` we would end up replacing the candidate on the rule
          // Thus causing `y` to no longer have a sort order causing it to be sorted
          // first by accident
          '.y .a': { color: 'red' },
        })
      },
    ],
  }

  // Same context, different class lists
  let context = createContext(resolveConfig(config))
  for (const [input, output] of classes) {
    expect(defaultSort(context.getClassOrder(input.split(' ')))).toEqual(output)
  }

  // Different context, different class lists
  for (const [input, output] of classes) {
    context = createContext(resolveConfig(config))
    expect(defaultSort(context.getClassOrder(input.split(' ')))).toEqual(output)
  }
})

it('sorts arbitrary values across one or more class lists consistently', () => {
  let classes = [
    ['[--fg:#fff]', '[--fg:#fff]'],
    ['[--bg:#111] [--bg_hover:#000] [--fg:#fff]', '[--bg:#111] [--bg_hover:#000] [--fg:#fff]'],
  ]

  let config = {
    theme: {},
  }

  // Same context, different class lists
  let context = createContext(resolveConfig(config))
  for (const [input, output] of classes) {
    expect(defaultSort(context.getClassOrder(input.split(' ')))).toEqual(output)
  }

  // Different context, different class lists
  for (const [input, output] of classes) {
    context = createContext(resolveConfig(config))
    expect(defaultSort(context.getClassOrder(input.split(' ')))).toEqual(output)
  }
})
