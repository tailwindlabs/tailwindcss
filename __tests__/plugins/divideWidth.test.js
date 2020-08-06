import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/divideWidth'

test('generating divide width utilities', () => {
  const config = {
    target: 'relaxed',
    theme: {
      divideWidth: {
        default: '1px',
        '0': '0',
        '2': '2px',
        '4': '4px',
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
        '.divide-y > :not(template) ~ :not(template)': {
          '--divide-y-reverse': '0',
          'border-top-width': 'calc(1px * calc(1 - var(--divide-y-reverse)))',
          'border-bottom-width': 'calc(1px * var(--divide-y-reverse))',
        },
        '.divide-x > :not(template) ~ :not(template)': {
          '--divide-x-reverse': '0',
          'border-right-width': 'calc(1px * var(--divide-x-reverse))',
          'border-left-width': 'calc(1px * calc(1 - var(--divide-x-reverse)))',
        },
        '.divide-y-0 > :not(template) ~ :not(template)': {
          '--divide-y-reverse': '0',
          'border-top-width': 'calc(0px * calc(1 - var(--divide-y-reverse)))',
          'border-bottom-width': 'calc(0px * var(--divide-y-reverse))',
        },
        '.divide-x-0 > :not(template) ~ :not(template)': {
          '--divide-x-reverse': '0',
          'border-right-width': 'calc(0px * var(--divide-x-reverse))',
          'border-left-width': 'calc(0px * calc(1 - var(--divide-x-reverse)))',
        },
        '.divide-y-2 > :not(template) ~ :not(template)': {
          '--divide-y-reverse': '0',
          'border-top-width': 'calc(2px * calc(1 - var(--divide-y-reverse)))',
          'border-bottom-width': 'calc(2px * var(--divide-y-reverse))',
        },
        '.divide-x-2 > :not(template) ~ :not(template)': {
          '--divide-x-reverse': '0',
          'border-right-width': 'calc(2px * var(--divide-x-reverse))',
          'border-left-width': 'calc(2px * calc(1 - var(--divide-x-reverse)))',
        },
        '.divide-y-4 > :not(template) ~ :not(template)': {
          '--divide-y-reverse': '0',
          'border-top-width': 'calc(4px * calc(1 - var(--divide-y-reverse)))',
          'border-bottom-width': 'calc(4px * var(--divide-y-reverse))',
        },
        '.divide-x-4 > :not(template) ~ :not(template)': {
          '--divide-x-reverse': '0',
          'border-right-width': 'calc(4px * var(--divide-x-reverse))',
          'border-left-width': 'calc(4px * calc(1 - var(--divide-x-reverse)))',
        },
        '.divide-y-reverse > :not(template) ~ :not(template)': {
          '--divide-y-reverse': '1',
        },
        '.divide-x-reverse > :not(template) ~ :not(template)': {
          '--divide-x-reverse': '1',
        },
      },
      ['responsive'],
    ],
  ])
})
