export default function(plugins, pluginConfig) {
  return Object.keys(plugins).filter(pluginName => {
    return pluginConfig[pluginName] !== false
  }).map(pluginName => {
    return plugins[pluginName](pluginConfig[pluginName])
  })
}
