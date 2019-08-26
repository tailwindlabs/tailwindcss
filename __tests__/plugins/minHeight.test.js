import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/minHeight'

test('min height tests', () => {
  const addedUtilities = []

  const config = {
    theme: {
      minHeight: {
        '0': '0',
        full: '100%',
        screen: '100vh',
      },
    },
    variants: {
      minHeight: ['responsive'],
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
        '.min-h-0': { 'min-height': '0' },
        '.min-h-full': { 'min-height': '100%' },
        '.min-h-screen': { 'min-height': '100vh' },
      },
      variants: ['responsive'],
    },
  ])
})
