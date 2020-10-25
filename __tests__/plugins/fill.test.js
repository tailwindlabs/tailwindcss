import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/fill'

test('defining color as a function', () => {
  const config = {
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
