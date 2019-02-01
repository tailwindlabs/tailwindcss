import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/borderColors'

test('it generates border color utilities', () => {
  const addedUtilities = []

  const pluginApi = {
    e: escapeClassName,
    addUtilities(utilities, variants) {
      addedUtilities.push({
        utilities: utilities,
        variants: variants,
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
    e: escapeClassName,
    addUtilities(utilities, variants) {
      addedUtilities.push({
        utilities: utilities,
        variants: variants,
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
