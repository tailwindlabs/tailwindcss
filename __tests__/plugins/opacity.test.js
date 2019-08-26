import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/opacity'

test('opacity style test', () => {
  const addedUtilities = []

  const config = {
    theme: {
      opacity: {
        '0': '0',
        '25': '0.25',
        '50': '0.5',
        '75': '0.75',
        '100': '1',
      },
    },
    variants: {
      opacity: ['responsive'],
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
        '.opacity-0': { opacity: '0' },
        '.opacity-25': { opacity: '0.25' },
        '.opacity-50': { opacity: '0.5' },
        '.opacity-75': { opacity: '0.75' },
        '.opacity-100': { opacity: '1' },
      },
      variants: ['responsive'],
    },
  ])
})
