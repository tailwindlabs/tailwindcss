import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/letterSpacing'

test('letter spacing can use negative prefix syntax', () => {
  const addedUtilities = []

  const config = {
    theme: {
      letterSpacing: {
        '-1': '-0.025em',
        '1': '0.025em',
      },
    },
    variants: {
      letterSpacing: ['responsive'],
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
        '.-tracking-1': { 'letter-spacing': '-0.025em' },
        '.tracking-1': { 'letter-spacing': '0.025em' },
      },
      variants: ['responsive'],
    },
  ])
})
