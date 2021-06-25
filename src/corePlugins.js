import * as plugins from './plugins/index.js'
import configurePlugins from './util/configurePlugins'

export default function ({ corePlugins: corePluginConfig }) {
  let pluginOrder = Object.keys(plugins)

  pluginOrder = configurePlugins(corePluginConfig, pluginOrder)

  return pluginOrder.map((pluginName) => {
    return plugins[pluginName]()
  })
}
