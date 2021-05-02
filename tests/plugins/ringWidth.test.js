import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/ringWidth'

test('ring widths', () => {
  const config = {
    theme: {
      ringWidth: {
        4: '4px',
      },
      ringOffsetWidth: {
        4: '4px',
      },
      ringColor: {
        black: '#000',
      },
      ringOffsetColor: {
        white: '#fff',
      },
      ringOpacity: {
        50: '.5',
      },
    },
    variants: {
      ringColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)
  expect(utilities).toEqual([
    [
      {
        '*': {
          '--tw-ring-color': 'rgba(147, 197, 253, 0.5)',
          '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-ring-offset-color': '#fff',
          '--tw-ring-offset-shadow': '0 0 #0000',
          '--tw-ring-offset-width': '0px',
          '--tw-ring-shadow': '0 0 #0000',
        },
      },
      {
        respectImportant: false,
      },
    ],
    [
      {
        '.ring-4': {
          '--tw-ring-offset-shadow':
            'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
          '--tw-ring-shadow':
            'var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
          'box-shadow':
            'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
        },
        '.ring-inset': {
          '--tw-ring-inset': 'inset',
        },
      },
      undefined,
    ],
  ])
})

test('ring widths with defaults and hsl value for ringColor', () => {
  const config = {
    theme: {
      ringWidth: {},
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
      ringOffsetColor: {
        DEFAULT: 'pink',
      },
      ringColor: {
        DEFAULT: 'hsl(10, 50%, 50%)',
      },
    },
    variants: {
      ringColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)
  expect(utilities).toEqual([
    [
      {
        '*': {
          '--tw-ring-color': 'hsla(10, 50%, 50%, 0.5)',
          '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-ring-offset-color': 'pink',
          '--tw-ring-offset-shadow': '0 0 #0000',
          '--tw-ring-offset-width': '2px',
          '--tw-ring-shadow': '0 0 #0000',
        },
      },
      { respectImportant: false },
    ],
    [
      {
        '.ring-inset': {
          '--tw-ring-inset': 'inset',
        },
      },
      undefined,
    ],
  ])
})

test('ring widths with defaults', () => {
  const config = {
    theme: {
      ringWidth: {},
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
      ringOffsetColor: {
        DEFAULT: 'pink',
      },
    },
    variants: {
      ringColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)
  expect(utilities).toEqual([
    [
      {
        '*': {
          '--tw-ring-color': 'rgba(147, 197, 253, 0.5)',
          '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-ring-offset-color': 'pink',
          '--tw-ring-offset-shadow': '0 0 #0000',
          '--tw-ring-offset-width': '2px',
          '--tw-ring-shadow': '0 0 #0000',
        },
      },
      { respectImportant: false },
    ],
    [
      {
        '.ring-inset': {
          '--tw-ring-inset': 'inset',
        },
      },
      undefined,
    ],
  ])
})
