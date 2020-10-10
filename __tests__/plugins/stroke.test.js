import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/stroke'

test('defining color as a function', () => {
  const config = {
    target: 'relaxed',
    theme: {
      stroke: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      stroke: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.stroke-black': {
          stroke: 'black',
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
      stroke: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      stroke: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.stroke-black': {
          stroke: 'black',
        },
      },
      [],
    ],
  ])
})
