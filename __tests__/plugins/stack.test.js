import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/stack'

test('generating stack utilities', () => {
  const config = {
    theme: {
      stack: {
        '1': '1px',
        '2': '2px',
        '4': '4px',
        '8': '8px',
      },
    },
    variants: {
      stack: ['responsive'],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      [
        {
          '.stack-y-1 > * + *': { 'margin-top': '1px' },
          '.stack-x-1 > * + *': { 'margin-left': '1px' },
        },
        {
          '.stack-y-2 > * + *': { 'margin-top': '2px' },
          '.stack-x-2 > * + *': { 'margin-left': '2px' },
        },
        {
          '.stack-y-4 > * + *': { 'margin-top': '4px' },
          '.stack-x-4 > * + *': { 'margin-left': '4px' },
        },
        {
          '.stack-y-8 > * + *': { 'margin-top': '8px' },
          '.stack-x-8 > * + *': { 'margin-left': '8px' },
        },
      ],
      ['responsive'],
    ],
  ])
})
