import resolveConfig from '../src/public/resolve-config'
import { createContext } from '../src/lib/setupContextUtils'

it.each([
  // Utitlies
  ['px-3 p-1 py-3', 'p-1 px-3 py-3'],

  // Utitlies and components
  ['px-4 container', 'container px-4'],

  // Utilities with variants
  ['px-3 focus:hover:p-3 hover:p-1 py-3', 'px-3 py-3 hover:p-1 focus:hover:p-3'],

  // Utitlies with important
  ['px-3 !py-4', 'px-3 !py-4'],
  ['!py-4 px-3', '!py-4 px-3'],

  // Components with variants
  ['hover:container container', 'container hover:container'],

  // Components and utilities with variants
  [
    'focus:hover:container hover:underline hover:container p-1',
    'p-1 hover:container hover:underline focus:hover:container',
  ],

  // Leave user css order alone, and move to the front
  ['b p-1 a', 'b a p-1'],
  ['hover:b focus:p-1 a', 'hover:b a focus:p-1'],

  // Add special treatment for `group` and `peer`
  ['a peer container underline', 'a peer container underline'],
])('should sort "%s" based on the order we generate them in to "%s"', (input, output) => {
  let config = {}
  let context = createContext(resolveConfig(config))
  expect(context.sortClassList(input.split(' ')).join(' ')).toEqual(output)
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
  ['tw-px-3 !tw-py-4', 'tw-px-3 !tw-py-4'],
  ['!tw-py-4 tw-px-3', '!tw-py-4 tw-px-3'],

  // Components with variants
  ['hover:tw-container tw-container', 'tw-container hover:tw-container'],

  // Components and utilities with variants
  [
    'focus:hover:tw-container hover:tw-underline hover:tw-container tw-p-1',
    'tw-p-1 hover:tw-container hover:tw-underline focus:hover:tw-container',
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
    expect(context.sortClassList(input.split(' ')).join(' ')).toEqual(output)
  }
)
