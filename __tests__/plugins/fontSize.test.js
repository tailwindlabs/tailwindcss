import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/fontSize'

test('font-size utilities can include a default line-height', () => {
  const config = {
    theme: {
      fontSize: {
        sm: '12px',
        md: ['16px', '24px'],
        lg: ['20px', '28px'],
      },
    },
    variants: {
      fontSize: ['responsive'],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.text-sm': { 'font-size': '12px' },
        '.text-md': { 'font-size': '16px', 'line-height': '24px' },
        '.text-lg': { 'font-size': '20px', 'line-height': '28px' },
      },
      ['responsive'],
    ],
  ])
})
