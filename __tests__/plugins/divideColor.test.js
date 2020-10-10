import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/divideColor'

test('defining color as a function', () => {
  const config = {
    target: 'relaxed',
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
        '.divide-black > :not(template) ~ :not(template)': {
          'border-color': 'black',
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
        '.divide-black > :not(template) ~ :not(template)': {
          'border-color': 'black',
        },
      },
      [],
    ],
  ])
})
