import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/space'

test('generating space utilities', () => {
  const config = {
    theme: {
      space: {
        '1': '1px',
        '2': '2px',
        '4': '4px',
        '8': '8px',
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
        '.space-y-1 > :not(template) ~ :not(template)': { 'margin-top': '1px' },
        '.space-x-1 > :not(template) ~ :not(template)': { 'margin-left': '1px' },
        '.space-y-2 > :not(template) ~ :not(template)': { 'margin-top': '2px' },
        '.space-x-2 > :not(template) ~ :not(template)': { 'margin-left': '2px' },
        '.space-y-4 > :not(template) ~ :not(template)': { 'margin-top': '4px' },
        '.space-x-4 > :not(template) ~ :not(template)': { 'margin-left': '4px' },
        '.space-y-8 > :not(template) ~ :not(template)': { 'margin-top': '8px' },
        '.space-x-8 > :not(template) ~ :not(template)': { 'margin-left': '8px' },
      },
      ['responsive'],
    ],
  ])
})
