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

test('font-size utilities can include a default letter-spacing', () => {
  const config = {
    theme: {
      fontSize: {
        sm: '12px',
        md: ['16px', { letterSpacing: '-0.01em' }],
        lg: ['20px', { letterSpacing: '-0.02em' }],
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
        '.text-md': { 'font-size': '16px', 'letter-spacing': '-0.01em' },
        '.text-lg': { 'font-size': '20px', 'letter-spacing': '-0.02em' },
      },
      ['responsive'],
    ],
  ])
})

test('font-size utilities can include a default line-height and letter-spacing', () => {
  const config = {
    theme: {
      fontSize: {
        sm: '12px',
        md: ['16px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
        lg: ['20px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
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
        '.text-md': { 'font-size': '16px', 'line-height': '24px', 'letter-spacing': '-0.01em' },
        '.text-lg': { 'font-size': '20px', 'line-height': '28px', 'letter-spacing': '-0.02em' },
      },
      ['responsive'],
    ],
  ])
})
