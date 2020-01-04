function createPlugin(plugin, config) {
  return {
    handler: plugin,
    config,
  }
}

createPlugin.withOptions = function(pluginFunction, configFunction = () => ({})) {
  const optionsFunction = function(options) {
    return {
      handler: pluginFunction(options),
      config: configFunction(options),
    }
  }

  optionsFunction.__isOptionsFunction = true

  return optionsFunction
}

export default createPlugin
