import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/width'

test('width tests', () => {
  const addedUtilities = []

  const config = {
    theme: {
      width: {
        auto: 'auto',
        full: '100%',
        screen: '100vw',
      },
    },
    variants: {
      width: ['responsive'],
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
        '.w-auto': { width: 'auto' },
        '.w-full': { width: '100%' },
        '.w-screen': { width: '100vw' },
      },
      variants: ['responsive'],
    },
  ])
})
