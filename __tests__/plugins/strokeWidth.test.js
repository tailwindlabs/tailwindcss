import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/strokeWidth'

test('the width of the stroke to be applied to the shape', () => {
  const addedUtilities = []

  const config = {
    theme: {
      strokeWidth: {
        '0': '0',
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
    },
    variants: {
      strokeWidth: ['responsive'],
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
        '.stroke-w-0': { 'stroke-width': '0' },
        '.stroke-w-1': { 'stroke-width': '1px' },
        '.stroke-w-2': { 'stroke-width': '2px' },
        '.stroke-w-3': { 'stroke-width': '3px' },
        '.stroke-w-4': { 'stroke-width': '4px' },
      },
      variants: ['responsive'],
    },
  ])
})
