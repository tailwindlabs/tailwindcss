import * as plugins from './plugins/index.js'
import configurePlugins from './util/configurePlugins'

function move(items, item, before) {
  if (items.indexOf(item) === -1) {
    return items
  }

  items = [...items]
  let fromIndex = items.indexOf(item)
  let toIndex = items.indexOf(before)
  items.splice(fromIndex, 1)
  items.splice(toIndex, 0, item)
  return items
}

export default function ({ corePlugins: corePluginConfig }) {
  let pluginOrder = Object.keys(plugins)

  pluginOrder = configurePlugins(corePluginConfig, pluginOrder)
  pluginOrder = move(pluginOrder, 'transform', 'transformOrigin')
  pluginOrder = move(pluginOrder, 'filter', 'blur')
  pluginOrder = move(pluginOrder, 'backdropFilter', 'backdropBlur')

  return pluginOrder.map((pluginName) => {
    return plugins[pluginName]()
  })
}
