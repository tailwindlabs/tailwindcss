import { expect, test } from 'vitest'
import { type DesignSystem } from './design-system'
import { __unstable__loadDesignSystem } from './index'

function loadDesign() {
  return __unstable__loadDesignSystem(`
    @theme {
      --spacing-1: 0.25rem;
      --spacing-3: 0.75rem;
      --spacing-4: 1rem;
      --color-red-500: red;
      --color-blue-500: blue;
    }
  `)
}

const table = [
  // Utilities
  ['py-3 p-1 px-3', 'p-1 px-3 py-3'],

  // Utilities with variants
  ['px-3 focus:hover:p-3 hover:p-1 py-3', 'px-3 py-3 hover:p-1 focus:hover:p-3'],

  // Utilities with important
  ['px-3 py-4! p-1', 'p-1 px-3 py-4!'],
  ['py-4! px-3 p-1', 'p-1 px-3 py-4!'],

  // User CSS order is the same and moved to the front
  ['b p-1 a', 'b a p-1'],
  ['hover:b focus:p-1 a', 'hover:b a focus:p-1'],

  // Add special treatment for `group`, `peer`, and `dark`
  // ['peer a underline', 'a peer underline'],
  // ['group a underline', 'a group underline'],
  // ['dark a underline', 'a dark underline'],
] as const

test.each(table)('sorts classes: "%s" -> "%s"', async (input, expected) => {
  expect(sortClasses(input, await loadDesign())).toEqual(expected)
})

test.skip('group, peer, and dark have their own order', async () => {
  let input = shuffle(['group', 'peer', 'dark']).join(' ')
  expect(sortClasses(input, await loadDesign())).toEqual('dark group peer')
})

test('can sort classes deterministically across multiple class lists', async () => {
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

  // Shared design
  let design = await loadDesign()
  for (const [input, output] of classes) {
    expect(sortClasses(input, design)).toEqual(output)
  }

  // Fresh design
  for (const [input, output] of classes) {
    expect(sortClasses(input, await loadDesign())).toEqual(output)
  }
})

test('sorts arbitrary values across one or more class lists consistently', async () => {
  let classes = [
    ['[--fg:#fff]', '[--fg:#fff]'],
    ['[--bg:#111] [--bg_hover:#000] [--fg:#fff]', '[--bg:#111] [--bg_hover:#000] [--fg:#fff]'],
  ]

  // Shared design
  let design = await loadDesign()
  for (const [input, output] of classes) {
    expect(sortClasses(input, design)).toEqual(output)
  }

  // Fresh design
  for (const [input, output] of classes) {
    expect(sortClasses(input, await loadDesign())).toEqual(output)
  }
})

function sortClasses(input: string, design: DesignSystem) {
  return defaultSort(design.getClassOrder(input.split(' ')))
}

/**
 * This is a function that the prettier-plugin-tailwindcss would use. It would
 * do the actual sorting based on the classes and order we return from `getClassOrder`.
 *
 * This way the actual sorting logic is done in the plugin which allows you to
 * put unknown classes at the end for example.
 */
function defaultSort(arrayOfTuples: [string, bigint | null][]): string {
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

function bigSign(value: bigint) {
  if (value > 0n) {
    return 1
  } else if (value === 0n) {
    return 0
  } else {
    return -1
  }
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.round(Math.random() * i)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}
