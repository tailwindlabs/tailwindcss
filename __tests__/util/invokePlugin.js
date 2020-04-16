import _ from 'lodash'
import escapeClassName from '../../src/util/escapeClassName'

export default function(plugin, config) {
  const addedUtilities = []

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
      addedUtilities.push([utilities, variants])
    },
  }

  plugin(pluginApi)

  return {
    utilities: addedUtilities,
  }
}
