import _ from 'lodash'

export default function(plugins, pluginConfig, defaultPluginConfig = {}) {
  return Object.keys(plugins)
    .filter(pluginName => {
      return pluginConfig[pluginName] !== false
    })
    .map(pluginName => {
      return plugins[pluginName](_.get(pluginConfig, pluginName, defaultPluginConfig[pluginName]))
    })
}
