import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/borderColors'

test('it generates border color utilities', () => {
  const addedUtilities = []

  const pluginApi = {
    e: escapeClassName,
    addUtilities(utilities) {
      addedUtilities.push(utilities)
    },
  }

  plugin({
    variants: ['responsive', 'hover', 'focus'],
    values: {
      'grey-dark': '#8795a1',
      grey: '#b8c2cc',
      'grey-light': '#dae1e7',
      'red-dark': '#cc1f1a',
      red: '#e3342f',
      'red-light': '#ef5753',
      'green-dark': '#1f9d55',
      green: '#38c172',
      'green-light': '#51d88a',
      'blue-dark': '#2779bd',
      blue: '#3490dc',
      'blue-light': '#6cb2eb',
    },
  })(pluginApi)

  expect(addedUtilities).toEqual([
    {
      '.border-grey-dark': { 'border-color': '#8795a1' },
      '.border-grey': { 'border-color': '#b8c2cc' },
      '.border-grey-light': { 'border-color': '#dae1e7' },
      '.border-red-dark': { 'border-color': '#cc1f1a' },
      '.border-red': { 'border-color': '#e3342f' },
      '.border-red-light': { 'border-color': '#ef5753' },
      '.border-green-dark': { 'border-color': '#1f9d55' },
      '.border-green': { 'border-color': '#38c172' },
      '.border-green-light': { 'border-color': '#51d88a' },
      '.border-blue-dark': { 'border-color': '#2779bd' },
      '.border-blue': { 'border-color': '#3490dc' },
      '.border-blue-light': { 'border-color': '#6cb2eb' },
    },
  ])
})
