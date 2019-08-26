import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/minWidth'

test('min width tests', () => {
  const addedUtilities = []

  const config = {
    theme: {
      minWidth: {
        '0': '0',
        full: '100%',
      },
    },
    variants: {
      minWidth: ['responsive'],
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
        '.min-w-0': { 'min-width': '0' },
        '.min-w-full': { 'min-width': '100%' },
      },
      variants: ['responsive'],
    },
  ])
})
