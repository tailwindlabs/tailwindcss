import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/zIndex'

test('z index can use negative prefix syntax', () => {
  const addedUtilities = []

  const config = {
    theme: {
      zIndex: {
        '-20': '-20',
        '-10': '-10',
        '10': '10',
        '20': '20',
      },
    },
    variants: {
      zIndex: ['responsive'],
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
        '.-z-20': { 'z-index': '-20' },
        '.-z-10': { 'z-index': '-10' },
        '.z-10': { 'z-index': '10' },
        '.z-20': { 'z-index': '20' },
      },
      variants: ['responsive'],
    },
  ])
})
