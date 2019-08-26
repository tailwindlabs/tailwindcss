import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/tableLayout'

test('table Layout tests', () => {
  const addedUtilities = []

  const config = {
    theme: {
      tableLayout: {
        auto: 'auto',
        fixed: 'fixed',
      },
    },
    variants: {
      tableLayout: ['responsive'],
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
        '.table-auto': { 'table-layout': 'auto' },
        '.table-fixed': { 'table-layout': 'fixed' },
      },
      variants: ['responsive'],
    },
  ])
})
