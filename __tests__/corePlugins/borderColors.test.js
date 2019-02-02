import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/borderColors'

test('it generates border color utilities', () => {
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
        '.border-red': { 'border-color': '#e3342f' },
        '.border-green': { 'border-color': '#38c172' },
        '.border-blue': { 'border-color': '#3490dc' },
      },
      variants: ['responsive', 'hover', 'focus'],
    },
  ])
})

test('it ignores the default border color', () => {
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
      default: '#dae1e7',
    },
  })(pluginApi)

  expect(addedUtilities).toEqual([
    {
      utilities: {
        '.border-red': { 'border-color': '#e3342f' },
        '.border-green': { 'border-color': '#38c172' },
        '.border-blue': { 'border-color': '#3490dc' },
      },
      variants: ['responsive', 'hover', 'focus'],
    },
  ])
})

test('it uses the theme color palette if no border colors are provided', () => {
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
        '.border-orange': { 'border-color': '#f6993f' },
        '.border-teal': { 'border-color': '#4dc0b5' },
        '.border-indigo': { 'border-color': '#6574cd' },
      },
      variants: ['responsive', 'hover', 'focus'],
    },
  ])
})
