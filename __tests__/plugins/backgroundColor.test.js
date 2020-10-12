import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/backgroundColor'

test('defining color as a function', () => {
  const config = {
    target: 'relaxed',
    theme: {
      backgroundColor: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      backgroundColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.bg-black': {
          'background-color': 'black',
        },
      },
      [],
    ],
  ])
})

test('defining color as a function in ie11 mode', () => {
  const config = {
    target: 'ie11',
    theme: {
      backgroundColor: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      backgroundColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.bg-black': {
          'background-color': 'black',
        },
      },
      [],
    ],
  ])
})
