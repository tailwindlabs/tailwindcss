import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/fill'

test('defining color as a function', () => {
  const config = {
    target: 'relaxed',
    theme: {
      fill: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      fill: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.fill-black': {
          fill: 'black',
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
      fill: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      fill: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.fill-black': {
          fill: 'black',
        },
      },
      [],
    ],
  ])
})
