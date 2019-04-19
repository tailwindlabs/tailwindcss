export default (pluginConfig, plugins) => {
  const pluginNames = Array.isArray(pluginConfig)
    ? pluginConfig
    : Object.keys(plugins).filter(
        pluginName => pluginConfig !== false && pluginConfig[pluginName] !== false
      )

  return pluginNames.map(pluginName => plugins[pluginName]())
}
