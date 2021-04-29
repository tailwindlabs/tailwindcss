import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/ringOffsetColor'

test('defining color as a function', () => {
  const config = {
    theme: {
      ringOffsetColor: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      ringOffsetColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.ring-offset-black': {
          '--tw-ring-offset-color': 'black',
        },
      },
      [],
    ],
  ])
})
