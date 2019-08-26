import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/maxHeight'

test('max height tests', () => {
  const addedUtilities = []

  const config = {
    theme: {
      maxHeight: {
        full: '100%',
        screen: '100vh',
      },
    },
    variants: {
      maxHeight: ['responsive'],
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
        '.max-h-full': { 'max-height': '100%' },
        '.max-h-screen': { 'max-height': '100vh' },
      },
      variants: ['responsive'],
    },
  ])
})
