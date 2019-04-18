import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/backgroundColor'

test('colors can be a nested object', () => {
  const addedUtilities = []

  const config = {
    theme: {
      backgroundColor: {
        purple: 'purple',
        white: {
          25: 'rgba(255,255,255,.25)',
          50: 'rgba(255,255,255,.5)',
          75: 'rgba(255,255,255,.75)',
          default: '#fff',
        },
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

  const getConfigValue = (path, defaultValue) => _.get(config, path, defaultValue)
  const pluginApi = {
    config: getConfigValue,
    e: escapeClassName,
    theme: (path, defaultValue) => getConfigValue(`theme.${path}`, defaultValue),
    variants: (path, defaultValue) => {
      if (_.isArray(config.variants)) {
        return config.variants
      }

      return getConfigValue(`variants.${path}`, defaultValue)
    },
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
        '.bg-white-25': { 'background-color': 'rgba(255,255,255,.25)' },
        '.bg-white-50': { 'background-color': 'rgba(255,255,255,.5)' },
        '.bg-white-75': { 'background-color': 'rgba(255,255,255,.75)' },
        '.bg-white': { 'background-color': '#fff' },
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
