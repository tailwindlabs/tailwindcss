import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/gridRowStart'

test('default behaviour (no gridTemplateRows)', () => {
  const addedUtilities = []

  const config = {
    target: 'relaxed',
    theme: {
      gridRowStart: {
        auto: 'auto',
        '1': '1',
      },
    },
    variants: {
      gridRowStart: ['responsive'],
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
        '.row-start-auto': {
          'grid-row-start': 'auto',
        },
        '.row-start-1': {
          'grid-row-start': '1',
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
      gridTemplateRows: {
        layout: '1fr [top] 1fr [bottom] 1fr',
        multi: '1fr [fold] 1fr [fold] 1fr',
      },
      gridRowStart: {
        auto: 'auto',
        '1': '1',
      },
    },
    variants: {
      gridRowStart: ['responsive'],
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
        '.row-start-auto': {
          'grid-row-start': 'auto',
        },
        '.row-start-1': {
          'grid-row-start': '1',
        },
        '.row-start-top': {
          'grid-row-start': 'top',
        },
        '.row-start-bottom': {
          'grid-row-start': 'bottom',
        },
        '.row-start-fold-1': {
          'grid-row-start': 'fold-1',
        },
        '.row-start-fold-2': {
          'grid-row-start': 'fold-2',
        },
      },
      variants: ['responsive'],
    },
  ])
})
