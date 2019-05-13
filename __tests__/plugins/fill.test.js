import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/fill'

test('colors can be a nested object', () => {
  const addedUtilities = []

  const config = {
    theme: {
      fill: {
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
      fill: ['responsive'],
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
        '.fill-purple': { fill: 'purple' },
        '.fill-white-25': { fill: 'rgba(255,255,255,.25)' },
        '.fill-white-50': { fill: 'rgba(255,255,255,.5)' },
        '.fill-white-75': { fill: 'rgba(255,255,255,.75)' },
        '.fill-white': { fill: '#fff' },
        '.fill-red-1': { fill: 'rgb(33,0,0)' },
        '.fill-red-2': { fill: 'rgb(67,0,0)' },
        '.fill-red-3': { fill: 'rgb(100,0,0)' },
        '.fill-green-1': { fill: 'rgb(0,33,0)' },
        '.fill-green-2': { fill: 'rgb(0,67,0)' },
        '.fill-green-3': { fill: 'rgb(0,100,0)' },
        '.fill-blue-1': { fill: 'rgb(0,0,33)' },
        '.fill-blue-2': { fill: 'rgb(0,0,67)' },
        '.fill-blue-3': { fill: 'rgb(0,0,100)' },
      },
      variants: ['responsive'],
    },
  ])
})
