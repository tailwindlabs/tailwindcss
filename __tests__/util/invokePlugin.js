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
    target: path => {
      if (_.isString(config.target)) {
        return config.target
      }

      const [defaultTarget, targetOverrides] = getConfigValue('target')

      return _.get(targetOverrides, path, defaultTarget)
    },
    addUtilities(utilities, variants) {
      addedUtilities.push([utilities, variants])
    },
    corePlugins(corePlugin) {
      if (config.corePlugins === undefined) {
        return false
      }

      if (Array.isArray(config.corePlugins)) {
        return config.corePlugins.includes(corePlugin)
      }

      return config.corePlugins[corePlugin] !== false
    },
  }

  plugin(pluginApi)

  return {
    utilities: addedUtilities.map(([utilities, variants]) => [
      _.merge({}, ..._.castArray(utilities)),
      variants,
    ]),
  }
}
