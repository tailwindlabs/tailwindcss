import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/gridColumnEnd'

test('default behaviour (no gridTemplateColumns)', () => {
  const addedUtilities = []

  const config = {
    target: 'relaxed',
    theme: {
      gridColumnEnd: {
        auto: 'auto',
        '1': '1',
      },
    },
    variants: {
      gridColumnEnd: ['responsive'],
    },
  }

  const getConfigValue = (path, defaultValue) => _.get(config, path, defaultValue)
  const pluginApi = {
    config: getConfigValue,
    e: escapeClassName,
    target: () => {
      return 'relaxed'
    },
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
        '.col-end-auto': {
          'grid-column-end': 'auto',
        },
        '.col-end-1': {
          'grid-column-end': '1',
        },
      },
      variants: ['responsive'],
    },
  ])
})

test('multiple templates with different names', () => {
  const addedUtilities = []

  const config = {
    target: 'relaxed',
    theme: {
      gridTemplateColumns: {
        layout: '1fr [left] 1fr [right] 1fr',
        multi: '1fr [column] 1fr [column] 1fr',
      },
      gridColumnEnd: {
        auto: 'auto',
        '1': '1',
      },
    },
    variants: {
      gridColumnEnd: ['responsive'],
    },
  }

  const getConfigValue = (path, defaultValue) => _.get(config, path, defaultValue)
  const pluginApi = {
    config: getConfigValue,
    e: escapeClassName,
    target: () => {
      return 'relaxed'
    },
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
        '.col-end-auto': {
          'grid-column-end': 'auto',
        },
        '.col-end-1': {
          'grid-column-end': '1',
        },
        '.col-end-left': {
          'grid-column-end': 'left',
        },
        '.col-end-right': {
          'grid-column-end': 'right',
        },
        '.col-end-column-1': {
          'grid-column-end': 'column-1',
        },
        '.col-end-column-2': {
          'grid-column-end': 'column-2',
        },
      },
      variants: ['responsive'],
    },
  ])
})
