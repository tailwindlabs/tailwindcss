import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/borderColor'

test('colors can be a nested object', () => {
  const addedUtilities = []

  const config = {
    theme: {
      borderColor: {
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
      borderColor: ['responsive'],
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
        '.border-purple': { 'border-color': 'purple' },
        '.border-white-25': { 'border-color': 'rgba(255,255,255,.25)' },
        '.border-white-50': { 'border-color': 'rgba(255,255,255,.5)' },
        '.border-white-75': { 'border-color': 'rgba(255,255,255,.75)' },
        '.border-white': { 'border-color': '#fff' },
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
