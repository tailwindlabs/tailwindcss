import dlv from 'dlv'
import escapeClassName from '../src/util/escapeClassName'

export default function (plugin, config) {
  const addedUtilities = []

  const getConfigValue = (path, defaultValue) => dlv(config, path, defaultValue)
  const pluginApi = {
    config: getConfigValue,
    e: escapeClassName,
    theme: (path, defaultValue) => getConfigValue(`theme.${path}`, defaultValue),
    variants: (path, defaultValue) => {
      if (Array.isArray(config.variants)) {
        return config.variants
      }

      return getConfigValue(`variants.${path}`, defaultValue)
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
      Object.assign({}, ...(Array.isArray(utilities) ? utilities : [utilities])),
      variants,
    ]),
  }
}
