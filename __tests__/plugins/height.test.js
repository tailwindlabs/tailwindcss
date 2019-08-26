import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/height'

test('height tests', () => {
  const addedUtilities = []

  const config = {
    theme: {
      height: {
        auto: 'auto',
        full: '100%',
        screen: '100vh',
      },
    },
    variants: {
      height: ['responsive'],
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
        '.h-auto': { height: 'auto' },
        '.h-full': { height: '100%' },
        '.h-screen': { height: '100vh' },
      },
      variants: ['responsive'],
    },
  ])
})
