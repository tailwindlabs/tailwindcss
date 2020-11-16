import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/space'

test('generating space utilities', () => {
  const config = {
    theme: {
      space: {
        0: '0',
        1: '1px',
        2: '2px',
        4: '4px',
        '-2': '-2px',
        '-1': '-1px',
      },
    },
    variants: {
      space: ['responsive'],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.space-y-0 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-y-reverse': '0',
          'margin-top': 'calc(0px * calc(1 - var(--tw-space-y-reverse)))',
          'margin-bottom': 'calc(0px * var(--tw-space-y-reverse))',
        },
        '.space-x-0 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '0',
          'margin-right': 'calc(0px * var(--tw-space-x-reverse))',
          'margin-left': 'calc(0px * calc(1 - var(--tw-space-x-reverse)))',
        },
        '.space-y-1 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-y-reverse': '0',
          'margin-top': 'calc(1px * calc(1 - var(--tw-space-y-reverse)))',
          'margin-bottom': 'calc(1px * var(--tw-space-y-reverse))',
        },
        '.space-x-1 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '0',
          'margin-right': 'calc(1px * var(--tw-space-x-reverse))',
          'margin-left': 'calc(1px * calc(1 - var(--tw-space-x-reverse)))',
        },
        '.space-y-2 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-y-reverse': '0',
          'margin-top': 'calc(2px * calc(1 - var(--tw-space-y-reverse)))',
          'margin-bottom': 'calc(2px * var(--tw-space-y-reverse))',
        },
        '.space-x-2 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '0',
          'margin-right': 'calc(2px * var(--tw-space-x-reverse))',
          'margin-left': 'calc(2px * calc(1 - var(--tw-space-x-reverse)))',
        },
        '.space-y-4 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-y-reverse': '0',
          'margin-top': 'calc(4px * calc(1 - var(--tw-space-y-reverse)))',
          'margin-bottom': 'calc(4px * var(--tw-space-y-reverse))',
        },
        '.space-x-4 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '0',
          'margin-right': 'calc(4px * var(--tw-space-x-reverse))',
          'margin-left': 'calc(4px * calc(1 - var(--tw-space-x-reverse)))',
        },
        '.-space-y-2 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-y-reverse': '0',
          'margin-top': 'calc(-2px * calc(1 - var(--tw-space-y-reverse)))',
          'margin-bottom': 'calc(-2px * var(--tw-space-y-reverse))',
        },
        '.-space-x-2 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '0',
          'margin-right': 'calc(-2px * var(--tw-space-x-reverse))',
          'margin-left': 'calc(-2px * calc(1 - var(--tw-space-x-reverse)))',
        },
        '.-space-y-1 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-y-reverse': '0',
          'margin-top': 'calc(-1px * calc(1 - var(--tw-space-y-reverse)))',
          'margin-bottom': 'calc(-1px * var(--tw-space-y-reverse))',
        },
        '.-space-x-1 > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '0',
          'margin-right': 'calc(-1px * var(--tw-space-x-reverse))',
          'margin-left': 'calc(-1px * calc(1 - var(--tw-space-x-reverse)))',
        },
        '.space-y-reverse > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-y-reverse': '1',
        },
        '.space-x-reverse > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '1',
        },
      },
      ['responsive'],
    ],
  ])
})
