import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/maxWidth'

test('max width tests', () => {
  const addedUtilities = []

  const config = {
    theme: {
      maxWidth: {
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        full: '100%',
      },
    },
    variants: {
      maxWidth: ['responsive'],
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
        '.max-w-xs': { 'max-width': '20rem' },
        '.max-w-sm': { 'max-width': '24rem' },
        '.max-w-md': { 'max-width': '28rem' },
        '.max-w-lg': { 'max-width': '32rem' },
        '.max-w-xl': { 'max-width': '36rem' },
        '.max-w-2xl': { 'max-width': '42rem' },
        '.max-w-3xl': { 'max-width': '48rem' },
        '.max-w-4xl': { 'max-width': '56rem' },
        '.max-w-5xl': { 'max-width': '64rem' },
        '.max-w-6xl': { 'max-width': '72rem' },
        '.max-w-full': { 'max-width': '100%' },
      },
      variants: ['responsive'],
    },
  ])
})
