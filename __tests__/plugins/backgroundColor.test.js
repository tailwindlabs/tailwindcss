import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/backgroundColor'

test('colors can be a nested object', () => {
  const addedUtilities = []

  const config = {
    theme: {
      backgroundColor: {
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
      backgroundColor: ['responsive'],
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
        '.bg-purple': { 'background-color': 'purple' },
        '.bg-red-1': { 'background-color': 'rgb(33,0,0)' },
        '.bg-red-2': { 'background-color': 'rgb(67,0,0)' },
        '.bg-red-3': { 'background-color': 'rgb(100,0,0)' },
        '.bg-green-1': { 'background-color': 'rgb(0,33,0)' },
        '.bg-green-2': { 'background-color': 'rgb(0,67,0)' },
        '.bg-green-3': { 'background-color': 'rgb(0,100,0)' },
        '.bg-blue-1': { 'background-color': 'rgb(0,0,33)' },
        '.bg-blue-2': { 'background-color': 'rgb(0,0,67)' },
        '.bg-blue-3': { 'background-color': 'rgb(0,0,100)' },
      },
      variants: ['responsive'],
    },
  ])
})
