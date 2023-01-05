import resolveConfig from '../src/public/resolve-config'
import plugin from '../src/public/create-plugin'
import { createContext } from '../src/lib/setupContextUtils'

it('should generate every possible class, without variants', () => {
  let config = {}

  let context = createContext(resolveConfig(config))
  let classes = context.getClassList()
  expect(classes).toBeInstanceOf(Array)

  // Verify we have a `container` for the 'components' section.
  expect(classes).toContain('container')

  // Verify we handle the DEFAULT case correctly
  expect(classes).toContain('border')

  // Verify we handle negative values correctly
  expect(classes).toContain('-inset-1/4')
  expect(classes).toContain('-m-0')
  expect(classes).not.toContain('-uppercase')
  expect(classes).not.toContain('-opacity-50')

  config = { theme: { extend: { margin: { DEFAULT: '5px' } } } }
  context = createContext(resolveConfig(config))
  classes = context.getClassList()

  expect(classes).not.toContain('-m-DEFAULT')
})

it('should generate every possible class while handling negatives and prefixes', () => {
  let config = { prefix: 'tw-' }
  let context = createContext(resolveConfig(config))
  let classes = context.getClassList()
  expect(classes).toBeInstanceOf(Array)

  // Verify we have a `container` for the 'components' section.
  expect(classes).toContain('tw-container')

  // Verify we handle the DEFAULT case correctly
  expect(classes).toContain('tw-border')

  // Verify we handle negative values correctly
  expect(classes).toContain('-tw-inset-1/4')
  expect(classes).toContain('-tw-m-0')
  expect(classes).not.toContain('-tw-uppercase')
  expect(classes).not.toContain('-tw-opacity-50')

  // These utilities do work but there's no reason to generate
  // them alongside the `-{prefix}-{utility}` versions
  expect(classes).not.toContain('tw--inset-1/4')
  expect(classes).not.toContain('tw--m-0')

  config = {
    prefix: 'tw-',
    theme: { extend: { margin: { DEFAULT: '5px' } } },
  }
  context = createContext(resolveConfig(config))
  classes = context.getClassList()

  expect(classes).not.toContain('-tw-m-DEFAULT')
})

it('should not generate utilities with opacity by default', () => {
  let config = {}
  let context = createContext(resolveConfig(config))
  let classes = context.getClassList()

  expect(classes).not.toContain('bg-red-500/50')
})

it('should generate utilities with modifier data', () => {
  let config = {}
  let context = createContext(resolveConfig(config))
  let classes = context.getClassList()

  expect(classes).toContainEqual([
    'bg-red-500',
    {
      modifiers: [
        '0',
        '5',
        '10',
        '20',
        '25',
        '30',
        '40',
        '50',
        '60',
        '70',
        '75',
        '80',
        '90',
        '95',
        '100',
      ],
    },
  ])
  expect(classes).toContainEqual([
    'text-2xl',
    {
      modifiers: [
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'none',
        'tight',
        'snug',
        'normal',
        'relaxed',
        'loose',
      ],
    },
  ])
})

it('should generate plugin-defined utilities with modifier data', () => {
  let config = {
    plugins: [
      plugin(function ({ matchUtilities }) {
        matchUtilities(
          {
            foo: (value, { modifier }) => {
              return { color: `rgb(${value} / ${modifier ?? 1})` }
            },
          },
          { values: { red: 'red' }, modifiers: { bar: '0' } }
        )
      }),
    ],
  }
  let context = createContext(resolveConfig(config))
  let classes = context.getClassList()

  expect(classes).toContainEqual([
    'foo-red',
    {
      modifiers: ['bar'],
    },
  ])
})

it('should not generate utilities with opacity even if safe-listed', () => {
  let config = {
    safelist: [
      {
        pattern: /^bg-red-(400|500)(\/(40|50))?$/,
      },
    ],
  }

  let context = createContext(resolveConfig(config))
  let classes = context.getClassList()

  expect(classes).not.toContain('bg-red-500/50')
})

it('should not generate utilities that are set to undefined or null to so that they are removed', () => {
  let config = {
    theme: {
      extend: {
        colors: {
          red: null,
          green: undefined,
          blue: {
            100: null,
            200: undefined,
          },
        },
      },
    },
    safelist: [
      {
        pattern: /^bg-(red|green|blue)-.*$/,
      },
    ],
  }

  let context = createContext(resolveConfig(config))
  let classes = context.getClassList()

  expect(classes).not.toContain('bg-red-100') // Red is `null`

  expect(classes).not.toContain('bg-green-100') // Green is `undefined`

  expect(classes).not.toContain('bg-blue-100') // Blue.100 is `null`
  expect(classes).not.toContain('bg-blue-200') // Blue.200 is `undefined`

  expect(classes).toContainEqual([
    'bg-blue-50',
    {
      modifiers: [
        '0',
        '5',
        '10',
        '20',
        '25',
        '30',
        '40',
        '50',
        '60',
        '70',
        '75',
        '80',
        '90',
        '95',
        '100',
      ],
    },
  ])
})
