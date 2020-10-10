import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/placeholderColor'

test('defining color as a function', () => {
  const config = {
    target: 'relaxed',
    theme: {
      placeholderColor: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      placeholderColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.placeholder-black::placeholder': {
          color: 'black',
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
      placeholderColor: {
        black: ({ opacityVariable: _ }) => 'black',
      },
    },
    variants: {
      placeholderColor: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.placeholder-black::placeholder': {
          color: 'black',
        },
      },
      [],
    ],
  ])
})
