import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/stroke'

test('colors can be a nested object', () => {
  const addedUtilities = []

  const config = {
    theme: {
      stroke: {
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
      stroke: ['responsive'],
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
        '.stroke-purple': { stroke: 'purple' },
        '.stroke-white-25': { stroke: 'rgba(255,255,255,.25)' },
        '.stroke-white-50': { stroke: 'rgba(255,255,255,.5)' },
        '.stroke-white-75': { stroke: 'rgba(255,255,255,.75)' },
        '.stroke-white': { stroke: '#fff' },
        '.stroke-red-1': { stroke: 'rgb(33,0,0)' },
        '.stroke-red-2': { stroke: 'rgb(67,0,0)' },
        '.stroke-red-3': { stroke: 'rgb(100,0,0)' },
        '.stroke-green-1': { stroke: 'rgb(0,33,0)' },
        '.stroke-green-2': { stroke: 'rgb(0,67,0)' },
        '.stroke-green-3': { stroke: 'rgb(0,100,0)' },
        '.stroke-blue-1': { stroke: 'rgb(0,0,33)' },
        '.stroke-blue-2': { stroke: 'rgb(0,0,67)' },
        '.stroke-blue-3': { stroke: 'rgb(0,0,100)' },
      },
      variants: ['responsive'],
    },
  ])
})
