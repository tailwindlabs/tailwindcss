import { corePluginList } from './corePluginList.js'
import * as plugins from './plugins/index.js'

import configurePlugins from './util/configurePlugins'

export default function({ corePlugins: corePluginConfig }) {
  return configurePlugins(corePluginConfig, corePluginList).map(pluginName => {
    return plugins[pluginName]()
  })
}
