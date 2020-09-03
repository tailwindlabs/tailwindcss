import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/gridRowEnd'

test('default behaviour (no gridTemplateRows)', () => {
  const addedUtilities = []

  const config = {
    target: 'relaxed',
    theme: {
      gridRowEnd: {
        auto: 'auto',
        '1': '1',
      },
    },
    variants: {
      gridRowEnd: ['responsive'],
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
        '.row-end-auto': {
          'grid-row-end': 'auto',
        },
        '.row-end-1': {
          'grid-row-end': '1',
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
      gridRowEnd: {
        auto: 'auto',
        '1': '1',
      },
    },
    variants: {
      gridRowEnd: ['responsive'],
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
        '.row-end-auto': {
          'grid-row-end': 'auto',
        },
        '.row-end-1': {
          'grid-row-end': '1',
        },
        '.row-end-top': {
          'grid-row-end': 'top',
        },
        '.row-end-bottom': {
          'grid-row-end': 'bottom',
        },
        '.row-end-fold-1': {
          'grid-row-end': 'fold-1',
        },
        '.row-end-fold-2': {
          'grid-row-end': 'fold-2',
        },
      },
      variants: ['responsive'],
    },
  ])
})
