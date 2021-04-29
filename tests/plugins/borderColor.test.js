import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/borderColor'

test('defining color as a function', () => {
  const config = {
    theme: {
      borderColor: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      borderColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.border-black': {
          'border-color': 'black',
        },
      },
      [],
    ],
  ])
})
