import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/ringColor'

test('defining color as a function', () => {
  const config = {
    theme: {
      ringColor: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      ringColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.ring-black': {
          '--tw-ring-opacity': '1',
          '--tw-ring-color': 'black',
        },
      },
      [],
    ],
  ])
})
