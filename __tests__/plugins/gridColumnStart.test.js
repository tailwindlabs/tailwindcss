import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/gridColumnStart'

test('default behaviour (no gridTemplateColumns)', () => {
  const addedUtilities = []

  const config = {
    target: 'relaxed',
    theme: {
      gridColumnStart: {
        auto: 'auto',
        '1': '1',
      },
    },
    variants: {
      gridColumnStart: ['responsive'],
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
        '.col-start-auto': {
          'grid-column-start': 'auto',
        },
        '.col-start-1': {
          'grid-column-start': '1',
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
      gridColumnStart: {
        auto: 'auto',
        '1': '1',
      },
    },
    variants: {
      gridColumnStart: ['responsive'],
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
        '.col-start-auto': {
          'grid-column-start': 'auto',
        },
        '.col-start-1': {
          'grid-column-start': '1',
        },
        '.col-start-left': {
          'grid-column-start': 'left',
        },
        '.col-start-right': {
          'grid-column-start': 'right',
        },
        '.col-start-column-1': {
          'grid-column-start': 'column-1',
        },
        '.col-start-column-2': {
          'grid-column-start': 'column-2',
        },
      },
      variants: ['responsive'],
    },
  ])
})
