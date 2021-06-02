import * as plugins from './plugins/index.js'
import configurePlugins from './util/configurePlugins'

export default function ({ corePlugins: corePluginConfig }) {
  return configurePlugins(corePluginConfig, Object.keys(plugins)).map((pluginName) => {
    return plugins[pluginName]()
  })
}
