import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'
import plugin from '../../src/plugins/cursor'

test('cursor tests', () => {
  const addedUtilities = []

  const config = {
    theme: {
      cursor: {
        auto: 'auto',
        default: 'default',
        pointer: 'pointer',
        wait: 'wait',
        text: 'text',
        move: 'move',
        'not-allowed': 'not-allowed',
      },
    },
    variants: {
      cursor: ['responsive'],
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
        '.cursor-auto': { cursor: 'auto' },
        '.cursor-default': { cursor: 'default' },
        '.cursor-pointer': { cursor: 'pointer' },
        '.cursor-wait': { cursor: 'wait' },
        '.cursor-text': { cursor: 'text' },
        '.cursor-move': { cursor: 'move' },
        '.cursor-not-allowed': { cursor: 'not-allowed' },
      },
      variants: ['responsive'],
    },
  ])
})
