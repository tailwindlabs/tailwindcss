import * as plugins from './plugins/index.js'
import configurePlugins from './util/configurePlugins'

const jitOnlyPlugins = ['caretColor', 'content']

export default function ({ corePlugins: corePluginConfig }) {
  corePluginConfig = corePluginConfig.filter((pluginName) => !jitOnlyPlugins.includes(pluginName))

  return configurePlugins(corePluginConfig, Object.keys(plugins)).map((pluginName) => {
    return plugins[pluginName]()
  })
}
