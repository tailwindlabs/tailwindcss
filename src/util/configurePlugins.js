export default function(pluginConfig, plugins) {
  return Object.keys(plugins)
    .filter(pluginName => {
      return pluginConfig[pluginName] !== false
    })
    .map(pluginName => {
      return plugins[pluginName]()
    })
}
