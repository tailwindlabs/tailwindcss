import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/divideColor'

test('defining color as a function', () => {
  const config = {
    theme: {
      divideColor: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      divideColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.divide-black > :not([hidden]) ~ :not([hidden])': {
          'border-color': 'black',
        },
      },
      [],
    ],
  ])
})
