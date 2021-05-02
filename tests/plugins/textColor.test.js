import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/textColor'

test('defining color as a function', () => {
  const config = {
    theme: {
      textColor: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      textColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.text-black': {
          color: 'black',
        },
      },
      [],
    ],
  ])
})
