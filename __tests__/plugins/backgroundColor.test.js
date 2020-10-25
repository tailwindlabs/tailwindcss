import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/backgroundColor'

test('defining color as a function', () => {
  const config = {
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
