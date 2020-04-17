import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/divideWidth'

test('generating divide width utilities', () => {
  const config = {
    theme: {
      divideWidth: {
        default: '1px',
        '2': '2px',
        '4': '4px',
        '8': '8px',
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
        '.divide-y-2 > :not(template) ~ :not(template)': { 'border-top-width': '2px' },
        '.divide-x-2 > :not(template) ~ :not(template)': { 'border-left-width': '2px' },
        '.divide-y-4 > :not(template) ~ :not(template)': { 'border-top-width': '4px' },
        '.divide-x-4 > :not(template) ~ :not(template)': { 'border-left-width': '4px' },
        '.divide-y-8 > :not(template) ~ :not(template)': { 'border-top-width': '8px' },
        '.divide-x-8 > :not(template) ~ :not(template)': { 'border-left-width': '8px' },
        '.divide-y > :not(template) ~ :not(template)': { 'border-top-width': '1px' },
        '.divide-x > :not(template) ~ :not(template)': { 'border-left-width': '1px' },
      },
      ['responsive'],
    ],
  ])
})
