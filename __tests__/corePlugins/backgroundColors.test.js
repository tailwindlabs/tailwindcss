import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/backgroundColors'

test('it generates background color utilities', () => {
  const addedUtilities = []

  const pluginApi = {
    config: () => null,
    e: escapeClassName,
    addUtilities(utilities, variants) {
      addedUtilities.push({
        utilities,
        variants,
      })
    },
  }

  plugin({
    variants: ['responsive', 'hover', 'focus'],
    values: {
      red: '#e3342f',
      green: '#38c172',
      blue: '#3490dc',
    },
  })(pluginApi)

  expect(addedUtilities).toEqual([
    {
      utilities: {
        '.bg-red': { 'background-color': '#e3342f' },
        '.bg-green': { 'background-color': '#38c172' },
        '.bg-blue': { 'background-color': '#3490dc' },
      },
      variants: ['responsive', 'hover', 'focus'],
    },
  ])
})

test('it uses the theme color palette if no background colors are provided', () => {
  const addedUtilities = []

  const pluginApi = {
    config: (path, defaultValue) =>
      _.get(
        {
          theme: {
            colors: {
              orange: '#f6993f',
              teal: '#4dc0b5',
              indigo: '#6574cd',
            },
          },
        },
        path,
        defaultValue
      ),
    e: escapeClassName,
    addUtilities(utilities, variants) {
      addedUtilities.push({
        utilities,
        variants,
      })
    },
  }

  plugin({
    variants: ['responsive', 'hover', 'focus'],
    values: undefined,
  })(pluginApi)

  expect(addedUtilities).toEqual([
    {
      utilities: {
        '.bg-orange': { 'background-color': '#f6993f' },
        '.bg-teal': { 'background-color': '#4dc0b5' },
        '.bg-indigo': { 'background-color': '#6574cd' },
      },
      variants: ['responsive', 'hover', 'focus'],
    },
  ])
})
