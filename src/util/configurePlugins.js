export default function(pluginConfig, plugins) {
  const pluginNames = Array.isArray(pluginConfig)
    ? pluginConfig
    : Object.keys(plugins).filter(pluginName => {
        return pluginConfig !== false && pluginConfig[pluginName] !== false
      })

  return pluginNames.map(pluginName => plugins[pluginName]())
}
