import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/stroke'

test('defining color as a function', () => {
  const config = {
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

test('defining none as a function', () => {
  const config = {
    theme: {
      stroke: {
        none: ({ opacityVariable: _ }) => 'none',
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
        '.stroke-none': {
          stroke: 'none',
        },
      },
      [],
    ],
  ])
})
