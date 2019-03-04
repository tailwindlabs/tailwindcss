import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/borderColor'

test('colors can be a nested object', () => {
  const addedUtilities = []

  const config = {
    theme: {
      borderColor: {
        purple: 'purple',
        red: {
          1: 'rgb(33,0,0)',
          2: 'rgb(67,0,0)',
          3: 'rgb(100,0,0)',
        },
        green: {
          1: 'rgb(0,33,0)',
          2: 'rgb(0,67,0)',
          3: 'rgb(0,100,0)',
        },
        blue: {
          1: 'rgb(0,0,33)',
          2: 'rgb(0,0,67)',
          3: 'rgb(0,0,100)',
        },
      },
    },
    variants: {
      borderColor: ['responsive'],
    },
  }

  const pluginApi = {
    config: (key, defaultValue) => _.get(config, key, defaultValue),
    e: escapeClassName,
    addUtilities(utilities, variants) {
      addedUtilities.push({
        utilities,
        variants,
      })
    },
  }

  plugin()(pluginApi)

  expect(addedUtilities).toEqual([
    {
      utilities: {
        '.border-purple': { 'border-color': 'purple' },
        '.border-red-1': { 'border-color': 'rgb(33,0,0)' },
        '.border-red-2': { 'border-color': 'rgb(67,0,0)' },
        '.border-red-3': { 'border-color': 'rgb(100,0,0)' },
        '.border-green-1': { 'border-color': 'rgb(0,33,0)' },
        '.border-green-2': { 'border-color': 'rgb(0,67,0)' },
        '.border-green-3': { 'border-color': 'rgb(0,100,0)' },
        '.border-blue-1': { 'border-color': 'rgb(0,0,33)' },
        '.border-blue-2': { 'border-color': 'rgb(0,0,67)' },
        '.border-blue-3': { 'border-color': 'rgb(0,0,100)' },
      },
      variants: ['responsive'],
    },
  ])
})
