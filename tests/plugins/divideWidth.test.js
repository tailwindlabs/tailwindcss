import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/divideWidth'

test('generating divide width utilities', () => {
  const config = {
    theme: {
      divideWidth: {
        DEFAULT: '1px',
        0: '0',
        2: '2px',
        4: '4px',
      },
    },
    variants: {
      divideWidth: ['responsive'],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.divide-y > :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-y-reverse': '0',
          'border-top-width': 'calc(1px * calc(1 - var(--tw-divide-y-reverse)))',
          'border-bottom-width': 'calc(1px * var(--tw-divide-y-reverse))',
        },
        '.divide-x > :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-x-reverse': '0',
          'border-right-width': 'calc(1px * var(--tw-divide-x-reverse))',
          'border-left-width': 'calc(1px * calc(1 - var(--tw-divide-x-reverse)))',
        },
        '.divide-y-0 > :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-y-reverse': '0',
          'border-top-width': 'calc(0px * calc(1 - var(--tw-divide-y-reverse)))',
          'border-bottom-width': 'calc(0px * var(--tw-divide-y-reverse))',
        },
        '.divide-x-0 > :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-x-reverse': '0',
          'border-right-width': 'calc(0px * var(--tw-divide-x-reverse))',
          'border-left-width': 'calc(0px * calc(1 - var(--tw-divide-x-reverse)))',
        },
        '.divide-y-2 > :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-y-reverse': '0',
          'border-top-width': 'calc(2px * calc(1 - var(--tw-divide-y-reverse)))',
          'border-bottom-width': 'calc(2px * var(--tw-divide-y-reverse))',
        },
        '.divide-x-2 > :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-x-reverse': '0',
          'border-right-width': 'calc(2px * var(--tw-divide-x-reverse))',
          'border-left-width': 'calc(2px * calc(1 - var(--tw-divide-x-reverse)))',
        },
        '.divide-y-4 > :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-y-reverse': '0',
          'border-top-width': 'calc(4px * calc(1 - var(--tw-divide-y-reverse)))',
          'border-bottom-width': 'calc(4px * var(--tw-divide-y-reverse))',
        },
        '.divide-x-4 > :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-x-reverse': '0',
          'border-right-width': 'calc(4px * var(--tw-divide-x-reverse))',
          'border-left-width': 'calc(4px * calc(1 - var(--tw-divide-x-reverse)))',
        },
        '.divide-y-reverse > :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-y-reverse': '1',
        },
        '.divide-x-reverse > :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-x-reverse': '1',
        },
      },
      ['responsive'],
    ],
  ])
})
