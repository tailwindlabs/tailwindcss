import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/caretColor'

test('defining color as a function', () => {
  const config = {
    theme: {
      caretColor: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      caretColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.caret-black': {
          'caret-color': 'black',
        },
      },
      [],
    ],
  ])
})
